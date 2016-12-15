#ifndef THC_GENERIC_FILE
#define THC_GENERIC_FILE "generic/THCTensorExtraJS.h"
#else

#if defined(THC_REAL_IS_FLOAT) || defined(THC_REAL_IS_DOUBLE)

THC_API void THCTensor_(dx_neg)(THCState *state, THCTensor *dx, THCTensor *thisdx);

THC_API void THCTensor_(dx_add_f1)(THCState *state, THCTensor *dx, THCTensor *thisdx);
THC_API accreal THCTensor_(dx_acc_add_f1)(THCState *state, THCTensor *thisdx);

THC_API void THCTensor_(dx_add_f2)(THCState *state, THCTensor *dx, THCTensor *thisdx);
THC_API accreal THCTensor_(dx_acc_add_f2)(THCState *state, THCTensor *thisdx);

// d.sub = makeBinaryDerivatives('1', '-1');
THC_API void THCTensor_(dx_sub_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx);
// THC_API void THCTensor_(dx_const_sub_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx);
THC_API accreal THCTensor_(dx_acc_sub_f1)(THCState* state, THCTensor* thisdx);

THC_API void THCTensor_(dx_sub_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx);
// THC_API void THCTensor_(dx_const_sub_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx);
THC_API accreal THCTensor_(dx_acc_sub_f2)(THCState* state, THCTensor* thisdx);

// d.mul = makeBinaryDerivatives('y', 'x');
THC_API void THCTensor_(dx_mul_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
THC_API void THCTensor_(dx_const_mul_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, real x);
THC_API accreal THCTensor_(dx_acc_mul_f1)(THCState* state, THCTensor* thisdx, real x);

THC_API void THCTensor_(dx_mul_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
THC_API void THCTensor_(dx_const_mul_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, real x);
THC_API accreal THCTensor_(dx_acc_mul_f2)(THCState* state, THCTensor* thisdx, real x);

// d.div = makeBinaryDerivatives('1/y', '-x/(y*y)');
THC_API void THCTensor_(dx_div_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
THC_API void THCTensor_(dx_const_div_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, real x);
THC_API accreal THCTensor_(dx_acc_div_f1)(THCState* state, THCTensor* thisdx, real x);

THC_API void THCTensor_(dx_div_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, THCTensor* y);
THC_API void THCTensor_(dx_const_div_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, real y);
THC_API accreal THCTensor_(dx_acc_div_f2)(THCState* state, THCTensor* thisdx, THCTensor* x, real y);

// d.sqrt = makeUnaryDerivatives('1/(2*out)');
THC_API void THCTensor_(dx_sqrt)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
// d.exp = makeUnaryDerivatives('out');
THC_API void THCTensor_(dx_exp)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
// d.log = makeUnaryDerivatives('1/x');
THC_API void THCTensor_(dx_log)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.pow = makeBinaryDerivatives('y*Math.pow(x,y-1)', 'Math.log(x)*out');
THC_API void THCTensor_(dx_pow_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, THCTensor* y);
THC_API void THCTensor_(dx_const_pow_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, real y);
THC_API accreal THCTensor_(dx_acc_pow_f1)(THCState* state, THCTensor* thisdx, THCTensor* x, real y);
THC_API void THCTensor_(dx_pow_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, THCTensor* y);
THC_API void THCTensor_(dx_const_pow_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, real y);
THC_API accreal THCTensor_(dx_acc_pow_f2)(THCState* state, THCTensor* thisdx, THCTensor* x, real y);

// d.sin = makeUnaryDerivatives('Math.cos(x)');
THC_API void THCTensor_(dx_sin)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
// d.cos = makeUnaryDerivatives('-Math.sin(x)');
THC_API void THCTensor_(dx_cos)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.tan = makeUnaryDerivatives('1 + out*out');
THC_API void THCTensor_(dx_tan)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.asin = makeUnaryDerivatives('1 / Math.sqrt(1 - x*x)');
THC_API void THCTensor_(dx_asin)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
// d.acos = makeUnaryDerivatives('-1 / Math.sqrt(1 - x*x)');
THC_API void THCTensor_(dx_acos)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);
// d.atan = makeUnaryDerivatives('1 / (1 + x*x)');
THC_API void THCTensor_(dx_atan)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.atan2 = makeBinaryDerivatives('y/(x*x + y*y)', '-x/(x*x + y*y)');
THC_API void THCTensor_(dx_atan2_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, THCTensor* y);
THC_API void THCTensor_(dx_const_atan2_f1)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, real y);
THC_API accreal THCTensor_(dx_acc_atan2_f1)(THCState* state, THCTensor* thisdx, THCTensor* x, real y);
THC_API void THCTensor_(dx_atan2_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, THCTensor* y);
THC_API void THCTensor_(dx_const_atan2_f2)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x, real y);
THC_API accreal THCTensor_(dx_acc_atan2_f2)(THCState* state, THCTensor* thisdx, THCTensor* x, real y);

// d.sinh = makeUnaryDerivatives('Math.cosh(x)');
THC_API void THCTensor_(dx_sinh)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.cosh = makeUnaryDerivatives('Math.sinh(x)');
THC_API void THCTensor_(dx_cosh)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.tanh = makeUnaryDerivatives('1 - out*out');
THC_API void THCTensor_(dx_tanh)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.asinh = makeUnaryDerivatives('1 / Math.sqrt(x*x + 1)');
THC_API void THCTensor_(dx_asinh)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.acosh = makeUnaryDerivatives('1 / Math.sqrt(x*x - 1)');
THC_API void THCTensor_(dx_acosh)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.atanh = makeUnaryDerivatives('1 / (1 - x*x)');
THC_API void THCTensor_(dx_atanh)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);

// d.sigmoid = makeUnaryDerivatives('out * (1 - out)');
THC_API void THCTensor_(dx_sigmoid)(THCState* state, THCTensor *dx, THCTensor* thisdx, THCTensor* x);



#endif


#endif
