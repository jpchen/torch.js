#ifndef THC_TENSOR_EXTRA_CUH
#define THC_TENSOR_EXTRA_CUH

#include "THCTensorMath.h"
#include "THCGeneral.h"
#include "THCHalf.h"
#include "THCTensorCopy.h"
#include "THCApply.cuh"
#include "THCNumerics.cuh"
#include "THCReduce.cuh"

template <typename T>
struct TensorCustomOp {
  __device__ __forceinline__ void operator()(T* out, T* in) {
    *out = powf((float) *out, (float) *in);
  }

  __device__ __forceinline__ void operator()(T* out, T* in1, T* in2) {
    *out = powf((float) *in1, (float) *in2);
  }
};

template <>
struct TensorCustomOp<double> {
  __device__ __forceinline__ void operator()(double* out, double* in) {
    *out = pow(*out, *in);
  }

  __device__ __forceinline__ void operator()(double* out, double* in1, double* in2) {
    *out = pow(*in1, *in2);
  }
};

#ifdef CUDA_HALF_TENSOR
template <>
struct TensorCustomOp<half> {
  __device__ __forceinline__ void operator()(half* out, half* in) {
    // No fp16 pow function yet
    float fout = __half2float(*out);
    float fin = __half2float(*in);
    fout = powf(fout, fin);
    *out = __float2half(fout);
  }

  __device__ __forceinline__ void operator()(half* out, half* in1, half* in2) {
    // No fp16 pow function yet
    float fin1 = __half2float(*in1);
    float fin2 = __half2float(*in2);
    float fout = powf(fin1, fin2);
    *out = __float2half(fout);
  }
};
#endif // CUDA_HALF_TENSOR



//
// This file contains pointwise operation functions and kernels that
// work on both contiguous and non-contiguous tensor arguments of
// arbitrary (up to MAX_CUTORCH_DIMS) dimensioned arguments without
// copying or temporary storage.
//

// Threads per block for our apply kernel
// FIXME: use occupancy calculator instead
#define THC_APPLY_THREADS_PER_BLOCK 32 * 16

template <typename Op,
          typename Ta, typename Tb, typename Tc, typename Td,
          typename IndexType,
          int ADims, int BDims, int CDims, int DDims>
#if __CUDA_ARCH__ >= 350
__launch_bounds__(32 * 16, 4)
#endif
__global__ void
kernelPointwiseApply4(TensorInfo<Ta, IndexType> a,
                      TensorInfo<Tb, IndexType> b,
                      TensorInfo<Tc, IndexType> c,
                      TensorInfo<Td, IndexType> d,
                      IndexType totalElements,
                      Op op) {
  for (IndexType linearIndex = blockIdx.x * blockDim.x + threadIdx.x;
       linearIndex < totalElements;
       linearIndex += gridDim.x * blockDim.x) {
    // Convert `linearIndex` into an offset of `a`
    const IndexType aOffset =
      IndexToOffset<Ta, IndexType, ADims>::get(linearIndex, a);

    // Convert `linearIndex` into an offset of `b`
    const IndexType bOffset =
      IndexToOffset<Tb, IndexType, BDims>::get(linearIndex, b);

    // Convert `linearIndex` into an offset of `c`
    const IndexType cOffset =
      IndexToOffset<Tc, IndexType, CDims>::get(linearIndex, c);

     // Convert `linearIndex` into an offset of `d`
    const IndexType dOffset =
      IndexToOffset<Td, IndexType, DDims>::get(linearIndex, d);

    op(&a.data[aOffset], &b.data[bOffset], &c.data[cOffset], &d.data[dOffset]);
  }
}


template <typename TensorTypeA,
          typename TensorTypeB,
          typename TensorTypeC,
          typename TensorTypeD,
          typename Op>
bool THC_pointwiseApply4(THCState* state,
                         TensorTypeA* a,
                         TensorTypeB* b,
                         TensorTypeC* c,
                         TensorTypeD* d,
                         const Op& op,
                         TensorArgType aType = ReadWrite,
                         TensorArgType bType = ReadOnly,
                         TensorArgType cType = ReadOnly,
                         TensorArgType dType = ReadOnly) {
  long totalElements = TensorUtils<TensorTypeA>::getNumElements(state, a);

  if (totalElements != TensorUtils<TensorTypeB>::getNumElements(state, b) ||
      totalElements != TensorUtils<TensorTypeC>::getNumElements(state, c) ||
      totalElements != TensorUtils<TensorTypeD>::getNumElements(state, d)
      ) {
    return false;
  }

  if (TensorUtils<TensorTypeA>::getDims(state, a) > MAX_CUTORCH_DIMS ||
      TensorUtils<TensorTypeB>::getDims(state, b) > MAX_CUTORCH_DIMS ||
      TensorUtils<TensorTypeC>::getDims(state, c) > MAX_CUTORCH_DIMS ||
      TensorUtils<TensorTypeD>::getDims(state, d) > MAX_CUTORCH_DIMS
      ) {
    return false;
  }

  if (TensorUtils<TensorTypeA>::getDims(state, a) == 0) {
    // Zero-dim tensor; do nothing
    return true;
  }

  const dim3 block = getApplyBlock();

  dim3 grid;
  if (!getApplyGrid(state, totalElements, grid)) {
    return false;
  }

  // If tensor args have overlapping indices and are read/write, then
  // we must expand the tensor to a contiguous form first, since
  // otherwise there are conflicting writes. Upon copying back to the
  // non-contiguous form, there will be conflicting writes, but at
  // least with copy, one of the updaters will win atomically. This is
  // a sketchy property of the old system as well (writing into all
  // indices of a tensor with overlapping indices should probably be
  // an error, since it is unclear which one should win), but we will
  // preserve this last-writer-wins (in arbitrary copy order) behavior.
  TensorTypeA* oldA = NULL;
  TensorTypeB* oldB = NULL;
  TensorTypeC* oldC = NULL;
  TensorTypeD* oldD = NULL;

  if (aType == ReadWrite &&
      TensorUtils<TensorTypeA>::overlappingIndices(state, a)) {
    // Must perform in contiguous space
    oldA = a;
    a = TensorUtils<TensorTypeA>::newContiguous(state, a);
  }
  if (bType == ReadWrite &&
      TensorUtils<TensorTypeB>::overlappingIndices(state, b)) {
    // Must perform in contiguous space
    oldB = b;
    b = TensorUtils<TensorTypeB>::newContiguous(state, b);
  }
  if (cType == ReadWrite &&
      TensorUtils<TensorTypeC>::overlappingIndices(state, c)) {
    // Must perform in contiguous space
    oldC = c;
    c = TensorUtils<TensorTypeC>::newContiguous(state, c);
  }

  if (dType == ReadWrite &&
      TensorUtils<TensorTypeD>::overlappingIndices(state, d)) {
    // Must perform in contiguous space
    oldD = d;
    d = TensorUtils<TensorTypeD>::newContiguous(state, d);
  }


#define HANDLE_CASE(TYPE, A, B, C, D)                                      \
  kernelPointwiseApply4<Op,                                             \
                        typename TensorUtils<TensorTypeA>::DataType,    \
                        typename TensorUtils<TensorTypeB>::DataType,    \
                        typename TensorUtils<TensorTypeC>::DataType,    \
                        typename TensorUtils<TensorTypeD>::DataType,    \
                        TYPE, A, B, C, D>                                  \
    <<<grid, block, 0, THCState_getCurrentStream(state)>>>(             \
      aInfo, bInfo, cInfo, dInfo, (TYPE) totalElements, op);

#define HANDLE_D_CASE(TYPE, A, B, C, D)            \
  {                                             \
    if (dInfo.isContiguous()) {                 \
      HANDLE_CASE(TYPE, A, B, C, -2);              \
    } else {                                    \
      switch (D) {                              \
        case 1:                                 \
        HANDLE_CASE(TYPE, A, B, C, 1);             \
        break;                                  \
        case 2:                                 \
        HANDLE_CASE(TYPE, A, B, C, 2);             \
        break;                                  \
        default:                                \
        HANDLE_CASE(TYPE, A, B, C, -1);            \
        break;                                  \
      }                                         \
    }                                           \
  }


#define HANDLE_C_CASE(TYPE, A, B, C, D)            \
  {                                             \
    if (cInfo.isContiguous()) {                 \
      HANDLE_D_CASE(TYPE, A, B, -2, D);              \
    } else {                                    \
      switch (C) {                              \
        case 1:                                 \
        HANDLE_D_CASE(TYPE, A, B, 1, D);             \
        break;                                  \
        case 2:                                 \
        HANDLE_D_CASE(TYPE, A, B, 2, D);             \
        break;                                  \
        default:                                \
        HANDLE_D_CASE(TYPE, A, B, -1, D);            \
        break;                                  \
      }                                         \
    }                                           \
  }

#define HANDLE_B_CASE(TYPE, A, B, C, D)            \
  {                                             \
    if (bInfo.isContiguous()) {                 \
      HANDLE_C_CASE(TYPE, A, -2, C, D);            \
    } else {                                    \
      switch (B) {                              \
        case 1:                                 \
        HANDLE_C_CASE(TYPE, A, 1, C, D);           \
        break;                                  \
        case 2:                                 \
        HANDLE_C_CASE(TYPE, A, 2, C, D);           \
        break;                                  \
        default:                                \
        HANDLE_C_CASE(TYPE, A, -1, C, D);          \
        break;                                  \
      }                                         \
    }                                           \
  }

#define HANDLE_A_CASE(TYPE, A, B, C, D)            \
  {                                             \
    if (aInfo.isContiguous()) {                 \
      HANDLE_B_CASE(TYPE, -2, B, C, D);            \
    } else {                                    \
      switch (A) {                              \
        case 1:                                 \
        HANDLE_B_CASE(TYPE, 1, B, C, D);           \
        break;                                  \
        case 2:                                 \
        HANDLE_B_CASE(TYPE, 2, B, C, D);           \
        break;                                  \
        default:                                \
        HANDLE_B_CASE(TYPE, -1, B, C, D);          \
        break;                                  \
      }                                         \
    }                                           \
  }

  if (TensorUtils<TensorTypeA>::canUse32BitIndexMath(state, a) &&
      TensorUtils<TensorTypeB>::canUse32BitIndexMath(state, b) &&
      TensorUtils<TensorTypeC>::canUse32BitIndexMath(state, c) &&
      TensorUtils<TensorTypeD>::canUse32BitIndexMath(state, d)
      ) {
    TensorInfo<typename TensorUtils<TensorTypeA>::DataType, unsigned int> aInfo =
      getTensorInfo<TensorTypeA, unsigned int>(state, a);
    aInfo.collapseDims();

    TensorInfo<typename TensorUtils<TensorTypeB>::DataType, unsigned int> bInfo =
      getTensorInfo<TensorTypeB, unsigned int>(state, b);
    bInfo.collapseDims();

    TensorInfo<typename TensorUtils<TensorTypeC>::DataType, unsigned int> cInfo =
      getTensorInfo<TensorTypeC, unsigned int>(state, c);
    cInfo.collapseDims();

    TensorInfo<typename TensorUtils<TensorTypeD>::DataType, unsigned int> dInfo =
    getTensorInfo<TensorTypeD, unsigned int>(state, d);
    dInfo.collapseDims();

    HANDLE_A_CASE(unsigned int, aInfo.dims, bInfo.dims, cInfo.dims, dInfo.dims);
  } else {
    TensorInfo<typename TensorUtils<TensorTypeA>::DataType, unsigned long> aInfo =
      getTensorInfo<TensorTypeA, unsigned long>(state, a);
    aInfo.collapseDims();

    TensorInfo<typename TensorUtils<TensorTypeB>::DataType, unsigned long> bInfo =
      getTensorInfo<TensorTypeB, unsigned long>(state, b);
    bInfo.collapseDims();

    TensorInfo<typename TensorUtils<TensorTypeC>::DataType, unsigned long> cInfo =
      getTensorInfo<TensorTypeC, unsigned long>(state, c);
    cInfo.collapseDims();

    TensorInfo<typename TensorUtils<TensorTypeD>::DataType, unsigned long> dInfo =
      getTensorInfo<TensorTypeD, unsigned long>(state, d);
    dInfo.collapseDims();

    // For large tensors, we only compile the completely contiguous
    // version and the completely generic version, to reduce
    // compilation time.
    if (aInfo.isContiguous() && bInfo.isContiguous() && cInfo.isContiguous() && dInfo.isContiguous()) {
      kernelPointwiseApply4<Op,
                            typename TensorUtils<TensorTypeA>::DataType,
                            typename TensorUtils<TensorTypeB>::DataType,
                            typename TensorUtils<TensorTypeC>::DataType,
                            typename TensorUtils<TensorTypeD>::DataType,
                            unsigned long, -2, -2, -2, -2>
        <<<grid, block, 0, THCState_getCurrentStream(state)>>>(
          aInfo, bInfo, cInfo, dInfo, (unsigned long) totalElements, op);
    } else {
      kernelPointwiseApply4<Op,
                            typename TensorUtils<TensorTypeA>::DataType,
                            typename TensorUtils<TensorTypeB>::DataType,
                            typename TensorUtils<TensorTypeC>::DataType,
                            typename TensorUtils<TensorTypeD>::DataType,
                            unsigned long, -1, -1, -1, -1>
        <<<grid, block, 0, THCState_getCurrentStream(state)>>>(
          aInfo, bInfo, cInfo, dInfo, (unsigned long) totalElements, op);
    }
  }
#undef HANDLE_CASE
#undef HANDLE_D_CASE
#undef HANDLE_C_CASE
#undef HANDLE_B_CASE
#undef HANDLE_A_CASE

  if (oldA) {
    // Ignore overlaps when copying back; if we use THCTensor_copy
    // instead, it will recursively try and invoke ourselves to make
    // oldA contiguous.
    TensorUtils<TensorTypeA>::copyIgnoringOverlaps(state, oldA, a);
    TensorUtils<TensorTypeA>::free(state, a);
    a = oldA;
  }

  if (oldB) {
    // Ignore overlaps when copying back; if we use THCTensor_copy
    // instead, it will recursively try and invoke ourselves to make
    // oldB contiguous.
    TensorUtils<TensorTypeB>::copyIgnoringOverlaps(state, oldB, b);
    TensorUtils<TensorTypeB>::free(state, b);
    b = oldB;
  }

  if (oldC) {
    // Ignore overlaps when copying back; if we use THCTensor_copy
    // instead, it will recursively try and invoke ourselves to make
    // oldC contiguous.
    TensorUtils<TensorTypeC>::copyIgnoringOverlaps(state, oldC, c);
    TensorUtils<TensorTypeC>::free(state, c);
    c = oldC;
  }
  if (oldD) {
    // Ignore overlaps when copying back; if we use THCTensor_copy
    // instead, it will recursively try and invoke ourselves to make
    // oldD contiguous.
    TensorUtils<TensorTypeD>::copyIgnoringOverlaps(state, oldD, d);
    TensorUtils<TensorTypeD>::free(state, d);
    d = oldD;
  }

  return true;
}

#undef THC_APPLY_THREADS_PER_BLOCK

#define OP_ARG2(CFUNC, OPNAME)\
  __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x, real*y) const { \
    *dx += (CFUNC)*(*thisdx);                                                \
  }

#define OP_ARG2_C(CFUNC, OPNAME)\
  const real y;\
  OPNAME(real val) : y(val) {}\
  OPNAME() : y((real)0) {}\
  __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x) const { \
    *dx += (CFUNC)*(*thisdx);                                                \
  }

#define OP_ARG1(CFUNC, OPNAME)\
  __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x) const { \
    *dx += (CFUNC)*(*thisdx);                                                \
  }

#define OP_ARG1_C(CFUNC, OPNAME)\
  const real x;\
  OPNAME(real val) : x(val) {}\
  OPNAME() : x((real)0) {}\
  __device__ __forceinline__ void operator()(real* dx, real* thisdx) const { \
    *dx += (CFUNC)*(*thisdx);                                                \
  }

#define OP_ARG0(CFUNC)\
  __device__ __forceinline__ void operator()(real* dx, real* thisdx) const { \
    *dx += (CFUNC)*(*thisdx);                                                \
  }

#define IMPLEMENT_OP_DX_ARG0_(NAME, CFUNC, REAL)\
  struct Tensor_##NAME##_##REAL##_Op {                                  \
	 OP_ARG0(CFUNC)\
  };

#define IMPLEMENT_OP_DX_ARG0(NAME, CFUNC, REAL) \
 IMPLEMENT_OP_DX_ARG0_(NAME, CFUNC, REAL)


#define IMPLEMENT_OP_DX_ARG1_(NAME, CFUNC, CONFUNC, REAL)\
  struct Tensor_##NAME##_##REAL##_Op {                                  \
      OP_ARG1_C(CONFUNC, Tensor_##NAME##_##REAL##_Op)\
      OP_ARG1(CFUNC, Tensor_##NAME##_##REAL##_Op)\
  };

#define IMPLEMENT_OP_DX_ARG1(NAME, CFUNC, CONFUNC, REAL) \
 IMPLEMENT_OP_DX_ARG1_(NAME, CFUNC, CONFUNC, REAL)

#define IMPLEMENT_OP_DX_ARG2_(NAME, CFUNC, CONFUNC, REAL)\
  struct Tensor_##NAME##_##REAL##_Op {                                  \
      OP_ARG2_C(CONFUNC, Tensor_##NAME##_##REAL##_Op)\
      OP_ARG2(CFUNC, Tensor_##NAME##_##REAL##_Op)\
  };

#define IMPLEMENT_OP_DX_ARG2(NAME, CFUNC, CONFUNC, REAL) \
 IMPLEMENT_OP_DX_ARG2_(NAME, CFUNC, CONFUNC, REAL)

#define IMPLEMENT_DX_ARG0_(NAME, OPNAME, REAL)\
  void THCTensor_(dx_##NAME)(THCState* state, THCTensor* dx, THCTensor* thisdx) { \
    THAssert(THCTensor_(checkGPU)(state, 2, dx, thisdx));               \
                                                          \
      THCTensor_(resizeAs)(state, dx, thisdx);                          \
                                                                        \
      if (!THC_pointwiseApply2(state, dx, thisdx, Tensor_##OPNAME##_##REAL##_Op())) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
                                                                        \
    THCudaCheck(cudaGetLastError());                                    \
  }

#define IMPLEMENT_DX_ARG0(NAME, OPNAME, REAL) \
  IMPLEMENT_DX_ARG0_(NAME, OPNAME, REAL)

#define IMPLEMENT_DX_ARG0_ACC_(NAME, OPNAME, REAL)\
  accreal THCTensor_(dx_acc_##NAME)(THCState* state, THCTensor* thisdx) { \
    THCTensor* dx = THCTensor_(new)(state);\
    THCTensor_(resizeAs)(state, dx, thisdx);                          \
    THAssert(THCTensor_(checkGPU)(state, 2, dx, thisdx));               \
                                                          \
                                                                        \
      if (!THC_pointwiseApply2(state, dx, thisdx, Tensor_##OPNAME##_##REAL##_Op())) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
    accreal val = THCTensor_(sumall)(state, dx);\
                                                                        \
    THCTensor_(free)(state, dx);                                                                    \
    THCudaCheck(cudaGetLastError());                                    \
    return val;\
  }


#define IMPLEMENT_DX_ARG0_ACC(NAME, OPNAME, REAL) \
  IMPLEMENT_DX_ARG0_ACC_(NAME, OPNAME, REAL)

#define IMPLEMENT_DX_ARG1_(NAME, OPNAME, REAL)\
  void THCTensor_(dx_##NAME)(THCState* state, THCTensor* dx, THCTensor* thisdx, THCTensor* x) { \
    THAssert(THCTensor_(checkGPU)(state, 3, dx, thisdx, x));               \
                                                          \
      THCTensor_(resizeAs)(state, dx, thisdx);                          \
                                                                        \
      if (!THC_pointwiseApply3(state, dx, thisdx, x, Tensor_##OPNAME##_##REAL##_Op())) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
                                                                        \
    THCudaCheck(cudaGetLastError());                                    \
  }



#define IMPLEMENT_DX_ARG1_ACC_CONST_(NAME, OPNAME, REAL)\
  accreal THCTensor_(dx_acc_##NAME)(THCState* state, THCTensor* thisdx, real x) { \
    THCTensor* dx = THCTensor_(new)(state);\
    THAssert(THCTensor_(checkGPU)(state, 2, dx, thisdx));               \
    THCTensor_(resizeAs)(state, dx, thisdx);                          \
                                                          \
                                                                        \
      if (!THC_pointwiseApply2(state, dx, thisdx, Tensor_##OPNAME##_##REAL##_Op(x))) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
    accreal val = THCTensor_(sumall)(state, dx);\
                                                                        \
    THCTensor_(free)(state, dx);                                                                    \
    THCudaCheck(cudaGetLastError());                                    \
    return val;\
  }\
  void THCTensor_(dx_const_##NAME)(THCState* state, THCTensor* dx, THCTensor* thisdx, real x) { \
    THAssert(THCTensor_(checkGPU)(state, 2, dx, thisdx));               \
    THCTensor_(resizeAs)(state, dx, thisdx);                          \
                                                          \
                                                                        \
      if (!THC_pointwiseApply2(state, dx, thisdx, Tensor_##OPNAME##_##REAL##_Op(x))) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
                                                                        \
    THCudaCheck(cudaGetLastError());                                    \
  }

#define IMPLEMENT_DX_ARG1(NAME, OPNAME, REAL) \
  IMPLEMENT_DX_ARG1_(NAME, OPNAME, REAL)\
  IMPLEMENT_DX_ARG1_ACC_CONST_(NAME, OPNAME, REAL)

// Now we do two argument versions
#define IMPLEMENT_DX_ARG2_(NAME, OPNAME, REAL)\
  void THCTensor_(dx_##NAME)(THCState* state, THCTensor* dx, THCTensor* thisdx, THCTensor* x, THCTensor* y) { \
    THAssert(THCTensor_(checkGPU)(state, 4, dx, thisdx, x, y));               \
                                                          \
      THCTensor_(resizeAs)(state, dx, thisdx);                          \
                                                                        \
      if (!THC_pointwiseApply4(state, dx, thisdx, x, y, Tensor_##OPNAME##_##REAL##_Op())) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
                                                                        \
    THCudaCheck(cudaGetLastError());                                    \
  }



#define IMPLEMENT_DX_ARG2_ACC_CONST_(NAME, OPNAME, REAL)\
  accreal THCTensor_(dx_acc_##NAME)(THCState* state, THCTensor* thisdx, THCTensor* x, real y) { \
    THCTensor* dx = THCTensor_(new)(state);\
    THAssert(THCTensor_(checkGPU)(state, 3, dx, thisdx,x));               \
    THCTensor_(resizeAs)(state, dx, thisdx);                          \
                                                          \
                                                                        \
      if (!THC_pointwiseApply3(state, dx, thisdx, x, Tensor_##OPNAME##_##REAL##_Op(y))) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
    accreal val = THCTensor_(sumall)(state, dx);\
                                                                        \
    THCTensor_(free)(state, dx);                                                                    \
    THCudaCheck(cudaGetLastError());                                    \
    return val;\
  }\
  void THCTensor_(dx_const_##NAME)(THCState* state, THCTensor* dx, THCTensor* thisdx, THCTensor* x, real y) { \
    THAssert(THCTensor_(checkGPU)(state, 3, dx, thisdx, x));               \
    THCTensor_(resizeAs)(state, dx, thisdx);                          \
                                                          \
                                                                        \
      if (!THC_pointwiseApply3(state, dx, thisdx, x, Tensor_##OPNAME##_##REAL##_Op(y))) { \
        THArgCheck(false, 2, CUTORCH_DIM_WARNING);                      \
      }                                                                 \
                                                                        \
    THCudaCheck(cudaGetLastError());                                    \
  }


#define IMPLEMENT_DX_ARG2(NAME, OPNAME, REAL) \
  IMPLEMENT_DX_ARG2_(NAME, OPNAME, REAL)\
  IMPLEMENT_DX_ARG2_ACC_CONST_(NAME, OPNAME, REAL)



#endif // THC_TENSOR_EXTRA_CUH
