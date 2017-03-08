#ifndef TH_GENERIC_FILE
#define TH_GENERIC_FILE "generic/THTensorExtraJS.c"
#else

#include "THTensorExtraJS.h"




// #define jscb THTensor_(jscallback)
// typedef real (*THTensor_(jscallback))(real i_val);

// void THTensor_(fctapply)(THTensor *r_, THTensor_(jscallback) js_fct);
void THTensor_(fctapply)(THTensor *tensor, jscb js_fct)
{ 
  TH_TENSOR_APPLY(real, tensor, *tensor_data= (*js_fct)(*tensor_data););
}

#if defined(TH_REAL_IS_FLOAT) || defined(TH_REAL_IS_DOUBLE)

#define TH_TENSOR_APPLY4(TYPE1, TENSOR1, TYPE2, TENSOR2, TYPE3, TENSOR3, TYPE4, TENSOR4, CODE) \
{ \
  TYPE1 *TENSOR1##_data = NULL; \
  long *TENSOR1##_counter = NULL; \
  long TENSOR1##_stride = 0, TENSOR1##_size = 0, TENSOR1##_dim = 0, TENSOR1##_i, TENSOR1##_n; \
  TYPE2 *TENSOR2##_data = NULL; \
  long *TENSOR2##_counter = NULL; \
  long TENSOR2##_stride = 0, TENSOR2##_size = 0, TENSOR2##_dim = 0, TENSOR2##_i, TENSOR2##_n; \
  TYPE3 *TENSOR3##_data = NULL; \
  long *TENSOR3##_counter = NULL; \
  long TENSOR3##_stride = 0, TENSOR3##_size = 0, TENSOR3##_dim = 0, TENSOR3##_i, TENSOR3##_n; \
  TYPE4 *TENSOR4##_data = NULL; \
  long *TENSOR4##_counter = NULL; \
  long TENSOR4##_stride = 0, TENSOR4##_size = 0, TENSOR4##_dim = 0, TENSOR4##_i, TENSOR4##_n; \
  int TH_TENSOR_APPLY_hasFinished = 0; \
\
  TENSOR1##_n = (TENSOR1->nDimension ? 1 : 0); \
  for(TENSOR1##_i = 0; TENSOR1##_i < TENSOR1->nDimension; TENSOR1##_i++) \
    TENSOR1##_n *= TENSOR1->size[TENSOR1##_i]; \
\
  TENSOR2##_n = (TENSOR2->nDimension ? 1 : 0); \
  for(TENSOR2##_i = 0; TENSOR2##_i < TENSOR2->nDimension; TENSOR2##_i++) \
    TENSOR2##_n *= TENSOR2->size[TENSOR2##_i]; \
\
  TENSOR3##_n = (TENSOR3->nDimension ? 1 : 0); \
  for(TENSOR3##_i = 0; TENSOR3##_i < TENSOR3->nDimension; TENSOR3##_i++) \
    TENSOR3##_n *= TENSOR3->size[TENSOR3##_i]; \
  \
  TENSOR4##_n = (TENSOR4->nDimension ? 1 : 0); \
  for(TENSOR4##_i = 0; TENSOR4##_i < TENSOR4->nDimension; TENSOR4##_i++) \
    TENSOR4##_n *= TENSOR4->size[TENSOR4##_i]; \
\
  if(TENSOR1##_n != TENSOR2##_n || TENSOR1##_n != TENSOR3##_n || TENSOR1##_n != TENSOR4##_n) /* should we do the check in the function instead? i think so */ \
    THError("inconsistent tensor size"); \
\
  if(TENSOR1->nDimension == 0) \
    TH_TENSOR_APPLY_hasFinished = 1; \
  else \
  { \
    TENSOR1##_data = TENSOR1->storage->data+TENSOR1->storageOffset; \
    for(TENSOR1##_dim = TENSOR1->nDimension-1; TENSOR1##_dim >= 0; TENSOR1##_dim--) \
    { \
      if(TENSOR1->size[TENSOR1##_dim] != 1) \
        break; \
    } \
    TENSOR1##_stride = (TENSOR1##_dim == -1 ? 0 : TENSOR1->stride[TENSOR1##_dim]); \
    TENSOR1##_size = 1; \
    for(TENSOR1##_dim = TENSOR1->nDimension-1; TENSOR1##_dim >= 0; TENSOR1##_dim--) \
    { \
      if(TENSOR1->size[TENSOR1##_dim] != 1) \
      { \
        if(TENSOR1->stride[TENSOR1##_dim] == TENSOR1##_size) \
          TENSOR1##_size *= TENSOR1->size[TENSOR1##_dim]; \
        else \
          break; \
      } \
    } \
    TENSOR1##_counter = (long*)THAlloc(sizeof(long)*(TENSOR1##_dim+1)); \
    for(TENSOR1##_i = 0; TENSOR1##_i <= TENSOR1##_dim; TENSOR1##_i++) \
      TENSOR1##_counter[TENSOR1##_i] = 0; \
\
    TENSOR2##_data = TENSOR2->storage->data+TENSOR2->storageOffset; \
    for(TENSOR2##_dim = TENSOR2->nDimension-1; TENSOR2##_dim >= 0; TENSOR2##_dim--) \
    { \
      if(TENSOR2->size[TENSOR2##_dim] != 1) \
        break; \
    } \
    TENSOR2##_stride = (TENSOR2##_dim == -1 ? 0 : TENSOR2->stride[TENSOR2##_dim]); \
    TENSOR2##_size = 1; \
    for(TENSOR2##_dim = TENSOR2->nDimension-1; TENSOR2##_dim >= 0; TENSOR2##_dim--) \
    { \
      if(TENSOR2->size[TENSOR2##_dim] != 1) \
      { \
        if(TENSOR2->stride[TENSOR2##_dim] == TENSOR2##_size) \
          TENSOR2##_size *= TENSOR2->size[TENSOR2##_dim]; \
        else \
          break; \
      } \
    } \
    TENSOR2##_counter = (long*)THAlloc(sizeof(long)*(TENSOR2##_dim+1)); \
    for(TENSOR2##_i = 0; TENSOR2##_i <= TENSOR2##_dim; TENSOR2##_i++) \
      TENSOR2##_counter[TENSOR2##_i] = 0; \
\
    TENSOR3##_data = TENSOR3->storage->data+TENSOR3->storageOffset; \
    for(TENSOR3##_dim = TENSOR3->nDimension-1; TENSOR3##_dim >= 0; TENSOR3##_dim--) \
    { \
      if(TENSOR3->size[TENSOR3##_dim] != 1) \
        break; \
    } \
    TENSOR3##_stride = (TENSOR3##_dim == -1 ? 0 : TENSOR3->stride[TENSOR3##_dim]); \
    TENSOR3##_size = 1; \
    for(TENSOR3##_dim = TENSOR3->nDimension-1; TENSOR3##_dim >= 0; TENSOR3##_dim--) \
    { \
      if(TENSOR3->size[TENSOR3##_dim] != 1) \
      { \
        if(TENSOR3->stride[TENSOR3##_dim] == TENSOR3##_size) \
          TENSOR3##_size *= TENSOR3->size[TENSOR3##_dim]; \
        else \
          break; \
      } \
    } \
    TENSOR3##_counter = (long*)THAlloc(sizeof(long)*(TENSOR3##_dim+1)); \
    for(TENSOR3##_i = 0; TENSOR3##_i <= TENSOR3##_dim; TENSOR3##_i++) \
      TENSOR3##_counter[TENSOR3##_i] = 0; \
    \
    TENSOR4##_data = TENSOR4->storage->data+TENSOR4->storageOffset; \
    for(TENSOR4##_dim = TENSOR4->nDimension-1; TENSOR4##_dim >= 0; TENSOR4##_dim--) \
    { \
      if(TENSOR4->size[TENSOR4##_dim] != 1) \
        break; \
    } \
    TENSOR4##_stride = (TENSOR4##_dim == -1 ? 0 : TENSOR4->stride[TENSOR4##_dim]); \
    TENSOR4##_size = 1; \
    for(TENSOR4##_dim = TENSOR4->nDimension-1; TENSOR4##_dim >= 0; TENSOR4##_dim--) \
    { \
      if(TENSOR4->size[TENSOR4##_dim] != 1) \
      { \
        if(TENSOR4->stride[TENSOR4##_dim] == TENSOR4##_size) \
          TENSOR4##_size *= TENSOR4->size[TENSOR4##_dim]; \
        else \
          break; \
      } \
    } \
    TENSOR4##_counter = (long*)THAlloc(sizeof(long)*(TENSOR4##_dim+1)); \
    for(TENSOR4##_i = 0; TENSOR4##_i <= TENSOR4##_dim; TENSOR4##_i++) \
      TENSOR4##_counter[TENSOR4##_i] = 0; \
  } \
\
  TENSOR1##_i = 0; \
  TENSOR2##_i = 0; \
  TENSOR3##_i = 0; \
  TENSOR4##_i = 0; \
  while(!TH_TENSOR_APPLY_hasFinished) \
  { \
    for(; TENSOR1##_i < TENSOR1##_size && TENSOR2##_i < TENSOR2##_size && TENSOR3##_i < TENSOR3##_size && TENSOR4##_i < TENSOR4##_size; TENSOR1##_i++, TENSOR2##_i++, TENSOR3##_i++, TENSOR4##_i++, TENSOR1##_data += TENSOR1##_stride, TENSOR2##_data += TENSOR2##_stride, TENSOR3##_data += TENSOR3##_stride, TENSOR4##_data += TENSOR4##_stride) /* 0 et pas TENSOR##_dim! */ \
    { \
      CODE \
    } \
\
    if(TENSOR1##_i == TENSOR1##_size) \
    { \
      if(TENSOR1##_dim == -1) \
         break; \
\
      TENSOR1##_data -= TENSOR1##_size*TENSOR1##_stride; \
      for(TENSOR1##_i = TENSOR1##_dim; TENSOR1##_i >= 0; TENSOR1##_i--) \
      { \
        TENSOR1##_counter[TENSOR1##_i]++; \
        TENSOR1##_data += TENSOR1->stride[TENSOR1##_i]; \
\
        if(TENSOR1##_counter[TENSOR1##_i]  == TENSOR1->size[TENSOR1##_i]) \
        { \
          if(TENSOR1##_i == 0) \
          { \
            TH_TENSOR_APPLY_hasFinished = 1; \
            break; \
          } \
            else \
          { \
            TENSOR1##_data -= TENSOR1##_counter[TENSOR1##_i]*TENSOR1->stride[TENSOR1##_i]; \
            TENSOR1##_counter[TENSOR1##_i] = 0; \
          } \
        } \
        else \
          break; \
      } \
      TENSOR1##_i = 0; \
    } \
\
    if(TENSOR2##_i == TENSOR2##_size) \
    { \
      if(TENSOR2##_dim == -1) \
         break; \
\
      TENSOR2##_data -= TENSOR2##_size*TENSOR2##_stride; \
      for(TENSOR2##_i = TENSOR2##_dim; TENSOR2##_i >= 0; TENSOR2##_i--) \
      { \
        TENSOR2##_counter[TENSOR2##_i]++; \
        TENSOR2##_data += TENSOR2->stride[TENSOR2##_i]; \
\
        if(TENSOR2##_counter[TENSOR2##_i]  == TENSOR2->size[TENSOR2##_i]) \
        { \
          if(TENSOR2##_i == 0) \
          { \
            TH_TENSOR_APPLY_hasFinished = 1; \
            break; \
          } \
            else \
          { \
            TENSOR2##_data -= TENSOR2##_counter[TENSOR2##_i]*TENSOR2->stride[TENSOR2##_i]; \
            TENSOR2##_counter[TENSOR2##_i] = 0; \
          } \
        } \
        else \
          break; \
      } \
      TENSOR2##_i = 0; \
    } \
\
    if(TENSOR3##_i == TENSOR3##_size) \
    { \
      if(TENSOR3##_dim == -1) \
         break; \
\
      TENSOR3##_data -= TENSOR3##_size*TENSOR3##_stride; \
      for(TENSOR3##_i = TENSOR3##_dim; TENSOR3##_i >= 0; TENSOR3##_i--) \
      { \
        TENSOR3##_counter[TENSOR3##_i]++; \
        TENSOR3##_data += TENSOR3->stride[TENSOR3##_i]; \
\
        if(TENSOR3##_counter[TENSOR3##_i]  == TENSOR3->size[TENSOR3##_i]) \
        { \
          if(TENSOR3##_i == 0) \
          { \
            TH_TENSOR_APPLY_hasFinished = 1; \
            break; \
          } \
            else \
          { \
            TENSOR3##_data -= TENSOR3##_counter[TENSOR3##_i]*TENSOR3->stride[TENSOR3##_i]; \
            TENSOR3##_counter[TENSOR3##_i] = 0; \
          } \
        } \
        else \
          break; \
      } \
      TENSOR3##_i = 0; \
    } \
    \
     if(TENSOR4##_i == TENSOR4##_size) \
    { \
      if(TENSOR4##_dim == -1) \
         break; \
\
      TENSOR4##_data -= TENSOR4##_size*TENSOR4##_stride; \
      for(TENSOR4##_i = TENSOR4##_dim; TENSOR4##_i >= 0; TENSOR4##_i--) \
      { \
        TENSOR4##_counter[TENSOR4##_i]++; \
        TENSOR4##_data += TENSOR4->stride[TENSOR4##_i]; \
\
        if(TENSOR4##_counter[TENSOR4##_i]  == TENSOR4->size[TENSOR4##_i]) \
        { \
          if(TENSOR4##_i == 0) \
          { \
            TH_TENSOR_APPLY_hasFinished = 1; \
            break; \
          } \
            else \
          { \
            TENSOR4##_data -= TENSOR4##_counter[TENSOR4##_i]*TENSOR4->stride[TENSOR4##_i]; \
            TENSOR4##_counter[TENSOR4##_i] = 0; \
          } \
        } \
        else \
          break; \
      } \
      TENSOR4##_i = 0; \
    } \
  } \
  THFree(TENSOR1##_counter); \
  THFree(TENSOR2##_counter); \
  THFree(TENSOR3##_counter); \
  THFree(TENSOR4##_counter); \
}



// typedef float (*jscb)(float i_val);
// void THTensor_(fctapply)(THTensor *tensor, jscb js_fct)
// { 
//   TH_TENSOR_APPLY(real, tensor, *tensor_data= (*js_fct)(*tensor_data););
// }


void THTensor_(swap)(THTensor* to_swap, int i, int j, int dim)
{
    THTensor *iSlice, *jSlice, *tmpSlice;

    iSlice  = THTensor_(new)();
    jSlice  = THTensor_(new)();

    tmpSlice  = THTensor_(new)();//(to_swap->size[dim]);

    // copy i into j, then j into i

    THTensor_(select)(iSlice, to_swap, dim, i);
    THTensor_(select)(jSlice, to_swap, dim, j);

    // make sure they're the same size
    THTensor_(resizeAs)(tmpSlice, iSlice);

    // copy into our temp tensor
    THTensor_(copy)(tmpSlice, iSlice);

    // copy j into i
    THTensor_(copy)(iSlice, jSlice);

    // then our temp == i, into the jSlice
    THTensor_(copy)(jSlice, tmpSlice);

    THTensor_(free)(iSlice);
    THTensor_(free)(jSlice);
    THTensor_(free)(tmpSlice);
}

void THTensor_(a2d)(THTensor *tensor, int i, int j, real val)
{
  real o_val = THTensor_(get2d)(tensor, i,j);
  THTensor_(set2d)(tensor, i,j, o_val + val);
  // long index = THTensor_(storageOffset)(tensor);
  // index += i*tensor->stride[0];
  // index += j*tensor->stride[1];
  // real o_val = THStorage_(get)(THTensor_(storage)(tensor), index);
  // THStorage_(set)(THTensor_(storage)(tensor), index, o_val + val);
}

// real THTensor_(i2d)(THTensor *tensor, int i, int j)
// {
//   long index = THTensor_(storageOffset)(tensor);
//   index += i*tensor->stride[0];
//   index += j*tensor->stride[1];
//   return THStorage_(get)(THTensor_(storage)(tensor), index);
// }


real THTensor_(determinant)(THTensor *to_calc)
{
  THTensor *det = THTensor_(new)();
  THTensor_(resizeAs)(det, to_calc);
  THTensor_(copy)(det, to_calc);

  // now we have a copy, let's perform the HYPERLOOP
  int i, j, k, k1, k2, k3;
  int n = to_calc->size[0];
  real alpha;
  real r_determinant = 1;

  for (j = 0; j < n - 1; j++) {
    k = j;
    for (i = j + 1; i < n; i++) {
      if (fabs(THTensor_(get2d)(det, i,j)) > fabs(THTensor_(get2d)(det, k, j))) {
        k = i;
      }
    }

    if (k != j) {
      THTensor_(swap)(det, k, j, 0);
      r_determinant *= -1;
    }

    for (i = j + 1; i < n; i++) {
      alpha = THTensor_(get2d)(det, i,j) / THTensor_(get2d)(det, j, j);
      for (k = j + 1; k < n - 1; k += 2) {
        k1 = k + 1;
        THTensor_(a2d)(det, i, k, -THTensor_(get2d)(det, j,k)*alpha);
        THTensor_(a2d)(det, i, k1, -THTensor_(get2d)(det, j,k1)*alpha);
      }
      if (k != n) {
        THTensor_(a2d)(det, i, k, -THTensor_(get2d)(det, j,k)*alpha);
      }
    }
    if (THTensor_(get2d)(det, j,j) == 0) {
      r_determinant = 0;
      break;
    }
    r_determinant *= THTensor_(get2d)(det, j,j);
  }
  r_determinant = r_determinant * THTensor_(get2d)(det, j,j);
  THTensor_(free)(det);
  return r_determinant;
}

// TH_API void THTensor_(dx_constant)(THTensor *dx, THTensor *thisdx, real val){
//   TH_TENSOR_APPLY2(real, dx, real, thisdx, *dx_data += val*(*thisdx_data););
// }

// // derivatives involving two tensors
// void THTensor_(dx_mul)(THTensor *dx, THTensor* x, THTensor* thisdx){
//   TH_TENSOR_APPLY3(real, dx, real, x, real, thisdx, *dx_data += (*x_data)*(*thisdx_data););
// }

// void THTensor_(dx_div)(THTensor *tensor, THTensor* dx){
//   TH_TENSOR_APPLY3(real, dx, real, x, real, thisdx, *dx_data += (*x_data)*(*thisdx_data););
// }

#define IMPLEMENT_THDX_0ARG(NAME, MULCODE) \
void THTensor_(dx_##NAME)(THTensor *dx, THTensor* thisdx) \
{ \
  TH_TENSOR_APPLY2(real, dx, real, thisdx, *dx_data += (*thisdx_data)*(MULCODE);) \
}

#define IMPLEMENT_THDX_0ARG_ACC(NAME, MULCODE) \
real THTensor_(dx_acc_##NAME)(THTensor* thisdx) \
{ \
  real acc = (real) 0; \
  TH_TENSOR_APPLY(real, thisdx, acc += (*thisdx_data)*(MULCODE);) \
  return acc; \
}


#define IMPLEMENT_THDX_1ARG(NAME, MULCODE) \
void THTensor_(dx_##NAME)(THTensor *dx, THTensor* thisdx, THTensor* x) \
{ \
  TH_TENSOR_APPLY3(real, dx, real, thisdx, real, x, *dx_data += (*thisdx_data)*(MULCODE);) \
}  

#define IMPLEMENT_THDX_1ARG_ACC(NAME, MULCODE) \
real THTensor_(dx_acc_##NAME)(THTensor* thisdx, real x) \
{ \
  real *x_data = &x; \
  real acc = (real) 0; \
  TH_TENSOR_APPLY(real, thisdx, acc += (*thisdx_data)*(MULCODE);) \
  return acc; \
}

#define IMPLEMENT_THDX_1ARG_CONST(NAME, MULCODE) \
void THTensor_(dx_const_##NAME)(THTensor *dx, THTensor* thisdx, real x) \
{ \
  real *x_data = &x; \
  TH_TENSOR_APPLY2(real, dx, real, thisdx, *dx_data += (*thisdx_data)*(MULCODE);) \
}

#define IMPLEMENT_THDX_2ARG(NAME, MULCODE) \
void THTensor_(dx_##NAME)(THTensor *dx, THTensor* thisdx, THTensor* x, THTensor* y) \
{ \
  TH_TENSOR_APPLY4(real, dx, real, thisdx, real, x, real, y, *dx_data += (*thisdx_data)*(MULCODE);) \
}\
void THTensor_(dx_const_##NAME)(THTensor *dx, THTensor* thisdx, THTensor* x, real y) \
{ \
  real *y_data = &y; \
  TH_TENSOR_APPLY3(real, dx, real, thisdx, real, x, *dx_data += (*thisdx_data)*(MULCODE);) \
}\
\
real THTensor_(dx_acc_##NAME)(THTensor* thisdx, THTensor* x, real y) \
{ \
  real *y_data = &y; \
  real acc = (real) 0; \
  TH_TENSOR_APPLY2(real, thisdx, real, x, acc += (*thisdx_data)*(MULCODE);) \
  return acc; \
}

// d.neg = makeUnaryDerivatives('-1');
IMPLEMENT_THDX_0ARG(neg, -1.0)

// d.add = makeBinaryDerivatives('1', '1');
IMPLEMENT_THDX_0ARG(add_f1, 1.0)
IMPLEMENT_THDX_0ARG_ACC(add_f1, 1.0)

IMPLEMENT_THDX_0ARG(add_f2, 1.0)
IMPLEMENT_THDX_0ARG_ACC(add_f2, 1.0)

// d.sub = makeBinaryDerivatives('1', '-1');
IMPLEMENT_THDX_0ARG(sub_f1, 1.0)
IMPLEMENT_THDX_0ARG_ACC(sub_f1, 1.0)
IMPLEMENT_THDX_0ARG(sub_f2, -1.0)
IMPLEMENT_THDX_0ARG_ACC(sub_f2, -1.0)

// d.mul = makeBinaryDerivatives('y', 'x');
IMPLEMENT_THDX_1ARG(mul_f1, *x_data)
IMPLEMENT_THDX_1ARG_ACC(mul_f1, *x_data)
IMPLEMENT_THDX_1ARG_CONST(mul_f1, *x_data)

IMPLEMENT_THDX_1ARG(mul_f2, *x_data)
IMPLEMENT_THDX_1ARG_ACC(mul_f2, *x_data)
IMPLEMENT_THDX_1ARG_CONST(mul_f2, *x_data)

// d.div = makeBinaryDerivatives('1/y', '-x/(y*y)');
IMPLEMENT_THDX_1ARG(div_f1, 1.0 / (*x_data))
IMPLEMENT_THDX_1ARG_ACC(div_f1, 1.0 / (*x_data))
IMPLEMENT_THDX_1ARG_CONST(div_f1, 1.0 / (*x_data))

IMPLEMENT_THDX_2ARG(div_f2, -(*x_data)/((*y_data)*(*y_data)))

// d.sqrt = makeUnaryDerivatives('1/(2*out)');
IMPLEMENT_THDX_1ARG(sqrt, 1.0 / (2.0*(*x_data)))
// d.exp = makeUnaryDerivatives('out');
IMPLEMENT_THDX_1ARG(exp, *x_data)
// d.log = makeUnaryDerivatives('1/x');
IMPLEMENT_THDX_1ARG(log, 1 / (*x_data))


// d.pow = makeBinaryDerivatives('y*Math.pow(x,y-1)', 'Math.log(x)*out');
IMPLEMENT_THDX_2ARG(pow_f1, (*y_data)*(pow(*x_data, *y_data - 1)))
IMPLEMENT_THDX_2ARG(pow_f2, log(*x_data)*(*y_data))

// d.sin = makeUnaryDerivatives('Math.cos(x)');
IMPLEMENT_THDX_1ARG(sin, cos(*x_data))
// d.cos = makeUnaryDerivatives('-Math.sin(x)');
IMPLEMENT_THDX_1ARG(cos, -sin(*x_data))

// d.tan = makeUnaryDerivatives('1 + out*out');
IMPLEMENT_THDX_1ARG(tan, 1 + (*x_data)*(*x_data))

// d.asin = makeUnaryDerivatives('1 / Math.sqrt(1 - x*x)');
IMPLEMENT_THDX_1ARG(asin, 1 / sqrt(1 - (*x_data)*(*x_data)))
// d.acos = makeUnaryDerivatives('-1 / Math.sqrt(1 - x*x)');
IMPLEMENT_THDX_1ARG(acos, -1 / sqrt(1 - (*x_data)*(*x_data)))
// d.atan = makeUnaryDerivatives('1 / (1 + x*x)');
IMPLEMENT_THDX_1ARG(atan, 1 / (1 + (*x_data)*(*x_data)))

// d.atan2 = makeBinaryDerivatives('y/(x*x + y*y)', '-x/(x*x + y*y)');
IMPLEMENT_THDX_2ARG(atan2_f1, (*y_data)/((*x_data)*(*x_data) + (*y_data)*(*y_data)))
IMPLEMENT_THDX_2ARG(atan2_f2, -(*x_data)/((*x_data)*(*x_data) + (*y_data)*(*y_data)))

// d.sinh = makeUnaryDerivatives('Math.cosh(x)');
IMPLEMENT_THDX_1ARG(sinh, cosh(*x_data))

// d.cosh = makeUnaryDerivatives('Math.sinh(x)');
IMPLEMENT_THDX_1ARG(cosh, sinh(*x_data))

// d.tanh = makeUnaryDerivatives('1 - out*out');
IMPLEMENT_THDX_1ARG(tanh, 1 - (*x_data)*(*x_data))

// 1481273

// d.asinh = makeUnaryDerivatives('1 / Math.sqrt(x*x + 1)');
IMPLEMENT_THDX_1ARG(asinh, 1 / sqrt((*x_data)*(*x_data) + 1))

// d.acosh = makeUnaryDerivatives('1 / Math.sqrt(x*x - 1)');
IMPLEMENT_THDX_1ARG(acosh, 1 / sqrt((*x_data)*(*x_data) - 1))

// d.atanh = makeUnaryDerivatives('1 / (1 - x*x)');
IMPLEMENT_THDX_1ARG(atanh, 1 / (1 - (*x_data)*(*x_data)))

// d.sigmoid = makeUnaryDerivatives('out * (1 - out)');
IMPLEMENT_THDX_1ARG(sigmoid, (*x_data) * (1 - (*x_data)))

#endif

// void THTensor_(fill)(THTensor *r_, real value)
// {
//   TH_TENSOR_APPLY(real, r_, 
//                   THVector_(fill)(r__data, value, r__size); break;);
// }

// real THTensor_(minall)(THTensor *tensor)
// {
//   real theMin;
//   real value;

//   THArgCheck(tensor->nDimension > 0, 1, "tensor must have one dimension");
//   theMin = THTensor_(data)(tensor)[0];
//   TH_TENSOR_APPLY(real, tensor,
//                   value = *tensor_data;
//                   /* This is not the same as value<theMin in the case of NaNs */
//                   if(!(value >= theMin))
//                   {
//                     theMin = value;
//                     if (isnan(value))
//                       break;
//                   });
//   return theMin;
// }



#endif
