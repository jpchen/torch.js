#ifndef TH_GENERIC_FILE
#define TH_GENERIC_FILE "generic/THTensorExtraJS.h"
#else

// #include "THTensorApply.h"

#define jscb THTensor_(jscallback)
// typedef real (*jscb)(real i_val);
typedef real (*jscb)(real i_val);
TH_API void THTensor_(fctapply)(THTensor *r_, jscb js_fct);

#if defined(TH_REAL_IS_FLOAT) || defined(TH_REAL_IS_DOUBLE)

// // typedef float (*jscb)(float i_val);
// // TH_API void THTensor_(fctapply)(THTensor *r_, jscb js_fct);
TH_API real THTensor_(determinant)(THTensor *to_calc);
TH_API void THTensor_(a2d)(THTensor *tensor, int i, int j, real val);
TH_API void THTensor_(swap)(THTensor* to_swap, int i, int j, int dim);
// TH_API real THTensor_(i2d)(THTensor *tensor, int i, int j);

// derivatives involving two tensors
// TH_API void THTensor_(dx_constant)(THTensor *dx, THTensor *thisdx, real val); 
// TH_API void THTensor_(dx_mul_f1)(THTensor *dx, THTensor* x, THTensor* y); 
// TH_API void THTensor_(dx_mul_f2)(THTensor *dx, THTensor* x, THTensor* y); 

// TH_API void THTensor_(dx_div_f1)(THTensor *dx, THTensor* x, THTensor* y); 
// TH_API void THTensor_(dx_div_f2)(THTensor *dx, THTensor* x, THTensor* y); 

// TH_API void THTensor_(dx_atan2_f1)(THTensor *dx, THTensor* x, THTensor* y);
// TH_API void THTensor_(dx_atan2_f2)(THTensor *dx, THTensor* x, THTensor* y);


// d.neg = makeUnaryDerivatives('-1');
TH_API void THTensor_(dx_neg)(THTensor *dx, THTensor* thisdx); 

// d.add = makeBinaryDerivatives('1', '1');
TH_API void THTensor_(dx_add_f1)(THTensor *dx, THTensor* thisdx); 
// TH_API void THTensor_(dx_const_add_f1)(THTensor *dx, THTensor* thisdx); 
TH_API real THTensor_(dx_acc_add_f1)(THTensor* thisdx); 

TH_API void THTensor_(dx_add_f2)(THTensor *dx, THTensor* thisdx); 
// TH_API void THTensor_(dx_const_add_f2)(THTensor *dx, THTensor* thisdx); 
TH_API real THTensor_(dx_acc_add_f2)(THTensor* thisdx); 

// d.sub = makeBinaryDerivatives('1', '-1');
TH_API void THTensor_(dx_sub_f1)(THTensor *dx, THTensor* thisdx); 
// TH_API void THTensor_(dx_const_sub_f1)(THTensor *dx, THTensor* thisdx); 
TH_API real THTensor_(dx_acc_sub_f1)(THTensor* thisdx); 

TH_API void THTensor_(dx_sub_f2)(THTensor *dx, THTensor* thisdx); 
// TH_API void THTensor_(dx_const_sub_f2)(THTensor *dx, THTensor* thisdx); 
TH_API real THTensor_(dx_acc_sub_f2)(THTensor* thisdx); 

// d.mul = makeBinaryDerivatives('y', 'x');
TH_API void THTensor_(dx_mul_f1)(THTensor *dx, THTensor* thisdx, THTensor* x); 
TH_API void THTensor_(dx_const_mul_f1)(THTensor *dx, THTensor* thisdx, real x); 
TH_API real THTensor_(dx_acc_mul_f1)(THTensor* thisdx, real x); 

TH_API void THTensor_(dx_mul_f2)(THTensor *dx, THTensor* thisdx, THTensor* x); 
TH_API void THTensor_(dx_const_mul_f2)(THTensor *dx, THTensor* thisdx, real x); 
TH_API real THTensor_(dx_acc_mul_f2)(THTensor* thisdx, real x); 

// d.div = makeBinaryDerivatives('1/y', '-x/(y*y)');
TH_API void THTensor_(dx_div_f1)(THTensor *dx, THTensor* thisdx, THTensor* x); 
TH_API void THTensor_(dx_const_div_f1)(THTensor *dx, THTensor* thisdx, real x); 
TH_API real THTensor_(dx_acc_div_f1)(THTensor* thisdx, real x); 

TH_API void THTensor_(dx_div_f2)(THTensor *dx, THTensor* thisdx, THTensor* x, THTensor* y); 
TH_API void THTensor_(dx_const_div_f2)(THTensor *dx, THTensor* thisdx, THTensor* x, real y); 
TH_API real THTensor_(dx_acc_div_f2)(THTensor* thisdx, THTensor* x, real y); 

// d.sqrt = makeUnaryDerivatives('1/(2*out)');
TH_API void THTensor_(dx_sqrt)(THTensor *dx, THTensor* thisdx, THTensor* x); 
// d.exp = makeUnaryDerivatives('out');
TH_API void THTensor_(dx_exp)(THTensor *dx, THTensor* thisdx, THTensor* x); 
// d.log = makeUnaryDerivatives('1/x');
TH_API void THTensor_(dx_log)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.pow = makeBinaryDerivatives('y*Math.pow(x,y-1)', 'Math.log(x)*out');
TH_API void THTensor_(dx_pow_f1)(THTensor *dx, THTensor* thisdx, THTensor* x, THTensor* y); 
TH_API void THTensor_(dx_const_pow_f1)(THTensor *dx, THTensor* thisdx, THTensor* x, real y); 
TH_API real THTensor_(dx_acc_pow_f1)(THTensor* thisdx, THTensor* x, real y); 
TH_API void THTensor_(dx_pow_f2)(THTensor *dx, THTensor* thisdx, THTensor* x, THTensor* y); 
TH_API void THTensor_(dx_const_pow_f2)(THTensor *dx, THTensor* thisdx, THTensor* x, real y); 
TH_API real THTensor_(dx_acc_pow_f2)(THTensor* thisdx, THTensor* x, real y); 

// d.sin = makeUnaryDerivatives('Math.cos(x)');
TH_API void THTensor_(dx_sin)(THTensor *dx, THTensor* thisdx, THTensor* x); 
// d.cos = makeUnaryDerivatives('-Math.sin(x)');
TH_API void THTensor_(dx_cos)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.tan = makeUnaryDerivatives('1 + out*out');
TH_API void THTensor_(dx_tan)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.asin = makeUnaryDerivatives('1 / Math.sqrt(1 - x*x)');
TH_API void THTensor_(dx_asin)(THTensor *dx, THTensor* thisdx, THTensor* x); 
// d.acos = makeUnaryDerivatives('-1 / Math.sqrt(1 - x*x)');
TH_API void THTensor_(dx_acos)(THTensor *dx, THTensor* thisdx, THTensor* x); 
// d.atan = makeUnaryDerivatives('1 / (1 + x*x)');
TH_API void THTensor_(dx_atan)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.atan2 = makeBinaryDerivatives('y/(x*x + y*y)', '-x/(x*x + y*y)');
TH_API void THTensor_(dx_atan2_f1)(THTensor *dx, THTensor* thisdx, THTensor* x, THTensor* y); 
TH_API void THTensor_(dx_const_atan2_f1)(THTensor *dx, THTensor* thisdx, THTensor* x, real y); 
TH_API real THTensor_(dx_acc_atan2_f1)(THTensor* thisdx, THTensor* x, real y); 
TH_API void THTensor_(dx_atan2_f2)(THTensor *dx, THTensor* thisdx, THTensor* x, THTensor* y); 
TH_API void THTensor_(dx_const_atan2_f2)(THTensor *dx, THTensor* thisdx, THTensor* x, real y); 
TH_API real THTensor_(dx_acc_atan2_f2)(THTensor* thisdx, THTensor* x, real y); 

// d.sinh = makeUnaryDerivatives('Math.cosh(x)');
TH_API void THTensor_(dx_sinh)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.cosh = makeUnaryDerivatives('Math.sinh(x)');
TH_API void THTensor_(dx_cosh)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.tanh = makeUnaryDerivatives('1 - out*out');
TH_API void THTensor_(dx_tanh)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// 1481273

// d.asinh = makeUnaryDerivatives('1 / Math.sqrt(x*x + 1)');
TH_API void THTensor_(dx_asinh)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.acosh = makeUnaryDerivatives('1 / Math.sqrt(x*x - 1)');
TH_API void THTensor_(dx_acosh)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.atanh = makeUnaryDerivatives('1 / (1 - x*x)');
TH_API void THTensor_(dx_atanh)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// d.sigmoid = makeUnaryDerivatives('out * (1 - out)');
TH_API void THTensor_(dx_sigmoid)(THTensor *dx, THTensor* thisdx, THTensor* x); 

// TH_API void THTensor_(dx_sqrt)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_exp)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_log)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_pow)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_sin)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_cos)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_tan)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_asin)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_acos)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_atan)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_sinh)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_cosh)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_tanh)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_asinh)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_acosh)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_atanh)(THTensor *tensor, THTensor* dx); 
// TH_API void THTensor_(dx_sigmoid)(THTensor *tensor, THTensor* dx); 

#endif



// typedef real (*THTensor_(jscallback))(real i_val);
// TH_API void THTensor_(fctapply)(THTensor *r_, THTensor_(jscallback) js_fct);

#endif

