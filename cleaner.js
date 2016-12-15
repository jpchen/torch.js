var fs = require('fs');


var th_base = fs.readFileSync("./TH.js").toString();
// console.log(th_base.length)
// console.log(th_base)

// need to look at the local library location for our custom libTH
var find_start = "exports.TH = new FFI.Library('./thlib/build/libmTH', ";

var s_ix = th_base.indexOf(find_start);
// might be different sizing, unclear
var ss = th_base.substr(s_ix+find_start.length, (th_base.length-1))//, (th_base.length));
var json_substr = ss.substr(0, ss.indexOf('});') + 1)

//we need to remove some things that are non-float and non-doubles
var non_float_double = ["Byte", "ByteLapack", "Short", "ShortLapack", "Int", "IntLapack", "Long", "LongLapack", "Char", "CharLapack"]

var remove_non_fp = [
"mean",
"meanall",
"varall",
"stdall",
"histc",
"norm",
"normall",
"renorm",
"dist",
"linspace",
"logspace",
"log", "log1p", "exp",
"cos", "acos", "cosh",
"sin", "asin", "sinh",
"tan", "atan", "tanh",
"sqrt", "round", "ceil",
"floor", "trunc",
"abs",
"frac",
"rsqrt",
"sigmoid",
"neg",
"cinv",
"lerp",
"atan2",
"pow",
"tpow",
"rand",
"randn",
"multinomial",
"uniform",
"normal",
"cauchy",
"logNormal",
"gesv",
"gels",
"trtrs",
"syev",
"geev",
"gesvd",
"gesvd2",
"getri",
"potrf",
"potrs",
"potri",
"pstrf",
"qr",
"geqrf",
"orgqr",
"ormqr",
"getrf",
"",
"",
"",
"",
"",
"",
"",
]

// https://github.com/torch/torch7/blob/58b9acd72bc39b3ea3b0426fc52fd28ffb0d7f97/TensorMath.lua#L208
var non_vector = ["FloatVector", "DoubleVector", "ByteVector", "CharVector", "ShortVector", "LongVector", "IntVector"]

// Vectors shouldn't interact with this, you see. Remove these common calls from vectors too.
var remove_non_vec = [
	"fill", //NEON
	"diff", //NEON
	"add", //only double
	"scale",
	"mul",
	"",
	"",
	"",
]

var torch_function_wrap = function(ttype, fct_name, no_tensor)
{
	return "TH" + ttype + (no_tensor ? "" : "Tensor") + "_" + fct_name
}

var remove_fct_keys = function(keys, ttypes, dict, o_string)
{
	// var dhold = {r: o_string}

	var rm = function(fct_key)
	{
		if(dict[fct_key])
		{
			str_reg = "(" + fct_key + "[\\s\\S.]*?]],)"
			// dhold.r.test()
			rx = new RegExp(str_reg)
			// console.log("reg: ", str_reg, dhold.r.match(rx))
			// dhold.r = dhold.r.replace(rx, "")
			o_string = o_string.replace(rx, "")
			delete dict[fct_key]
			console.log("Removed: " + fct_key);
		}
	}

	for(var k=0; k < keys.length; k++)
	{
		var fct = keys[k];
		console.log("Key: ", fct)
		for(var t=0; t < ttypes.length; t++)
		{
			rm(torch_function_wrap(ttypes[t], fct))
			rm(torch_function_wrap(ttypes[t], fct, true))
			// var fct_key = torch_function_wrap(ttypes[t], fct);
			// // console.log("Check:", fct_key, dict[fct_key])

			// if(dict[fct_key]){
			// 	console.log("Removed:", fct_key)
			// 	o_string = o_string.replace(new RegExp("("+ fct_key +"=.*]],)"), "")
			// }

			// delete dict[fct_key]

			// fct_key = torch_function_wrap(ttypes[t], fct, true);
			// if(dict[fct_key])
			// 	console.log("Removed:", fct_key)


			// delete dict[fct_key]
		}
	}
	// return dhold.r
	return o_string

}


// Using the float/double info to remove this
// https://github.com/torch/torch7/blob/58b9acd72bc39b3ea3b0426fc52fd28ffb0d7f97/TensorMath.lua#L1010
// console.log("piece: ", json_substr);

eval("var fn = function(){ "+ th_base.substr(0, s_ix) + " return " + json_substr + ";}");
var fct_dict = fn();
// console.log(Object.keys(fct_dict))
// attempt to clean up the keys for non-float/double types
th_base = remove_fct_keys(remove_non_fp, non_float_double, fct_dict, th_base);
th_base = remove_fct_keys(remove_non_vec, non_vector, fct_dict, th_base);

// var strip_quotes = function(j_str, dict)
// {
// 	for(var key in dict)
// 	{
// 		j_str = j_str.replace("\"" + key + "\"", key)
// 	}
// 	return j_str
// }

// var thc = th_base.substr(0, s_ix) + "\n" + find_start + strip_quotes(JSON.stringify(fct_dict)) + ");\n";
fs.writeFileSync("./THc.js", th_base);


var cuda_th_base = fs.readFileSync("./cuTH.js").toString();
// console.log(cuda_th_base.length)
// console.log(cuda_th_base)

// need to look at the local library location for our custom libTH
var find_start = "exports.THC = new FFI.Library('./cuthlib/build/libmTHC', ";

var s_ix = cuda_th_base.indexOf(find_start);
// might be different sizing, unclear
var ss = cuda_th_base.substr(s_ix+find_start.length, (cuda_th_base.length-1))//, (cuda_th_base.length));
var json_substr = ss.substr(0, ss.indexOf('});') + 1)

//we need to remove some things that are non-float and non-doubles
var non_float_double = [
// "Cuda",
"CudaByte", "CudaByteStorage",
"CudaShort", "CudaShortStorage",
"CudaInt", "CudaIntStorage",
"CudaLong", "CudaLongStorage",
"CudaChar", "CudaCharStorage",
"Byte", "ByteLapack", "Short", "ShortLapack", "Int", "IntLapack", "Long", "LongLapack", "Char", "CharLapack"]

var remove_non_fp = [
"mean",
"meanall",
"varall",
"stdall",
"histc",
"norm",
"normall",
"renorm",
"dist",
"linspace",
"logspace",
"log", "log1p", "exp",
"cos", "acos", "cosh",
"sin", "asin", "sinh",
"tan", "atan", "tanh",
"sqrt", "round", "ceil",
"floor", "trunc",
"abs",
"frac",
"rsqrt",
"sigmoid",
"neg",
"cinv",
"lerp",
"atan2",
"pow",
"tpow",
"rand",
"randn",
"multinomial",
"uniform",
"normal",
"cauchy",
"logNormal",
"gesv",
"gels",
"trtrs",
"syev",
"geev",
"gesvd",
"gesvd2",
"getri",
"potrf",
"potrs",
"potri",
"pstrf",
"qr",
"geqrf",
"orgqr",
"ormqr",
"getrf",
"",
"",
"",
"",
"",
]

// https://github.com/torch/torch7/blob/58b9acd72bc39b3ea3b0426fc52fd28ffb0d7f97/TensorMath.lua#L208
var non_vector = ["FloatVector", "DoubleVector", "ByteVector", "CharVector", "ShortVector", "LongVector", "IntVector", "CudaBlas"]

// Vectors shouldn't interact with this, you see. Remove these common calls from vectors too.
var remove_non_vec = [
	"fill", //NEON
	"diff", //NEON
	"add", //only double
	"scale",
	"mul",
	"swap",
	"scal",
	"copy",
	"axpy",
	"dot",
	"gemv",
	"ger",
	"gemm",
	"getrf",
	"getri",
	"",
	"",
	"",
	"",
	"",
	"",
]

var general_remove = [
"CudaStorage",
"CudaDoubleStorage",
"CudaHalfStorage",
"CudaByte", "CudaByteStorage",
"CudaShort", "CudaShortStorage",
"CudaInt", "CudaIntStorage",
"CudaLong", "CudaLongStorage",
"CudaChar", "CudaCharStorage",
]

// Vectors shouldn't interact with this, you see. Remove these common calls from vectors too.
var remove_general = [
	"newWithAllocator",
	"newWithDataAndAllocator",
	"",
	"",
	"",
]

var gg_remove = [
// "CudaTensor",
"CudaHalfTensor",
"CudaDoubleTensor",
]

// Vectors shouldn't interact with this, you see. Remove these common calls from vectors too.
var remove_gg = [
	// "logicalall",
	// "logicalany",
	"atan2",
	"pow",
	"tpow",
	"lerp",
	"",
]



var torch_function_wrap = function(ttype, fct_name, no_tensor)
{
	return "TH" + ttype + (no_tensor ? "" : "Tensor") + "_" + fct_name
}

var remove_fct_keys = function(keys, ttypes, dict, o_string)
{
	// var dhold = {r: o_string}

	var rm = function(fct_key)
	{
		if(dict[fct_key])
		{
			str_reg = "(" + fct_key + "[\\s\\S.]*?]],)"
			// dhold.r.test()
			rx = new RegExp(str_reg)
			// console.log("reg: ", str_reg, dhold.r.match(rx))
			// dhold.r = dhold.r.replace(rx, "")
			o_string = o_string.replace(rx, "")
			delete dict[fct_key]
			console.log("Removed: " + fct_key);
		}
	}

	for(var k=0; k < keys.length; k++)
	{
		var fct = keys[k];
		for(var t=0; t < ttypes.length; t++)
		{
			rm(torch_function_wrap(ttypes[t], fct))
			rm(torch_function_wrap(ttypes[t], fct, true))
			// var fct_key = torch_function_wrap(ttypes[t], fct);
			// // console.log("Check:", fct_key, dict[fct_key])

			// if(dict[fct_key]){
			// 	console.log("Removed:", fct_key)
			// 	o_string = o_string.replace(new RegExp("("+ fct_key +"=.*]],)"), "")
			// }

			// delete dict[fct_key]

			// fct_key = torch_function_wrap(ttypes[t], fct, true);
			// if(dict[fct_key])
			// 	console.log("Removed:", fct_key)


			// delete dict[fct_key]
		}
	}
	// return dhold.r
	return o_string

}


// Using the float/double info to remove this
// https://github.com/torch/torch7/blob/58b9acd72bc39b3ea3b0426fc52fd28ffb0d7f97/TensorMath.lua#L1010
// console.log("piece: ", json_substr);

eval("var fn = function(){ "+ cuda_th_base.substr(0, s_ix) + " return " + json_substr + ";}");
var fct_dict = fn();
// console.log(Object.keys(fct_dict))
// attempt to clean up the keys for non-float/double types
cuda_th_base = remove_fct_keys(remove_non_fp, non_float_double, fct_dict, cuda_th_base);
cuda_th_base = remove_fct_keys(remove_non_vec, non_vector, fct_dict, cuda_th_base);
cuda_th_base = remove_fct_keys(remove_general, general_remove, fct_dict, cuda_th_base);

cuda_th_base = remove_fct_keys(remove_gg, gg_remove, fct_dict, cuda_th_base);

// var strip_quotes = function(j_str, dict)
// {
// 	for(var key in dict)
// 	{
// 		j_str = j_str.replace("\"" + key + "\"", key)
// 	}
// 	return j_str
// }

// var thc = cuda_th_base.substr(0, s_ix) + "\n" + find_start + strip_quotes(JSON.stringify(fct_dict)) + ");\n";
fs.writeFileSync("./cuTHc.js", cuda_th_base);

// now we remove any Lapack related calls



// then we get the function dictionary
// var fct_dict = JSON.parse(json_substr)
// console.log(Object.keys(fct_dict))
// for(var key in fct_dict)
// 	console.log(key)

// console.log(ss.substr(0,1))
// console.log()//.substr(0,1))
// console.log(s_ix, th_base.length - s_ix)
// console.log("Six: ", s_ix)
// console.log(ss)
// console.log(ss.substr(0, ss.length-4))



