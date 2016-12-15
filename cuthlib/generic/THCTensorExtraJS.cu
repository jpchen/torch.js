#ifndef THC_GENERIC_FILE
#define THC_GENERIC_FILE "generic/THCTensorExtraJS.cu"
#else

// #include "THCTensorExtraJS.cuh"

#if defined(THC_REAL_IS_FLOAT) || defined(THC_REAL_IS_DOUBLE)

// #if defined(THC_REAL_IS_HALF)
//   #define con(val) __float2half(val)
// #el
#if defined(THC_REAL_IS_DOUBLE)
  #define con(val) val
#elif defined(THC_REAL_IS_FLOAT)
  #define con(val) val##f
#endif

// #define IMPLEMENT_OP(NAME, CFUNC, CONFUNC, REAL)             \
//   struct Tensor_##NAME##_##REAL##_Op {                                  \
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x, real*y) const { \
//       *dx += (CFUNC)*(*thisdx);                                                \
//     }\
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x) const { \
//       *dx += (CFUNC)*(*thisdx);                                                \
//     }\
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx) const { \
//       *dx += (CFUNC)*(*thisdx);                                                \
//     }\
//                                                                        \
//   };
// #define IMPLEMENT_OP_WITH_CONST(NAME, CFUNC, CONFUNC, REAL)             \
//   struct Tensor_##NAME##_##REAL##_Op {                                  \
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x, real*y) const { \
//       *dx += (CFUNC)*(*thisdx);                                                \
//     }\
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x, real y) const { \
//       *dx += (CONFUNC)*(*thisdx);                                                \
//     }\
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx, real* x) const { \
//       *dx += (CFUNC)*(*thisdx);                                                \
//     }\
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx, real x) const { \
//       *dx += (CONFUNC)*(*thisdx);                                                \
//     }\
//     __device__ __forceinline__ void operator()(real* dx, real* thisdx) const { \
//       *dx += (CFUNC)*(*thisdx);                                                \
//     }\
//                                                                        \
//   };

#if defined(THC_REAL_IS_DOUBLE)
  #define powfct pow
#elif defined(THC_REAL_IS_FLOAT)
  #define powfct powf
#endif

#define sqrtfct THCNumerics<real>::sqrt
#define logfct THCNumerics<real>::log
#define cosfct THCNumerics<real>::cos
#define sinfct THCNumerics<real>::sin
#define sinhfct THCNumerics<real>::sinh
#define coshfct THCNumerics<real>::cosh


// d.neg = makeUnaryDerivatives('-1');
// this creates the op which kill get called within the kernel
//
IMPLEMENT_OP_DX_ARG0(dx_neg, con(-1.0), Real)
// we create a function called dx_neg which called dx_neg_Real_OP() created above
IMPLEMENT_DX_ARG0(neg, dx_neg, Real)

// d.add = makeBinaryDerivatives('1', '1');
IMPLEMENT_OP_DX_ARG0(dx_add, con(1.0), Real)

IMPLEMENT_DX_ARG0(add_f1, dx_add, Real)
IMPLEMENT_DX_ARG0_ACC(add_f1, dx_add, Real)

IMPLEMENT_DX_ARG0(add_f2, dx_add, Real)
IMPLEMENT_DX_ARG0_ACC(add_f2, dx_add, Real)

// // d.sub = makeBinaryDerivatives('1', '-1');
IMPLEMENT_DX_ARG0(sub_f1, dx_add, Real)
IMPLEMENT_DX_ARG0_ACC(sub_f1, dx_add, Real)

IMPLEMENT_DX_ARG0(sub_f2, dx_neg, Real)
IMPLEMENT_DX_ARG0_ACC(sub_f2, dx_neg, Real)

// d.mul = makeBinaryDerivatives('y', 'x');
IMPLEMENT_OP_DX_ARG1(dx_ident, *x, x, Real)
// simple function, send in our new dx_ident op
IMPLEMENT_DX_ARG1(mul_f1, dx_ident, Real)

// x, y same thing for mul, use the same op, and same setup
IMPLEMENT_DX_ARG1(mul_f2, dx_ident, Real)

// d.div = makeBinaryDerivatives('1/y', '-x/(y*y)');
IMPLEMENT_OP_DX_ARG1(dx_inv, con(1.0) / (*x), con(1.0) / x, Real)

IMPLEMENT_DX_ARG1(div_f1, dx_inv, Real)

// we need to do a regular version, and a version where the second input is constant
IMPLEMENT_OP_DX_ARG2(dx_x_y2_inv, -(*x)/((*y)*(*y)), -(*x) / (y*y), Real)

// use it as you'd expect here --
IMPLEMENT_DX_ARG2(div_f2, dx_x_y2_inv, Real)

// d.sqrt = makeUnaryDerivatives('1/(2*out)');
IMPLEMENT_OP_DX_ARG1(dx_div_2x, con(1.0) / (con(2.0) * (*x)), con(1.0) / (con(2.0) * (x)), Real)
// then we call that op
IMPLEMENT_DX_ARG1(sqrt, dx_div_2x, Real)
// d.exp = makeUnaryDerivatives('out');
// same as the dx_mul op
IMPLEMENT_DX_ARG1(exp, dx_ident, Real)
// d.log = makeUnaryDerivatives('1/x');
// same op as first input of div
IMPLEMENT_DX_ARG1(log,  dx_inv, Real)

// d.pow = makeBinaryDerivatives('y*Math.pow(x,y-1)', 'Math.log(x)*out');
IMPLEMENT_OP_DX_ARG2(dx_pow1, (*y) * powfct((*x), (*y) -1), y * powfct((*x), y -1),  Real)
IMPLEMENT_OP_DX_ARG2(dx_pow2, logfct(*x)*(*y), logfct(*x) * y,  Real)

IMPLEMENT_DX_ARG2(pow_f1, dx_pow1, Real)
IMPLEMENT_DX_ARG2(pow_f2, dx_pow2, Real)

// d.sin = makeUnaryDerivatives('Math.cos(x)');
IMPLEMENT_OP_DX_ARG1(dx_cos, cosfct(*x), cosfct(x),  Real)
IMPLEMENT_DX_ARG1(sin, dx_cos, Real)
// IMPLEMENT_THDX_1ARG(sin, cos(*x_data))

// d.cos = makeUnaryDerivatives('-Math.sin(x)');
IMPLEMENT_OP_DX_ARG1(dx_sin, -sinfct(*x), -sinfct(x),  Real)
IMPLEMENT_DX_ARG1(cos, dx_sin, Real)
// IMPLEMENT_THDX_1ARG(cos, -sin(*x_data))

// d.tan = makeUnaryDerivatives('1 + out*out');
IMPLEMENT_OP_DX_ARG1(dx_1sqr, con(1.0) + (*x) * (*x), con(1.0) + (x*x),  Real)
IMPLEMENT_DX_ARG1(tan, dx_1sqr, Real)
// IMPLEMENT_THDX_1ARG(tan, 1 + (*x_data)*(*x_data))

// d.asin = makeUnaryDerivatives('1 / Math.sqrt(1 - x*x)');
IMPLEMENT_OP_DX_ARG1(dx_1sqrt, con(1.0) / sqrtfct(con(1.0) - (*x) * (*x)), con(1.0) / sqrtfct(con(1.0) - (x * x)), Real)

// IMPLEMENT_THDX_1ARG(asin, 1 / sqrt(1 - (*x_data)*(*x_data)))
IMPLEMENT_DX_ARG1(asin, dx_1sqrt, Real)
// d.acos = makeUnaryDerivatives('-1 / Math.sqrt(1 - x*x)');
// IMPLEMENT_THDX_1ARG(acos, -1 / sqrt(1 - (*x_data)*(*x_data)))
IMPLEMENT_OP_DX_ARG1(dx_neg1sqrt, con(-1.0) / sqrtfct(con(1.0) - (*x) * (*x)), con(-1.0) / sqrtfct(con(1.0) - (x * x)), Real)
IMPLEMENT_DX_ARG1(acos, dx_neg1sqrt, Real)
// d.atan = makeUnaryDerivatives('1 / (1 + x*x)');
// IMPLEMENT_THDX_1ARG(atan, 1 / (1 + (*x_data)*(*x_data)))
IMPLEMENT_OP_DX_ARG1(dx_inv1plussqr, con(1.0) / (con(1.0) + (*x) * (*x)), con(1.0) / (con(1.0) + (x * x)), Real)
IMPLEMENT_DX_ARG1(atan, dx_inv1plussqr, Real)

// d.atan2 = makeBinaryDerivatives('y/(x*x + y*y)', '-x/(x*x + y*y)');
IMPLEMENT_OP_DX_ARG2(dx_atan2f1, (*y) / ((*x)*(*x) + (*y)*(*y)), y / ((*x)*(*x) + (y * y)), Real)
IMPLEMENT_OP_DX_ARG2(dx_atan2f2, -(*x) / ((*x)*(*x) + (*y)*(*y)), -(*x) / ((*x)*(*x) + (y * y)), Real)

IMPLEMENT_DX_ARG2(atan2_f1, dx_atan2f1, Real)
IMPLEMENT_DX_ARG2(atan2_f2, dx_atan2f2, Real)
// IMPLEMENT_THDX_2ARG(atan2_f1, (*y_data)/((*x_data)*(*x_data) + (*y_data)*(*y_data)))
// IMPLEMENT_THDX_2ARG(atan2_f2, -(*x_data)/((*x_data)*(*x_data) + (*y_data)*(*y_data)))

// d.sinh = makeUnaryDerivatives('Math.cosh(x)');
IMPLEMENT_OP_DX_ARG1(dx_cosh, coshfct(*x), coshfct(x), Real)
// IMPLEMENT_THDX_1ARG(sinh, cosh(*x_data))
IMPLEMENT_DX_ARG1(sinh, dx_cosh, Real)

// d.cosh = makeUnaryDerivatives('Math.sinh(x)');
IMPLEMENT_OP_DX_ARG1(dx_sinh, sinhfct(*x), sinhfct(x), Real)
// IMPLEMENT_THDX_1ARG(cosh, sinh(*x_data))
IMPLEMENT_DX_ARG1(cosh, dx_sinh, Real)

// d.tanh = makeUnaryDerivatives('1 - out*out');
IMPLEMENT_OP_DX_ARG1(dx_1minsqr, con(1.0) - (*x)*(*x), con(1.0) - (x * x), Real)
IMPLEMENT_DX_ARG1(tanh, dx_1minsqr, Real)
// IMPLEMENT_THDX_1ARG(tanh, 1 - (*x_data)*(*x_data))

// d.asinh = makeUnaryDerivatives('1 / Math.sqrt(x*x + 1)');
IMPLEMENT_OP_DX_ARG1(dx_isqrtplus, con(1.0) / sqrtfct(con(1.0) + (*x) * (*x)), con(1.0) / sqrtfct(con(1.0) + (x * x)), Real)
IMPLEMENT_DX_ARG1(asinh, dx_isqrtplus, Real)
// IMPLEMENT_THDX_1ARG(asinh, 1 / sqrt((*x_data)*(*x_data) + 1))

// d.acosh = makeUnaryDerivatives('1 / Math.sqrt(x*x - 1)');
IMPLEMENT_OP_DX_ARG1(dx_isqrtmin, con(1.0) / sqrtfct((*x) * (*x) - con(1.0)), con(1.0) / sqrtfct((x * x) - con(1.0)), Real)
IMPLEMENT_DX_ARG1(acosh, dx_isqrtmin, Real)
// IMPLEMENT_THDX_1ARG(acosh, 1 / sqrt((*x_data)*(*x_data) - 1))

// d.atanh = makeUnaryDerivatives('1 / (1 - x*x)');
IMPLEMENT_OP_DX_ARG1(dx_inv1minsqr, con(1.0) / (con(1.0) - (*x) * (*x)), con(1.0) / (con(1.0) - (x * x)), Real)
// IMPLEMENT_THDX_1ARG(atanh, 1 / (1 - (*x_data)*(*x_data)))
IMPLEMENT_DX_ARG1(atanh, dx_inv1minsqr, Real)

// d.sigmoid = makeUnaryDerivatives('out * (1 - out)');
IMPLEMENT_OP_DX_ARG1(dx_sigop, (*x) * (con(1.0) - (*x)), x * (con(1.0) - x),  Real)
IMPLEMENT_DX_ARG1(sigmoid, dx_sigop, Real)
// IMPLEMENT_THDX_1ARG(sigmoid, (*x_data) * (1 - (*x_data)))


// IMPLEMENT_CUDA_TENSOR_BASIC_FUNC(  log, THCNumerics<real>::log,   Real)
// IMPLEMENT_CUDA_TENSOR_BASIC_FUNC(log1p, THCNumerics<real>::log1p, Real)

#undef con
#undef powfct
#undef logfct
#undef sqrtfct

#undef sinfct
#undef cosfct

#undef coshfct
#undef sinhfct
// remove the helper for different constant types (float/double)

#endif
//close out if float/double

#endif
