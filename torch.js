var ffith=require('./THc.js')
var fficu=require('./cuTHc.js')
//var ffith=require('./TH.js')
//var fficu=require('./cuTH.js')

// console.log('creating new 10-element tensor')
// var tensor1=TH.THFloatTensor_newWithSize1d(10)

// console.log('filling tensor with 0.15')
// TH.THFloatTensor_fill(tensor1, 0.15)

// console.log('printing tensor')
// for (i=0; i < 10; ++i) {
//     console.log(TH.THFloatTensor_get1d(tensor1, i))
// }
var replace_function = function(o_fct, cuda_state)
{
   return function(){
      var args = Array.prototype.slice.call(arguments); // Make real array from arguments
      args.unshift(cuda_state.ref());
      return o_fct.apply(this, args);
   }
}

var wrap_cuda_state = function(thc, cuda_state)
{
   for(var key in thc)
   {
      if(key == "THCudaInit" || key == "THCudaShutdown"){
         // console.log("cc")
      }
      else if(key.indexOf('Cuda') != -1)
      {
         // console.log(key)
         // wrap the function so that every call prepends sends the global cuda_state
         thc[key] = replace_function(thc[key], cuda_state);
      }
   }
}
var merge_th_thc = function(shared, th, thc)
{
   for(var key in thc){

      // if(key.indexOf("copyCudaFloat") != -1)
      //    console.log("EE: ", key)

      // already have this key? need to merge
      // if(shared[key])
      // {
      //    for(var thckey in thc[key])
      //    {
      //       if(!shared[key][thckey])
      //          shared[key][thckey] = thc[key][thckey]
      //    }
      // }
      // else
         shared[key] = thc[key]
   }

   for(var key in th)
      shared[key] = th[key]

   // if(key.indexOf("copyCudaFloat") != -1)
   //    console.log("EE: ", key)

   // throw new Error("end it")
   return shared
}

var create_sub_classes = function(shared)
{
   var ttypes = {}
   for(var key in shared)
   {
      var fct_split = key.split('_')
      if(fct_split.length > 1)
      {
         if(fct_split.length > 2){
            var ss = fct_split.shift()
            fct_split = [ss,fct_split.join("_")];
         }

         // }else{
         var s_type = fct_split[0];
         if(!ttypes[s_type])
            ttypes[s_type] = {}

         // for each type, we have some function calls we want to create
         ttypes[s_type][fct_split[1]] = shared[key]
         // }
      }
   }

   for(var s_type in ttypes)
   {
      shared[s_type] = ttypes[s_type]
   }
   // console.log(ttypes)
}


var THC = fficu.THC
var TH = ffith.TH
var MTH = {}

MTH.init = function()
{
   var cuda_state = new fficu.THCState

   // initialize cuda for everybody involved
   THC.THCudaInit(cuda_state.ref())

   // wrap any fct calls that required cuda state as first arg
   wrap_cuda_state(THC, cuda_state);
   // wrap_cuda_state(THC, cuda_state);

   // merge into MTH object
   merge_th_thc(MTH, TH, THC);

   MTH.th = TH
   MTH.thc = THC

   MTH.close = function()
   {
      console.log("Closing out cuda");
      MTH.THCudaShutdown(cuda_state.ref())
   }

   create_sub_classes(MTH);
   // console.log("CT:", MTH.THCudaTensor)
}

MTH.init()
// process.stdin.resume();//so the program will not close instantly

// then we create a shared library
function exitHandler(options, err) {
    // close out the cuda_state
    MTH.close();
    // if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

module.exports = MTH
