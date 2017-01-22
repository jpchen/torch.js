'use strict';

var assert = require('assert');
// var utils = require('./utils.js');
var torch = require('./torch.js')
var ffi = require('ffi')
var ref =  require('ref')

// this is the tensor backend
// var THTensor = torch.THFloatTensor
//var THTensor = torch.THCudaTensor
//var THStorage = torch.THCudaStorage
//var THType = "CudaFloat"
var THTensor = torch.THFloatTensor
var THStorage = torch.THFloatStorage
var THType = "Float"

// // Can swap out different backing stores
// function TypedArrayBackingStore(ArrayType) {
// 	return {
// 		new: function(n) { return new ArrayType(n); },
// 		set: function(tgt, src, offset) {
// 			tgt.set(src, offset);
// 		}
// 	}
// }
// var ArrayBackingStore = {
// 	ArrayType: Array,
// 	new: function(n) {
// 		var a = new Array(n);
// 		while (n--) { a[n] = 0; }
// 		return a;
// 	},
// 	set: function(tgt, src, offset) {;
// 		for (var i = 0; i < src.length; i++) {
// 			tgt[i+offset] = src[i];
// 		}
// 	}
// };

// // The actual backing store we're using
// var BackingStore = TypedArrayBackingStore(Float64Array);

// var arr_to_long = function(dims)
// {
//   console.log("dds: ", dims.length);

//   // THLongStorage_fill(counter, 0);
//   var ls = torch.THLongStorage.newWithSize1(dims.length)
//     // torch.THLongStorage.fill(ls.ref(), 0)
//     for(var i=0; i < dims.length; i++){
//       console.log("ltense: ", i, " ", dims[i]);
//       torch.THLongStorage.set(ls.ref(), i, dims[i]);
//     }

//   // console.log("ltense: ", ls);

//   return ls
// }


// /* helpful functions */
// static void torch_Tensor_(c_readSizeStride)(lua_State *L, int index, int allowStride, THLongStorage **size_, THLongStorage **stride_)
// {
//   THLongStorage *size = NULL;
//   THLongStorage *stride = NULL;

//   if( (size = luaT_toudata(L, index, "torch.LongStorage")) )
//   {
//     if(!lua_isnoneornil(L, index+1))
//     {
//       if( (stride = luaT_toudata(L, index+1, "torch.LongStorage")) )
//         THArgCheck(stride->size == size->size, index+1, "provided stride and size are inconsistent");
//       else
//         THArgCheck(0, index+1, "torch.LongStorage expected");
//     }
//     THLongStorage_retain(size);
//     if(stride)
//       THLongStorage_retain(stride);
//   }
//   else
//   {
//     int i;

//     size = THLongStorage_newWithSize(8);
//     stride = THLongStorage_newWithSize(8);
//     THLongStorage_fill(size, -1);
//     THLongStorage_fill(stride, -1);

//     if(allowStride)
//     {
//       for(i = 0; i < 8; i++)
//       {
//         if(lua_isnone(L, index+2*i))
//           break;
//         size->data[i] = luaL_checklong(L, index+2*i);

//         if(lua_isnone(L, index+2*i+1))
//           break;
//         stride->data[i] = luaL_checklong(L, index+2*i+1);
//       }
//     }
//     else
//     {
//       for(i = 0; i < 8; i++)
//       {
//         if(lua_isnone(L, index+i))
//           break;
//         size->data[i] = luaL_checklong(L, index+i);
//       }
//     }
//   }

//   *size_ = size;
//   *stride_ = stride;
// }

// var c_readTensorStorageSizeStride = function(lua_State *L, int index, int allowNone, int allowTensor, int allowStorage, int allowStride,
//                                                          THStorage **storage_, long *storageOffset_, THLongStorage **size_, THLongStorage **stride_)
// {
//   THTensor *src = NULL;
//   THStorage *storage = NULL;

//   int arg1Type = lua_type(L, index);

//   if( allowNone && (arg1Type == LUA_TNONE) )
//   {
//     *storage_ = NULL;
//     *storageOffset_ = 0;
//     *size_ = NULL;
//     *stride_ = NULL;
//     return;
//   }
//   else if( allowTensor && (arg1Type == LUA_TUSERDATA) && (src = luaT_toudata(L, index, torch_Tensor)) )
//   {
//     *storage_ = src->storage;
//     *storageOffset_ = src->storageOffset;
//     *size_ = THTensor_(newSizeOf)(src);
//     *stride_ = THTensor_(newStrideOf)(src);
//     return;
//   }
//   else if( allowStorage && (arg1Type == LUA_TUSERDATA) && (storage = luaT_toudata(L, index, torch_Storage)) )
//   {
//     *storage_ = storage;
//     if(lua_isnone(L, index+1))
//     {
//       *storageOffset_ = 0;
//       *size_ = THLongStorage_newWithSize1(storage->size);
//       *stride_ = THLongStorage_newWithSize1(1);
//     }
//     else
//     {
//       *storageOffset_ = luaL_checklong(L, index+1)-1;
//       torch_Tensor_(c_readSizeStride)(L, index+2, allowStride, size_, stride_);
//     }
//     return;
//   }
//   else if( (arg1Type == LUA_TNUMBER) || (luaT_toudata(L, index, "torch.LongStorage")) )
//   {
//     *storage_ = NULL;
//     *storageOffset_ = 0;
//     torch_Tensor_(c_readSizeStride)(L, index, 0, size_, stride_);

//     return;
//   }

//   *storage_ = NULL;
//   *storageOffset_ = 0;

//   if(allowTensor && allowStorage)
//       THArgCheck(0, index, "expecting number or Tensor or Storage");
//   else if(allowTensor)
//       THArgCheck(0, index, "expecting number or Tensor");
//   else if(allowStorage)
//       THArgCheck(0, index, "expecting number or Storage");
//   else
//       THArgCheck(0, index, "expecting number");
// }

var arr_to_ls = function(dims){

  var dimension = 0;
  var size = torch.THLongStorage.newWithSize(dims.length).deref();
  torch.THLongStorage_fill(size.ref(), 0)
  for(var i=0; i < dims.length; i++)
  {
    // torch.THLongStorage.resize(size.ref(), dimension + 1);
    torch.THLongStorage_set(size.ref(), i, dims[i])
    // size.data[dimension] = dims[i];
    // dimension++;

    // console.log("s1:", size.data[i])
  }

  // console.log("dim size:", torch.THLongStorage.size(size.ref()), " true: ", dims.length)
  // console.log(size)
  // console.log("dim info:", torch.THLongStorage.size(size.ref()), " true: ", dims.length)
  return size;
}

// var arr_to_thc = function(dims){

//   var dimension = 0;
//   var size = torch.thc.THLongStorage_newWithSize(dims.length).deref();
//   for(var i=0; i < dims.length; i++)
//   {
//     // torch.THLongStorage.resize(size.ref(), dimension + 1);
//     size.data[dimension] = dims[i];
//     // torch.thc.THLongStorage_set(size.ref(), i, dims[i])
//     dimension++;
//     // console.log("ss entry: ", size.data[i])
//   }
//   // console.log("dim size:", torch.thc.THLongStorage_size(size.ref()), " true: ", dims.length)
//   return size;
// }

var f_arr_prod = function(dims)
{
    var prod = 1
  for(var i=0; i < dims.length; i++)
    prod *= dims[i]
  return prod
}

// Paul: this is an example of the different ways you can construct a torch tensor
// Send in a table, construct it from table
function Tensor(dims)
{
  if(!Array.isArray(dims))
    throw new Error("Tensor must have an array provided for construction");

  var i, j;
  var counter, tensor;
  var si = 0;
  var dimension = 0;
  var is_finished = 0;

  var size = arr_to_ls(dims)

  // console.log("tz sz: ", torch.THLongStorage.size(size.ref()))
  // console.log("tz sz: ", torch.THLongStorage.data(size.ref())[0])
  // console.log("tz sz: ", torch.THLongStorage.data(size.ref())[1])

  // console.log("Sz: ", size)
  // console.log("Sz: d0", size.data[0])


  var prod = f_arr_prod(dims)

  // this is our size
  this.dims = dims;
  this.length = prod

  // var tensor = THTensor.newWithSize1d(prod).deref();
  var tensor = THTensor.newWithSize(size.ref(), ref.NULL).deref();
  // var tensor = THTensor.newWithSize(size.ref(), ref.NULL).deref();
  // console.log("ref size:1 ", THTensor.nElement(tensor.ref()))
  this.data = tensor;
  this.ref = this.data.ref()

  // all the same types for now. I'll fix this later
  this.type = THType;
  this._tensor_object = THTensor;


  // var size = arr_to_ls(dims)

  // THTensor.resize(this.data.ref(), size.ref(), ref.NULL)
  // var ss = this.data.storage.deref()

  // console.log("ref size:2 ", THTensor.nElement(tensor.ref()))

  // throw new Error()

  // THStorage.resize(ss.ref(), prod)
  // console.log(ss)
  // console.log("Sizing info:", THTensor.newSizeOf(this.data.ref()).deref().data[0])
  // THTensor.fill(this.data.ref(), .15)
  // console.log("finisn fill")
  // var dr = THTensor.storage(tensor.ref()).deref()
  // for(var i=0; i < dims.length; i++)
  // {
  //   THStorage.set(dr.ref(), si++, dims[i]);
  // }

  // console.log(dr)


  // // console.log("strL;", dr)
  //  // for(var i = 0; i < size.data[size.size-1]; i++)
  //  //  {
  //  //    console.log("Setting: ", i+1);

  //  //    THStorage.set(dr.ref(), si++, i+1);//(real)lua_tonumber(L, -1));
  //  //  }
  //  for(var i=0; i < dims.length; i++)
  //  {
  //     // for(var j=0; j < dims[i];j++)
  //       THStorage.set(dr.ref(), si++, dims[i])//this.data.size[i])
  //  }

  //   // console.log("ds", this.data.size[0])
  //   // THTensor.fill(this.data.ref(), .15)
  //   // var ss = this.data.storage.deref()
  //   // console.log(ss)
  //   console.log(dr)

  //   var ssd = dr.data
  //   var sss = dr.size
  //   console.log("SS: ", sss)

  //   for(var i=0; i < dims[0]; i++)
  //   console.log("Ssd0:",dr.data[i])

    // console.log("Ss:",this.data.storage.deref())
    // console.log("Ss:",this.data.storage.deref())

    // console.log("postds", this.data.size[0])



  // counter = torch.THLongStorage.newWithSize(size.size).deref();
  // torch.THLongStorage.fill(counter.ref(), 0);

  // var tensor = THTensor.newWithSize(size.ref(), null).deref();
  // this.data = tensor;
  // console.log("DIDIDs: ", size.data[size.size-1])

  // // while(!is_finished)
  // // {
  //   // var dr = THTensor.storage(tensor.ref()).deref()

  //   // for(var i=0; i < dims.length; i++)
  //   // {
  //   // // for(var i=0; i < size.size; i++)
  //   // // {
  //   //   console.log("Setting: ", dims[i]);
  //   //   THStorage.set(dr.ref(), si++, dims[i]);//(real)lua_tonumber(L, -1));
  //   // }
  //   for(var i = 0; i < size.data[size.size-1]; i++)
  //   {
  //     console.log("Setting: ", size.data[i]);

  //     var dr = THTensor.storage(tensor.ref()).deref()
  //     THStorage.set(dr.ref(), si++, size.data[i]);//(real)lua_tonumber(L, -1));
  //   }

  //   console.log("dds: ", this.data.storage.nDimension)

    // console.log("Filling")
    // THTensor.fill(this.data.ref(), .15)
    // console.log("done fill")
  // console.log("ss", size.size);
}

Tensor.prototype.fill = function(val)
{
  THTensor.fill(this.ref, val)
  return this
}

Tensor.prototype.sum = function(ix)
{
  if(ix == undefined || ix == null)
    return THTensor.sumall(this.ref)
  else{
    throw new Error("Sum across dimension not yet supported")
  }
}
Tensor.prototype.sumreduce = Tensor.prototype.sum


Tensor.view_tensor = function(orig, dims) {
  var rsize = arr_to_ls(dims);
  var nt = THTensor.new().deref()
  // console.log("orig", orig)
  THTensor.set(nt.ref(), orig.ref()) //orig.storage, orig.storageOffset, rsize.ref())
  return nt
}

Tensor.prototype.view = function(dims)
{
  return Tensor.view_tensor(this.data, dims)
}

Tensor.prototype.reshape = function(dims) {
  var size = f_arr_prod(dims)
  assert(size === this.length, 'Tensor reshape invalid size');
  this.dims = dims;
  this.data = this.view(dims)
  this.ref = this.data.ref()
  return this
}

Object.defineProperties(Tensor.prototype, {
  rank: { get: function() { return this.dims.length; } },
});



Tensor.prototype.zero = function()
{
  return this.fill(0)
}

function gaussianSample(mu, sigma) {
   var u, v, x, y, q;
   do {
      u = 1 - Math.random();
      v = 1.7156 * (Math.random() - 0.5);
      x = u - 0.449871;
      y = Math.abs(v) + 0.386595;
      q = x * x + y * (0.196 * y - 0.25472 * x);
   } while (q >= 0.27597 && (q > 0.27846 || v * v > -4 * u * u * Math.log(u)));
   return mu + sigma * v / u;
}

Tensor.prototype.fillRandom = function()
{
 var scale = 1/this.length;
 return this.apply_function(function(val)
 {
    return gaussianSample(0, scale)
 })
}

Tensor.apply_js = function(tensortype, orig, cb)
{
  var callback = ffi.Callback('float', ['float'], cb);
  tensortype.fctapply(orig.ref(), callback);
}

Tensor.to_float = function(o_tense)
{
    var size = arr_to_ls(o_tense.dims);
    var tensor = torch.THFloatTensor.newWithSize(size.ref(), ref.NULL).deref();

    // var ffname = "copy" + o_tense.type
    // console.log("OOT: ", ffname)
    // console.log(torch.THFloatTensor)
    // console.log(torch.THFloatTensor[ffname])

    //this.length).deref();
    torch.THFloatTensor["copy" + o_tense.type](tensor.ref(), o_tense.data.ref());
    return tensor
}

Tensor.prototype.apply_function = function(cb)
{
  Tensor.function_in_float(this, function(float_tensor)
  {
    Tensor.apply_js(torch.THFloatTensor, float_tensor, cb);

  }, function(o_tensor)
  {
    Tensor.apply_js(THTensor, o_tensor, cb)
  });
  // // console.log(this)
  // if(THType.indexOf('Cuda') != -1)
  // {
  //   // this is our size
  //   // var prod = f_arr_prod(this.dims);
  //   // console.log("creating tensor to copy into..." + this.dims)
  //   // var size = arr_to_ls(this.dims);

  //   // // var tensor = torch.THFloatTensor.newWithSize1d(this.length).deref();
  //   // var tensor = torch.THFloatTensor.newWithSize(size.ref(), ref.NULL).deref();//this.length).deref();
  //   // // console.log("float size...", tensor)
  //   // // console.log("resizing..." + prod)
  //   // // torch.THFloatTensor.resize(tensor.ref(), size.ref(), ref.NULL)

  //   // // console.log("ref size: ", torch.THFloatTensor.nElement(tensor.ref()))
  //   // // console.log("cuda size: ", THTensor.nElement(this.data.ref()))

  //   // // torch.THFloatTensor.resizeAs(tensor.ref(), this.data.ref());
  //   // // console.log("copying... ")
  //   // torch.THFloatTensor["copy" + THType](tensor.ref(), this.data.ref());

  //   // console.log("Copied: ")
  //   // console.log(this.sum())
  //   // console.log(torch.THFloatTensor.sumall(tensor.ref()))

  //   // console.log("applying: ")
  //   var tensor = Tensor.to_float(this)

  //   // apply to this float tensor
  //   Tensor.apply_js(torch.THFloatTensor, float_tensor, cb);

  //   // then we copy back to the gpu tensor
  //   THTensor.copyFloat(this.data.ref(), tensor.ref())
  // }
  // else
  // {
  //   // otherwise, we apply for this type of tensor
  //   // this is currently a very expensive call
  //   // consider adding functions directly to the C extension code for frequently used functions
  //   // also making cuda extensions will obviously improve performance dramatically
  //   Tensor.apply_js(THTensor, this.data, cb)
  // }

  return this
}

Tensor.function_in_float = function(ten_object, cb_cuda, cb_other)
{
  if(ten_object.type.indexOf('Cuda') != -1)
  {
    // console.log("applying: ")
    var tensor = Tensor.to_float(ten_object)

    cb_cuda(tensor)

    // then we copy back to the gpu tensor
    THTensor.copyFloat(ten_object.data.ref(), tensor.ref())
  }
  else
  {
    // otherwise, we apply for this type of tensor
    cb_other(ten_object.data)
  }
}


Tensor.prototype.copy = function(other, offset) {
  offset = offset || 0;

  var tensor_to_copy = other.data
  var ttype = other.type

  if(offset != 0)
  {
    throw new Error("Cannot copy with offset currently")
  }

  // let's make the copy -- error if wrong sizes
  THTensor['copy' + ttype](this.data.ref(), other.data.ref())
  // THTensor.copy()
  // BackingStore.set(this.data, other.data, offset);

  return this;
};

Tensor.prototype.clone = function() {
  var copy = new Tensor(this.dims);
  return copy.copy(this);
};

// Make this Tensor refer to the same backing store as other
Tensor.prototype.refCopy = function(other) {
  this.dims = other.dims;
  this.length = other.length;
  this.data = other.data;
  this.ref = this.data.ref()
  this.type = other.type;
  return this;
}

// Create a new Tensor object that refers to the same backing store
//    as this Tensor object
Tensor.prototype.refClone = function() {
  var t = Object.create(Tensor.prototype);
  return t.refCopy(this);
};


// These are slow; don't use them inside any hot loops (i.e. they're good for
//    debgugging/translating data to/from other formats, and not much else)

Tensor.get_set = function(js_tensor, coords, val_or_tensor)
{
  var ndims = js_tensor.dims.length;
  var dfinal = ndims
  var cdim = 0;

  var o_tensor = js_tensor.data
  // start with the clone
  var tensor = THTensor.newWithTensor(o_tensor.ref()).deref()

  for(var dim=0; dim < dfinal; dim++)
  {
    var pix = coords[dim]
    // console.log("i", dim, " pix : ", pix)

    // we'll perform a narrow or select operation
    if(!Array.isArray(pix))
    {
      //we're a number -- make sure an int
      pix = Math.floor(pix)

      // we can go backwards from the end with negative numbers
      if(pix < 0) pix = tensor.size[cdim] + pix + 1
      if(!((pix >= 0) && (pix < tensor.size[cdim]))) throw new Error("tensor index out of bounds");

      if(ndims == 1){
        // we're here to set things, yo
        if(val_or_tensor != undefined){
          if(typeof(val_or_tensor) != "number") throw new Error("Value being set to single index needs to be number")
          THStorage.set(tensor.storage, tensor.storageOffset+pix*tensor.stride[0], val_or_tensor)
          // THTensor.free(tensor);

          return
        }
        else{
          // we're all done, we only have a 1d tensor, so index into it
          var rval = THStorage.get(tensor.storage, tensor.storageOffset+pix*tensor.stride[0])
          // THTensor.free(tensor);
          return rval
        }
      }
      else
      {
        // perform a select for this dimension and index
        THTensor.select(tensor.ref(), ref.NULL, cdim, pix)
        // after the selection, check our dimension count
        // console.log("preSelected:", ndims)
        // console.log("ptense:", tensor)
        ndims = THTensor.nDimension(tensor.ref())

        // ndims2 = THTensor.nDimension(tt2.ref())

        // console.log("postSelected:", ndims, " final: ", dfinal);//, " 2:", ndims2)
      }
    }
    else if(typeof(pix) != "number")
    {
      // messed this up, free it and kill the loop
      // THTensor.free(tensor);
      tensor = null;
      throw new Error("tensor index must be number of array of numbers")
    }
    else
    {

      var ixarray = pix;
      // we have an array, that means we want to do a narrow
      var start = 0;
      var end = tensor.size[cdim]-1;
      if(ixarray.length > 0)
      {
        start = ixarray[0]
        end = start;
      }

      if(start < 0) start = tensor.size[cdim] + start + 1;
      if(!((start >= 0) && (start < tensor.size[cdim]))) throw new Error("tensor start index out of bounds");

      if(ixarray.length > 1)
      {
        end = ixarray[1];
      }
      if(end < 0) end = tensor.size[cdim] + end + 1;
      if(!((end >= 0) && (end < tensor.size[cdim]))) throw new Error("tensor end index out of bounds");
      if(end < start) throw new Error("tensor end index must be greater than or equal to start");
      THTensor.narrow(tensor.ref(), ref.NULL, cdim++, start, end-start+1);
      // now how many dimensions are we?
      ndims = THTensor.nDimension(tensor.ref())
    }
  }

  // copy from the tensor value
  if(val_or_tensor){
    THTensor['copy' + val_or_tensor.type](tensor.ref(), val_or_tensor.data.ref())
  }
  return tensor
}

// These are no longer that slow, they use the efficient select and narrow operations of torch
Tensor.prototype.get = function(coords) {
  if(coords.length > this.dims.length)
    throw new Error("Get fail, too many indicies provided")

  //clone our internal tensor (pointer replica)
  var tensor = Tensor.get_set(this, coords)

  if(tensor == undefined || typeof(tensor) == "number")
    return tensor
  else
  {
    var tt_ref = this.refClone()
    tt_ref.override(tensor)
    return tt_ref
  }
};

Tensor.prototype.override = function(t_data, dims)
{
  this.dims = dims || Tensor.ls_to_array(THTensor.newSizeOf(t_data.ref()).deref())
  this.length = f_arr_prod(this.dims)
  this.data = t_data
  this.ref = this.data.ref()
}

Tensor.prototype.set = function(coords, val_or_tensor) {
  // either set a value or a tensor
  var tensor = Tensor.get_set(this, coords, val_or_tensor)
  // var tt_ref = Object.pro Tensor(THTensor.size(tensor.ref()))
  if(tensor == undefined)
    return tensor

  // create a reference to this thing
  var tt_ref = this.refClone()
  tt_ref.override(tensor)
  return tt_ref
};


Tensor.ls_to_array = function(ls)
{
  var dims = []
  for(var i=0; i < ls.size; i++){
    dims.push(torch.THLongStorage.get(ls.ref(), i))//data[i])
  }
  return dims
}

Tensor.get_size = function(ts, TensorType)
{
  TensorType = TensorType || THTensor
  return TensorType.newSizeOf(ts).deref()
}

Tensor.prototype.size = function(ix) {
  if(ix != undefined)
    return THTensor.size(this.data.ref(), ix)
  else
    return Tensor.ls_to_array(Tensor.get_size(this.data.ref()))
};

// Tensor.prototype.toString = function()
// {
//   // var ft = Tensor.to_float(this)
//   // console.log("Ft desc:", torch.THFloatTensor.desc(ft.ref()).str)
// }

Tensor.prototype.min = function()
{
  return THTensor.minall(this.data.ref())
}
Tensor.prototype.minreduce = Tensor.prototype.min

Tensor.prototype.max = function()
{
  return THTensor.maxall(this.data.ref())
}
Tensor.prototype.maxreduce = Tensor.prototype.max

Tensor.byte_sizeof = function(sz, ttype)
{
  var bbtensor = torch.THByteTensor
  if(ttype == "CudaFloat"){
    bbtensor = THTensor
  }
  else if(this.type.indexOf("Cuda") != -1)
    throw new Error("Don't know how to neTensor for cuda non-float")

  var bempty = bbtensor.newWithSize(sz.ref(), ref.NULL).deref()
  // console.log("empty in habitat: ", bempty)
  return {empty: bempty, byte_tensor: bbtensor}
}

Tensor.byte_nonzero = function(ts, ttype)
{
  console.log("refref", ts.ref)
  var sz = Tensor.get_size(ts.ref())
  var tempty = THTensor.newWithSize(sz.ref(), ref.NULL).deref()
  THTensor.zero(tempty.ref())
  var bobj = Tensor.byte_sizeof(sz, ttype)
  var bempty = bobj.empty;
  var bbtensor = bobj.byte_tensor
  // console.log("be EMPTY", bempty)


  // fill byte tensor with not equals
  THTensor.neTensor(bempty.ref(), tempty.ref(), ts.ref())
  return bbtensor.sumall(bempty.ref())
}

Tensor.prototype.all = function()
{
  return Tensor.byte_nonzero(this.data, this.type) == this.length
}
Tensor.prototype.allreduce = Tensor.prototype.all

Tensor.prototype.any = function()
{
  return Tensor.byte_nonzero(this.data, this.type) > 0
}
Tensor.prototype.anyreduce = Tensor.prototype.any

Tensor.prototype.dot = function(t) {
  var a = this, b = t;

  if (a.rank !== 2 || b.rank !== 2) {
    throw new Error('Inputs to dot should have rank = 2.');
  }
  if (a.dims[1] !== b.dims[0]) {
    throw new Error('Dimension mismatch in dot. Inputs have dimension ' + a.dims + ' and ' + b.dims + '.');
  }

  var t_for_mul = THTensor.new().deref()
  THTensor.resize2d(t_for_mul.ref(), a.dims[0], b.dims[1])
  var beta = 0
  var alpha = 1

  THTensor.addmm(t_for_mul.ref(), beta, t_for_mul.ref(), alpha, a.data.ref(), b.data.ref())

  var mm_tensor = a.refClone()
  mm_tensor.override(t_for_mul, [a.dims[0], b.dims[1]])
  return mm_tensor
}

Tensor.create_empty_of_size = function(ts, TensorType)
{
  TensorType = TensorType || THTensor
  return TensorType.newWithSize(Tensor.get_size(ts, TensorType).ref(), ref.NULL).deref()
}

Tensor.prototype.cholesky = function() {

  var a = this;
  assert.ok((a.rank === 2) && (a.dims[0] === a.dims[1]),
            'cholesky is only defined for square matrices.');

  var cc
  if(this.type.indexOf("Cuda") != -1)
  {
    var THFloatTensor = torch.THFloatTensor
    assert.ok(this.type == "CudaFloat", "don't know how to convert cuda types other than float")

    // create and copy this tensor to float
    var tensor = Tensor.to_float(this)

    // create our final cuda object to hold the cholesky decomp
    cc = Tensor.create_empty_of_size(a.data.ref())

    // create temporary float to hold decomp
    var ff = Tensor.create_empty_of_size(tensor.ref(), THFloatTensor)

    // both float tensors, do the operation
    THFloatTensor.potrf(tensor.ref(), ff.ref())

    // then we copy back to the gpu tensor
    THTensor.copyFloat(cc.ref(), ff.ref())

    // free the extra float tensors
    THFloatTensor.free(tensor.ref())
    THFloatTensor.free(ff.ref())
  }
  else {
    // simple if not cuda
    cc = Tensor.create_empty_of_size(a.data.ref())
    // perform operation
    THTensor.potrf(this.data.ref(), cc.ref())

  }

  var ccTensor = a.refClone()
  ccTensor.override(cc, a.dims.slice(0))
  return ccTensor
}

Tensor.arr_is_equal = function(a,b)
{
  if(a.length != b.length)
    return false
  for(var i=0; i < a.length; i++)
    if(a[i] != b[i])
      return false

  return true
}



Tensor.prototype.assert_size_equal = function(other, assert_msg)
{
  if(typeof(other) == "number")
    return true
  else{
    var are_equal = Tensor.arr_is_equal(other.dims, this.dims)
    assert.ok(are_equal, assert_msg)
    return are_equal
  }
}


function addOperationOrComponentOpMethod(name, method, comp_method, no_mval) {
  Tensor[name] = new Function('THTensor', 'Tensor', [
    'return function(adata, bdata, not_in_place, mval){',
    'mval = mval || 1',
    'var end_ref = adata.data',

    // if not in place, we have to add
    'if(not_in_place)',
    '{',
      'end_ref = Tensor.create_empty_of_size(adata.data.ref())',
    '}',

    'if(typeof(bdata) == "number")',
      'THTensor.' + method + '(end_ref.ref(), adata.data.ref(), mval*bdata)',
    'else',
      'THTensor.' + comp_method + '(end_ref.ref(), adata.data.ref(), ' + (no_mval ? '' : 'mval, ') + 'bdata.data.ref())',
    'return end_ref}'
  ].join('\n'))(THTensor, Tensor);
}

function addBinaryMethod(name, method, mulval) {
  mulval = mulval || 1

  // unfortunately complicated, we need to pass in some globals -- including THTensor and Tensor
  // in the future, we'll switch this to being able to support all sorts of tensors (cuda/float/double/etc)
  var fn_inplace = new Function('THTensor', 'Tensor', [
      'return function(c_or_tensor){',
      'this.assert_size_equal(c_or_tensor, "C' + name + ' must be equal sizes")',
      // not in place, make the clone
      'Tensor.' + method + '(this, c_or_tensor, false, ' + mulval + ')',
      'return this}'
  ].join('\n'))(THTensor, Tensor);

 var fn_notinplace = new Function('THTensor', 'Tensor', [
      'return function(c_or_tensor){',
      'this.assert_size_equal(c_or_tensor, "C' + name + ' must be equal sizes")',
      // not in place, make the clone
      'var atensor = Tensor.' + method + '(this, c_or_tensor, true, ' + mulval + ')',
      'var cc = this.refClone()',
      ' cc.override(atensor, this.dims.slice(0))',
      'return cc}'
  ].join('\n'))(THTensor, Tensor);

  Tensor.prototype[name + 'eq'] = fn_inplace;
  Tensor.prototype[name] = fn_notinplace
}

function addUnaryOperationMethod(name, method) {
  Tensor[name] = new Function('THTensor', 'Tensor', [
    'return function(adata, not_in_place){',
    'var end_ref = adata.data',

    // if not in place, we have to add
    'if(not_in_place)',
    '{',
      'end_ref = Tensor.create_empty_of_size(adata.data.ref())',
    '}',
    // operation in place please
    'THTensor.' + method + '(end_ref.ref(), adata.data.ref())',
    'return end_ref}'
  ].join('\n'))(THTensor, Tensor);
}

function addUnaryToPrototype(name, method) {
  // mulval = mulval || 1

  // unfortunately complicated, we need to pass in some globals -- including THTensor and Tensor
  // in the future, we'll switch this to being able to support all sorts of tensors (cuda/float/double/etc)
  var fn_inplace = new Function('THTensor', 'Tensor', [
      'return function(){',
      // not in place, make the clone
      'Tensor.' + method + '(this, false)',
      'return this}'
  ].join('\n'))(THTensor, Tensor);

 var fn_notinplace = new Function('THTensor', 'Tensor', [
      'return function(){',
      // not in place, make the clone
      'var atensor = Tensor.' + method + '(this, true)',
      'var cc = this.refClone()',
      'cc.override(atensor, this.dims.slice(0))',
      'return cc}'
  ].join('\n'))(THTensor, Tensor);

  Tensor.prototype[name + 'eq'] = fn_inplace;
  Tensor.prototype[name] = fn_notinplace
}

// here we're going to handle the basic calls to torch
// e.g. we want atensor.add or atensor.mul, pow, tan, etc

addOperationOrComponentOpMethod("add_tensors", "add", "cadd")
// console.log("add op: ", Tensor['add_tensors'])

// use add_tensors method to add tensors you dope
addBinaryMethod("add", "add_tensors")
// sub is opposite of add
addBinaryMethod("sub", "add_tensors", -1)

addOperationOrComponentOpMethod("mul_tensors", "mul", "cmul", true)
addBinaryMethod("mul", "mul_tensors")

addOperationOrComponentOpMethod("div_tensors", "div", "cdiv", true)
addBinaryMethod("div", "div_tensors")

addOperationOrComponentOpMethod("pow_tensors", "pow", "cpow", true)
addBinaryMethod("pow", "pow_tensors")


Tensor.byte_comparison = function(byte_comp_fct)
{
  return function(adata, bdata, not_in_place, mval){
    assert.ok(not_in_place, "In place equal doesn't make sense")

    // we ignore in place, not inplace because it's stupid
    var sz = Tensor.get_size(adata.data.ref())

    var tcompare
    if(typeof(bdata) == "number")
    {
      tcompare = THTensor.newWithSize(sz.ref(), ref.NULL).deref()
      THTensor.fill(tcompare.ref(), bdata)
    }
    else
    {
      assert.ok(adata.type == bdata.type, "Checking tensor equal must be same tensor type")
    }

    var bempty, bbtensor = Tensor.byte_sizeof(sz, ttype)
    THTensor[byte_comp_fct](bempty.ref(), adata.data.ref(), tcompare.ref())

    // currently handled stupidly
    var bb = adata.refClone()
    bb.override(bb, adata.dims.slice(0))
    bb.type = "Byte"
    return bb
  }
}

// Byte methods for comparisons
// a little tricky because cuda has no byte tensor for comparisons -- just use CudaFloat tensors
// then copy back into a bool array? no need?
Tensor.equal_tensors = Tensor.byte_comparison("eqTensor")
Tensor.nequal_tensors = Tensor.byte_comparison("neTensor")
Tensor.gtqual_tensors = Tensor.byte_comparison("gtTensor")
Tensor.gequal_tensors = Tensor.byte_comparison("geTensor")
Tensor.ltqual_tensors = Tensor.byte_comparison("ltTensor")
Tensor.lequal_tensors = Tensor.byte_comparison("leTensor")

addBinaryMethod("eq", "equal_tensors")
addBinaryMethod("neq", "nequal_tensors")
addBinaryMethod("gt", "gtual_tensors")
addBinaryMethod("ge", "geual_tensors")
addBinaryMethod("lt", "ltqual_tensors")
addBinaryMethod("le", "lequal_tensors")

Tensor.atan2_tensors = function(adata, bdata, not_in_place, mval)
{
  mval = mval || 1
  var end_ref = adata.data

  // if not in place, we have to add
  if(not_in_place)
  {
    end_ref = Tensor.create_empty_of_size(adata.data.ref())
  }

  if(typeof(bdata) == "number"){
    THTensor.add(end_ref.ref(), adata.data.ref(), bdata)
    bdata = {data: Tensor.create_empty_of_size(adata.data.ref())}
    THTensor.fill(bdata.data.ref(), bdata)
  }

  THTensor.atan2(end_ref.ref(), adata.data.ref(), bdata.data.ref())

  return end_ref
}

// handle atan2 with custom function
addBinaryMethod("atan2", "atan2_tensors")

// mod is weird -- I'm not going to support it
// addBinaryMethod('mod', 'a % b');
Tensor.prototype.mod = function()
{
  throw new Error("Mod not supported in torch, no support here")
}

Tensor.prototype.modeq = function()
{
  throw new Error("In place mod not supported in torch, no support here")
}

addUnaryOperationMethod("neg_tensor", "neg")
// neg and negeq are the function names, and they call Tensor.neg_tensor
addUnaryToPrototype("neg", "neg_tensor")

addUnaryOperationMethod("round_tensor", "round")
addUnaryToPrototype("round", "round_tensor")

addUnaryOperationMethod("log_tensor", "log")
addUnaryToPrototype("log", "log_tensor")

addUnaryOperationMethod("exp_tensor", "exp")
addUnaryToPrototype("exp", "exp_tensor")

addUnaryOperationMethod("sqrt_tensor", "sqrt")
addUnaryToPrototype("sqrt", "sqrt_tensor")

addUnaryOperationMethod("abs_tensor", "abs")
addUnaryToPrototype("abs", "abs_tensor")

addUnaryOperationMethod("ceil_tensor", "ceil")
addUnaryToPrototype("ceil", "ceil_tensor")

addUnaryOperationMethod("floor_tensor", "floor")
addUnaryToPrototype("floor", "floor_tensor")

addUnaryOperationMethod("cos_tensor", "cos")
addUnaryToPrototype("cos", "cos_tensor")

addUnaryOperationMethod("sin_tensor", "sin")
addUnaryToPrototype("sin", "sin_tensor")

addUnaryOperationMethod("tan_tensor", "tan")
addUnaryToPrototype("tan", "tan_tensor")

addUnaryOperationMethod("acos_tensor", "acos")
addUnaryToPrototype("acos", "acos_tensor")

addUnaryOperationMethod("asin_tensor", "asin")
addUnaryToPrototype("asin", "asin_tensor")

addUnaryOperationMethod("atan_tensor", "atan")
addUnaryToPrototype("atan", "atan_tensor")

addUnaryOperationMethod("cosh_tensor", "cosh")
addUnaryToPrototype("cosh", "cosh_tensor")

addUnaryOperationMethod("sinh_tensor", "sinh")
addUnaryToPrototype("sinh", "sinh_tensor")

addUnaryOperationMethod("tanh_tensor", "tanh")
addUnaryToPrototype("tanh", "tanh_tensor")


// Haven't written these yet -- don't exist inside of TensorMath
addUnaryOperationMethod("acosh_tensor", "acosh")
addUnaryToPrototype("acosh", "acosh_tensor")
addUnaryOperationMethod("asinh_tensor", "asinh")
addUnaryToPrototype("asinh", "asinh_tensor")
addUnaryOperationMethod("atanh_tensor", "atanh")
addUnaryToPrototype("atanh", "atanh_tensor")

// acosh
Tensor.prototype.acosheq = function()
{
  // in javascript:
  //return Math.log(x + Math.sqrt(x * x - 1));
  // clone it to
  var xx = this.clone().muleq(this).addeq(-1)
  return this.addeq(xx).logeq()
}

Tensor.prototype.acosh = function()
{
  var cc = this.clone()
  cc.acosheq()
  return cc
}

// asinh
Tensor.prototype.asinheq = function()
{
  // in javascript:
  //return Math.log(x + Math.sqrt(x * x + 1));
  // clone it to
  var xx = this.clone().muleq(this).addeq(1)
  return this.addeq(xx).logeq()
}

Tensor.prototype.asinh = function()
{
  var cc = this.clone()
  cc.asinheq()
  return cc
}

// atanh
Tensor.prototype.atanheq = function()
{
  // in javascript:
  // return Math.log((1+x)/(1-x)) / 2;
  // clone it to
  var negxone = this.neg().addeq(1)

  // 1+x  then divide in place by (1-x) then log in place then divide in place
  return this.addeq(1).diveq(negxone).logeq().diveq(2)
}

Tensor.prototype.atanh = function()
{
  var cc = this.clone()
  cc.atanheq()
  return cc
}

// invert
Tensor.prototype.inverteq = function()
{
  // in javascript:
  // '1 / x'
  // create something of that size

  //create something this size with 1s and then cdiv
  var cc = Tensor.create_empty_of_size(this.data.ref())
  THTensor.fill(cc.ref(), 1)
  var ccTensor = this.refClone()
  ccTensor.override(cc, this.dims)
  ccTensor.diveq(this)
  // then copy back into ourselves
  this.copy(ccTensor)
  return this
}

Tensor.prototype.invert = function()
{
  var cc = this.clone()
  cc.inverteq()
  return cc
}

// sigmoid
Tensor.prototype.sigmoideq = function()
{
  // in javascript:
  // '1 / (1 + Math.exp(-x))')
  // create something of that size

  // == (1 + Math.exp(-x))
  return this.negeq().expeq().addeq(1).inverteq()
}

Tensor.prototype.sigmoid = function()
{
  var cc = this.clone()
  cc.sigmoideq()
  return cc
}

Tensor.prototype.isFiniteeq = function()
{
  return this.apply_function(function(val)
  {
    return isFinite(val) ? 1.0 : 0.0
  })
}
Tensor.prototype.isFinite = function()
{
  var cc = this.clone()
  cc.isFiniteeq()
  return cc
}

Tensor.prototype.isNaNeq = function()
{
  return this.apply_function(function(val)
  {
    return isNaN(val) ? 1.0 : 0.0
  })
}

Tensor.prototype.isNaN = function()
{
  var cc = this.clone()
  cc.isNaNeq()
  return cc
}

Tensor.prototype.pseudoinverteq = function()
{
  return this.apply_function(function(val)
  {
    return val == 0 ? 0 : 1/val
  })
}

Tensor.prototype.pseudoinvert = function()
{
  var cc = this.clone()
  cc.pseudoinverteq()
  return cc
}

Tensor.prototype.softmaxeq = function() {
  // Find max elem
  var max = this.max()
  // clone it, subtract the max, then exponentiate
  var cc = this.addeq(-max).expeq()
  var sum = cc.sum()
  // divide all by the sum
  cc.diveq(sum)
  return this
};

Tensor.prototype.softmax = function() {
  // Find max elem
  var max = this.max()
  // clone it, subtract the max, then exponentiate
  var cc = this.clone().addeq(-max).expeq()
  var sum = cc.sum()
  // divide all by the sum
  cc.diveq(sum)
  return cc
};


Tensor.prototype.diagonal = function() {
  assert.ok(this.rank === 2);
  assert.ok(this.dims[1] === 1);

  var etensor = Tensor.create_empty_of_size(this.data.ref())
  THTensor.diag(etensor.ref(),this.data.ref(),0)
  var ccTensor = this.refClone()
  ccTensor.override(etensor, this.dims)
  return ccTensor
}

// by default, swap first two dimensions
Tensor.prototype.transpose = function(ix, ix2) {
  // clone it up
  var ccTensor = this.clone()

  if(ix == undefined)
    THTensor.transpose(ccTensor.data.ref(), ref.NULL, 0, 1)
  else
    THTensor.transpose(ccTensor.data.ref(), ref.NULL, ix, ix2)

  return ccTensor
}
Tensor.prototype.T = Tensor.prototype.transpose

Tensor.prototype.inverse = function() {
  assert.ok(this.rank === 2);
  assert.ok(this.dims[0] === this.dims[1]);

  // clone something our size
  var etensor = Tensor.create_empty_of_size(this.data.ref())

  // stick the inverse into the new empty clone
  THTensor.getri(etensor.ref(), this.data.ref())

  var ccTensor = this.refClone()
  ccTensor.override(etensor, this.dims)
  return ccTensor
}
Tensor.prototype.inv = Tensor.prototype.inverse


Tensor.prototype.determinant = function()
{
  assert.ok(this.rank === 2, "determinant only for square matrix (rank 2)");
  assert.ok(this.dims[0] === this.dims[1], "determinant only for square matrix!");
  var determinant;

  Tensor.function_in_float(this, function(float_tensor)
  {
    determinant = torch.THFloatTensor.determinant(float_tensor.ref());

  }, function(o_tensor)
  {
    determinant = THTensor.determinant(o_tensor.ref())
  });

  return determinant
}



// // -- Lua 5.2 compatibility
// var log10 = function(x){ return Math.log(x, 10)}

// // // -- tostring() functions for Tensor and Storage
// Tensor.Storage_printformat = function(self){
//    if(self.dims.length == 0 ){
//      return "", null, 0
//    }
//    var intMode = true
//    var type = self.type
// // --   if type == 'torch.FloatStorage' or type == 'torch.DoubleStorage' then
//       for(var i=0; i < self.dims.length; i++){
//          if(self.type.indexOf("Float") != -1 || self.type.indexOf("Double") != -1){
//           // (self[i] != Math.ceil(self[i])) {
//             intMode = false
//             break;
//          }
//       }
// // --   end
//    // var tensor = torch.DoubleTensor(torch.DoubleStorage(self.size()):copy(self), 1, self.size()):abs()
//    var tensor = this.abs()

//    var expMin = tensor.min()
//    if(expMin != 0)
//       expMin = Math.floor(log10(expMin)) + 1
//    else
//       expMin = 1

//    var expMax = tensor.max()
//    if(expMax != 0)
//       expMax = Math.floor(log10(expMax)) + 1
//    else
//       expMax = 1

//    var format
//    var scale
//    var sz
//    if(intMode){
//       if(expMax > 9){
//          format = "%11.4e"
//          sz = 11
//        }
//       else{
//          format = "%SZd"
//          sz = expMax + 1
//       }
//     }
//    else{
//       if(expMax-expMin > 4){
//          format = "%SZ.4e"
//          sz = 11
//          if(Math.abs(expMax) > 99 || Math.abs(expMin) > 99){
//             sz = sz + 1
//          }
//        }
//       else{
//          if (expMax > 5 || expMax < 0 ){
//             format = "%SZ.4f"
//             sz = 7
//             scale = Math.pow(10, expMax-1)
//           }
//          else{
//             format = "%SZ.4f"
//             if (expMax == 0)
//                sz = 7
//             else
//                sz = expMax+6
//          }
//       }
//    }

//    format = format.replace('SZ', sz)
//    if(scale == 1)
//       scale = null

//    return format, scale, sz
// }

// // Tensor.Storage_tostring = function(self){
// //    var strt = {'\n'}
// //    var format, scale = Tensor.Storage_printformat(self)
// //    if format:sub(2,4) == 'nan' then format = '%f' end
// //    if scale then
// //       table.insert(strt, string.format('%g', scale) .. ' *\n')
// //       for i = 1,self.size() do
// //          table.insert(strt, string.format(format, self[i]/scale) .. '\n')
// //       end
// //    else
// //       for i = 1,self.size() do
// //          table.insert(strt, string.format(format, self[i]) .. '\n')
// //       end
// //    end
// //    table.insert(strt, '[' .. torch.typename(self) .. ' of size ' .. self.size() .. ']\n')
// //    var str = table.concat(strt)
// //    return str
// // }

// if (!String.format) {
//   String.format = function(format) {
//     var args = Array.prototype.slice.call(arguments, 1);
//     return format.replace(/{(\d+)}/g, function(match, number) {
//       return typeof args[number] != 'undefined'
//         ? args[number]
//         : match
//       ;
//     });
//   };
// }

// Tensor.prototype.toString = function(indent)
// {
//   var self = this
//   indent = indent || ''
//    var format,scale,sz = Storage__printformat(self.storage())
//    if(format.substr(1,3) == 'nan') format = '%f'

//    var sz = this.dims.length
// // --   print('format = ' .. format)
//    var scale = scale || 1
//    var strt = [indent]
//    var nColumnPerLine = Math.floor((80-indent.length)/(sz+1))
// // --   print('sz = ' .. sz .. ' and nColumnPerLine = ' .. nColumnPerLine)
//    var firstColumn = 1
//    var lastColumn = -1
//    while (firstColumn <= self.dims[1]){
//       if(firstColumn + nColumnPerLine - 1 <= self.dims[1])
//          lastColumn = firstColumn + nColumnPerLine - 1
//       else
//          lastColumn = self.dims[1]

//       if(nColumnPerLine < self.dims[1]){
//          if(firstColumn != 1)
//             strt.append('\n')

//          strt.append('Columns ' + firstColumn + ' to ' + lastColumn + '\n' + indent)
//       }
//       if(scale != 1)
//          strt.append(String.format("{0}", scale) + ' *\n ' + indent)

//       for(var l=0; l < self.dims[0]; l++){

//          // this is harder to do in javascript
//          var row = self.select(1, l)

//          for(var c=firstColumn; c < lastColumn; c++) {
//             strt.append(String.format(format, row[c]/scale))

//             if(c == lastColumn){
//               strt.append('\n')
//                if(l!=self.dims[0]){
//                  if (scale != 1)
//                      strt.append(indent + ' ')
//                   else
//                      strt.append(indent)
//                }
//             }
//             else
//               strt.append(' ')
//          }
//       }
//       firstColumn = lastColumn + 1
//    }

//    var str = strt.join('')
//    return str
// }

// keeping this as an example of what addOperationOrComponentOpMethod creates
// Tensor.add_tensors = function(adata, bdata, not_in_place, mval)
// {
//   mval = mval || 1
//   var end_ref = adata.data

//   // if not in place, we have to add
//   if(not_in_place)
//   {
//     end_ref = Tensor.create_empty_of_size(adata.data.ref())
//   }

//   if(typeof(bdata) == "number")
//     THTensor.add(end_ref.ref(), adata.data.ref(), bdata)
//   else
//     THTensor.cadd(end_ref.ref(), adata.data.ref(), mval, bdata.data.ref())

//   return end_ref
// }

// Tensor.prototype.addeq = function(c_or_tensor)
// {
//   this.assert_size_equal(c_or_tensor, "CAdd must be equal sizes")
//   // this is in place
//   Tensor.add_tensors(this, c_or_tensor, false, 1)
// }

// // add not in place
// Tensor.prototype.add = function(c_or_tensor)
// {
//   this.assert_size_equal(c_or_tensor, "CAdd must be equal sizes")
//   // not in place, make the clone
//   var atensor = Tensor.add_tensors(this, c_or_tensor, true, 1)

//   var cc = this.refClone()
//   cc.override(atensor, this.dims.slice(0))
//   return cc
// }

// // same as add, except with a -1 for the multiplier
// Tensor.prototype.subeq = function(c_or_tensor)
// {
//   this.assert_size_equal(c_or_tensor, "CSub must be equal sizes")
//   // this is in place
//   Tensor.add_tensors(this, c_or_tensor, false, -1)
// }

// // same as sub not in place, except with a -1 for the multiplier
// Tensor.prototype.sub = function(c_or_tensor)
// {
//   this.assert_size_equal(c_or_tensor, "CSub must be equal sizes")
//   // not in place, make the clone
//   var atensor = Tensor.add_tensors(this, c_or_tensor, true, -1)

//   var cc = this.refClone()
//   cc.override(atensor, this.dims.slice(0))
//   return cc
// }

// Tensor.prototype.muleq = function(c_or_tensor)
// {
//   if(typeof(c_or_tensor) == "number")
//   {
//     // add in place please
//     THTensor.mul(this.data.ref(), this.data.ref(), c_or_tensor)
//   }
//   else
//   {
//     // otherwise, make sure they're the same size
//     if(!Tensor.arr_is_equal(c_or_tensor.dims, this.dims)) throw new Error("Add must be same size tensors")

//     THTensor.cmul(this.data.ref(), this.data.ref(), c_or_tensor.data.ref())
//   }
//   return this
// }

// // add not in place
// Tensor.prototype.mul = function(c_or_tensor)
// {
//   var cc = this.clone()
//   cc.muleq(c_or_tensor)
//   return cc
// }


// addUnaryMethod('neg', '-x');
// addUnaryMethod('round', 'Math.round(x)');
// addUnaryMethod('log', 'Math.log(x)');
// addUnaryMethod('exp', 'Math.exp(x)');
// addUnaryMethod('sqrt', 'Math.sqrt(x)');
// addUnaryMethod('abs', 'Math.abs(x)');
// addUnaryMethod('ceil', 'Math.ceil(x)');
// addUnaryMethod('floor', 'Math.floor(x)');
// addUnaryMethod('cos', 'Math.cos(x)');
// addUnaryMethod('sin', 'Math.sin(x)');
// addUnaryMethod('tan', 'Math.tan(x)');
// addUnaryMethod('acos', 'Math.acos(x)');
// addUnaryMethod('asin', 'Math.asin(x)');
// addUnaryMethod('atan', 'Math.atan(x)');
// addUnaryMethod('cosh', 'Math.cosh(x)');
// addUnaryMethod('sinh', 'Math.sinh(x)');
// addUnaryMethod('tanh', 'Math.tanh(x)');
// addUnaryMethod('acosh', 'Math.acosh(x)');
// addUnaryMethod('asinh', 'Math.asinh(x)');
// addUnaryMethod('atanh', 'Math.atanh(x)');
// addUnaryMethod('sigmoid', '1 / (1 + Math.exp(-x))');
// addUnaryMethod('isFinite', 'isFinite(x)');
// addUnaryMethod('isNaN', 'isNaN(x)');
// addUnaryMethod('invert', '1/x');
// addUnaryMethod('pseudoinvert', 'x === 0 ? 0 : 1/x');

// addBinaryMethod('add', 'a + b');
// addBinaryMethod('sub', 'a - b');
// addBinaryMethod('mul', 'a * b');
// addBinaryMethod('div', 'a / b');
// addBinaryMethod('mod', 'a % b');
// addBinaryMethod('min', 'Math.min(a, b)');
// addBinaryMethod('max', 'Math.max(a, b)');
// addBinaryMethod('pow', 'Math.pow(a, b)');
// addBinaryMethod('atan2', 'Math.atan2(a, b)');
// addBinaryMethod('eq', 'a === b');
// addBinaryMethod('neq', 'a !== b');
// addBinaryMethod('gt', 'a > b');
// addBinaryMethod('ge', 'a >= b');
// addBinaryMethod('lt', 'a < b');
// addBinaryMethod('le', 'a <= b');

  // var unaryFns = [
  //   'floor', 'ceil', 'round', 'sqrt', 'exp', 'log', 'abs', 'sin', 'cos',
  //   'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'asinh',
  //   'acosh', 'atanh', 'sigmoid'
  // ];
  // var binaryFns = [
  //   'pow', 'min', 'max', 'atan2'
  // ];

// static int torch_Tensor_(__index__)(lua_State *L)
// {
//   THTensor *tensor = luaT_checkudata(L, 1, torch_Tensor);
//   THLongStorage *idx = NULL;
//   THByteTensor *mask;

//   if(lua_isnumber(L, 2))
//   {
//     long index = luaL_checklong(L,2)-1;

//     THArgCheck(tensor->nDimension > 0, 1, "empty tensor");
//     if (index < 0) index = tensor->size[0] + index + 1;
//     THArgCheck(index >= 0 && index < tensor->size[0], 2, "out of range");

//     if(tensor->nDimension == 1)
//     {
//       lua_pushnumber(L, THStorage_(get)(tensor->storage, tensor->storageOffset+index*tensor->stride[0]));
//     }
//     else
//     {
//       tensor = THTensor_(newWithTensor)(tensor);
//       THTensor_(select)(tensor, NULL, 0, index);
//       luaT_pushudata(L, tensor, torch_Tensor);
//     }
//     lua_pushboolean(L, 1);
//     return 2;
//   }
//   else if((idx = luaT_toudata(L, 2, "torch.LongStorage")))
//   {
//     long index = THTensor_(storageOffset)(tensor);
//     int dim;

//     THArgCheck(idx->size == tensor->nDimension, 2, "invalid size");

//     for(dim = 0; dim < idx->size; dim++)
//     {
//       long z = idx->data[dim]-1;
//       if (z < 0) z = tensor->size[dim] + z + 1;
//       THArgCheck((z >= 0) && (z < tensor->size[dim]), 2, "index out of bound");
//       index += z*tensor->stride[dim];
//     }
//     lua_pushnumber(L, (double)THStorage_(get)(THTensor_(storage)(tensor), index));
//     lua_pushboolean(L, 1);
//     return 2;
//   }
//   else if(lua_istable(L, 2))
//   {
//     int dim;
//     int cdim = 0;
//     int ndims;
//     int done = 0;

//     ndims = tensor->nDimension;
//     THArgCheck(lua_objlen(L, 2) <= ndims, 2, "too many indices provided");
//     tensor = THTensor_(newWithTensor)(tensor);

//     for(dim = 0; dim < ndims; dim++)
//     {
//       lua_rawgeti(L, 2, dim+1);
//       if(lua_isnumber(L, -1))
//       {
//         long z = lua_tonumber(L, -1)-1;
//         lua_pop(L, 1);
//         if (z < 0) z = tensor->size[cdim] + z + 1;
//         THArgCheck((z >= 0) && (z < tensor->size[cdim]), 2, "index out of bound");
//         if(tensor->nDimension == 1) {
//           done = 1;
//           lua_pushnumber(L, THStorage_(get)(tensor->storage, tensor->storageOffset+z*tensor->stride[0]));
//         } else {
//           THTensor_(select)(tensor, NULL, cdim, z);
//         }
//       }
//       else if (lua_istable(L, -1))
//       {
//         long start = 0;
//         long end = tensor->size[cdim]-1;
//         lua_rawgeti(L, -1, 1);
//         if(lua_isnumber(L, -1)) {
//           start = lua_tonumber(L, -1)-1;
//           end = start;
//         }
//         lua_pop(L, 1);
//         if (start < 0) start = tensor->size[cdim] + start + 1;
//         THArgCheck((start >= 0) && (start < tensor->size[cdim]), 2, "start index out of bound");

//         lua_rawgeti(L, -1, 2);
//         if(lua_isnumber(L, -1)) {
//           end = lua_tonumber(L, -1)-1;
//         }
//         lua_pop(L, 2);
//         if (end < 0) end = tensor->size[cdim] + end + 1;
//         THArgCheck((end >= 0) && (end < tensor->size[cdim]), 2, "end index out of bound");

//         THArgCheck((end >= start), 2, "end index must be greater or equal to start index");

//         THTensor_(narrow)(tensor, NULL, cdim++, start, end-start+1);
//       }
//       else
//       {
//         break;
//       }
//     }
//     if(!done) {
//       luaT_pushudata(L, tensor, torch_Tensor);
//     } else {
//       THTensor_(free)(tensor);
//     }
//     lua_pushboolean(L, 1);
//     return 2;
//   }
//   else if((mask = luaT_toudata(L, 2, "torch.ByteTensor")))
//   {
//     THTensor *vals = THTensor_(new)();
//     THTensor_(maskedSelect)(vals, tensor, mask);
//     luaT_pushudata(L, vals, torch_Tensor);
//     lua_pushboolean(L, 1);
//     return 2;
//   }
//   else
//   {
//     lua_pushboolean(L, 0);
//     return 1;
//   }
// }




// Tensor.prototype.fillRandom = function() {
//  var scale = 1/this.length;
//  var n = this.length;
//  while (n--) this.data[n] = utils.gaussianSample(0, scale);
//  return this;
// }


// Object.defineProperties(Tensor.prototype, {
// 	rank: { get: function() { return this.dims.length; } },
// });

// Tensor.prototype.reshape = function(dims) {
// 	var size = 1;
// 	var n = dims.length;
// 	while (n--) size *= dims[n];
// 	assert(size === this.length, 'Tensor reshape invalid size');
// 	this.dims = dims;
//   return this;
// }

// Tensor.prototype.fill = function(val) {
// 	// TODO: Use TypedArray.fill, when it is more broadly supported
// 	var n = this.length;
// 	while (n--) this.data[n] = val;
// 	return this;
// };

// Tensor.prototype.zero = function() {
// 	return this.fill(0);
// };

// // Adapted from:
// //    https://github.com/karpathy/convnetjs/blob/master/src/convnet_vol.js
// Tensor.prototype.fillRandom = function() {
// 	var scale = 1/this.length;
// 	var n = this.length;
// 	while (n--) this.data[n] = utils.gaussianSample(0, scale);
// 	return this;
// }

// Tensor.prototype.copy = function(other, offset) {
// 	offset = offset || 0;
// 	BackingStore.set(this.data, other.data, offset);
// 	return this;
// };

// Tensor.prototype.clone = function() {
// 	var copy = new Tensor(this.dims);
// 	return copy.copy(this);
// };

// // Make this Tensor refer to the same backing store as other
// Tensor.prototype.refCopy = function(other) {
// 	this.dims = other.dims;
// 	this.length = other.length;
// 	this.data = other.data;
// 	return this;
// }

// // Create a new Tensor object that refers to the same backing store
// //    as this Tensor object
// Tensor.prototype.refClone = function() {
// 	var t = Object.create(Tensor.prototype);
// 	return t.refCopy(this);
// };


// // These are slow; don't use them inside any hot loops (i.e. they're good for
// //    debgugging/translating data to/from other formats, and not much else)
// Tensor.prototype.get = function(coords) {
// 	var idx = 0;
// 	var n = this.dims.length;
// 	for (var i = 0; i < n; i++) {
// 		idx = idx * this.dims[i] + coords[i];
// 	}
// 	return this.data[idx];
// };
// Tensor.prototype.set = function(coords, val) {
// 	var idx = 0;
// 	var n = this.dims.length;
// 	for (var i = 0; i < n; i++) {
// 		idx = idx * this.dims[i] + coords[i];
// 	}
// 	this.data[idx] = val;
// };
// function toArrayRec(tensor, coords) {
// 	if (coords.length === tensor.rank) {
// 		return tensor.get(coords);
// 	} else {
// 		var dim = coords.length;
// 		var arr = [];
// 		for (var i = 0; i < tensor.dims[dim]; i++) {
// 			arr.push(toArrayRec(tensor, coords.concat([i])));
// 		}
// 		return arr;
// 	}
// }
// Tensor.prototype.toArray = function() {
// 	return toArrayRec(this, []);
// };
// function fromArrayRec(tensor, coords, x) {
// 	if (!(x instanceof Array)) {
// 		tensor.set(coords, x);
// 	} else {
// 		var dim = coords.length;
// 		for (var i = 0; i < tensor.dims[dim]; i++) {
// 			fromArrayRec(tensor, coords.concat([i]), x[i]);
// 		}
// 	}
// }
// Tensor.prototype.fromArray = function(arr) {
// 	fromArrayRec(this, [], arr);
// 	return this;
// };

// Tensor.prototype.toString = function() {
// 	return this.toArray().toString();
// };


// Tensor.prototype.toFlatArray = function() {
// 	return Array.prototype.slice.call(this.data);
// }
// Tensor.prototype.fromFlatArray = function(arr) {
// 	BackingStore.set(this.data, arr, 0);
// 	return this;
// }



// function addUnaryMethod(name, fncode) {
// 	var fneq = new Function([
// 		'var n = this.data.length;',
// 		'while (n--) {',
// 		'	var x = this.data[n];',
// 		'	this.data[n] = ' + fncode + ';',
// 		'}',
// 		'return this;'
// 	].join('\n'));
// 	Tensor.prototype[name + 'eq'] = fneq;
// 	Tensor.prototype[name] = function() {
// 		var nt = this.clone();
// 		return fneq.call(nt);
// 	};
// }

// function addBinaryMethod(name, fncode) {
// 	var fneqS = new Function('s', [
// 		'var n = this.data.length;',
// 		'var b = s;',
// 		'while (n--) {',
// 		'	var a = this.data[n];',
// 		'	this.data[n] = ' + fncode + ';',
// 		'}',
// 		'return this;'
// 	].join('\n'));
// 	var fneqT = new Function('t', [
// 		'var n = this.data.length;',
// 		'while (n--) {',
// 		'	var a = this.data[n];',
// 		'	var b = t.data[n];',
// 		'	this.data[n] = ' + fncode + ';',
// 		'}',
// 		'return this;'
// 	].join('\n'));

// 	var fneq = function(x) {
// 		if (x.constructor === Tensor)
// 			return fneqT.call(this, x);
// 		else
// 			return fneqS.call(this, x);
// 	}
// 	Tensor.prototype[name + 'eq'] = fneq;
// 	Tensor.prototype[name] = function(x) {
// 		var nt = this.clone();
// 		return fneq.call(nt, x);
// 	};
// }

// function addReduction(name, initcode, fncode) {
// 	Tensor.prototype[name+'reduce'] = new Function([
// 		'var accum = ' + initcode + ';',
// 		'var n = this.data.length;',
// 		'while (n--) {',
// 		'	var x = this.data[n];',
// 		'	accum = ' + fncode + ';',
// 		'}',
// 		'return accum;'
// 	].join('\n'));
// }


// addUnaryMethod('neg', '-x');
// addUnaryMethod('round', 'Math.round(x)');
// addUnaryMethod('log', 'Math.log(x)');
// addUnaryMethod('exp', 'Math.exp(x)');
// addUnaryMethod('sqrt', 'Math.sqrt(x)');
// addUnaryMethod('abs', 'Math.abs(x)');
// addUnaryMethod('ceil', 'Math.ceil(x)');
// addUnaryMethod('floor', 'Math.floor(x)');
// addUnaryMethod('cos', 'Math.cos(x)');
// addUnaryMethod('sin', 'Math.sin(x)');
// addUnaryMethod('tan', 'Math.tan(x)');
// addUnaryMethod('acos', 'Math.acos(x)');
// addUnaryMethod('asin', 'Math.asin(x)');
// addUnaryMethod('atan', 'Math.atan(x)');
// addUnaryMethod('cosh', 'Math.cosh(x)');
// addUnaryMethod('sinh', 'Math.sinh(x)');
// addUnaryMethod('tanh', 'Math.tanh(x)');
// addUnaryMethod('acosh', 'Math.acosh(x)');
// addUnaryMethod('asinh', 'Math.asinh(x)');
// addUnaryMethod('atanh', 'Math.atanh(x)');
// addUnaryMethod('sigmoid', '1 / (1 + Math.exp(-x))');
// addUnaryMethod('isFinite', 'isFinite(x)');
// addUnaryMethod('isNaN', 'isNaN(x)');
// addUnaryMethod('invert', '1/x');
// addUnaryMethod('pseudoinvert', 'x === 0 ? 0 : 1/x');

// addBinaryMethod('add', 'a + b');
// addBinaryMethod('sub', 'a - b');
// addBinaryMethod('mul', 'a * b');
// addBinaryMethod('div', 'a / b');
// addBinaryMethod('mod', 'a % b');
// addBinaryMethod('min', 'Math.min(a, b)');
// addBinaryMethod('max', 'Math.max(a, b)');
// addBinaryMethod('pow', 'Math.pow(a, b)');
// addBinaryMethod('atan2', 'Math.atan2(a, b)');
// addBinaryMethod('eq', 'a === b');
// addBinaryMethod('neq', 'a !== b');
// addBinaryMethod('gt', 'a > b');
// addBinaryMethod('ge', 'a >= b');
// addBinaryMethod('lt', 'a < b');
// addBinaryMethod('le', 'a <= b');

// addReduction('sum', '0', 'accum + x');
// addReduction('min', 'Infinity', 'Math.min(accum, x)');
// addReduction('max', '-Infinity', 'Math.max(accum, x)');
// addReduction('all', 'true', 'accum && (x !== 0)');
// addReduction('any', 'false', 'accum || (x !== 0)');


// Tensor.prototype.softmax = function() {
// 	// Find max elem
// 	var max = -Infinity;
// 	var n = this.data.length;
// 	while (n--) {
// 		max = Math.max(max, this.data[n]);
// 	}
// 	var t = new Tensor(this.dims);
// 	// Exponentiate, guard against overflow
// 	n = this.data.length;
// 	var sum = 0;
// 	while (n--) {
// 		t.data[n] = Math.exp(this.data[n] - max);
// 		sum += t.data[n];
// 	}
// 	// Normalize
// 	n = this.data.length;
// 	while (n--) {
// 		t.data[n] /= sum;
// 	}
// 	return t;
// };


// // Do the conservative thing, and return a copy for now.
// Tensor.prototype.transpose = function() {
//   assert.ok(this.rank === 2);
//   var h = this.dims[0];
//   var w = this.dims[1];
//   var y = new Tensor([w, h]);
//   for (var i = 0; i < h; i++) {
//     for (var j = 0; j < w; j++) {
//       y.data[j * h + i] = this.data[i * w + j];
//     }
//   }
//   return y;
// };

// Tensor.prototype.diagonal = function() {
//   assert.ok(this.rank === 2);
//   assert.ok(this.dims[1] === 1);
//   var n = this.dims[0];
//   var y = new Tensor([n, n]);
//   for (var i = 0; i < n; i++) {
//     y.data[i * (n + 1)] = this.data[i];
//   }
//   return y;
// };

// // Matrix inverse.
// // Ported from numeric.js.
// Tensor.prototype.inverse = function() {

//   assert.ok(this.rank === 2);
//   assert.ok(this.dims[0] === this.dims[1]);
//   var n = this.dims[0];

//   var Ai, Aj;
//   var Ii, Ij;
//   var i, j, k, x;

//   var A = [];
//   for (i = 0; i < n; i++) {
//     Ai = new Float64Array(n);
//     A.push(Ai);
//     for (j = 0; j < n; j++) {
//       Ai[j] = this.data[i * n + j];
//     }
//   }

//   // Not using Float64 here as I want the convinience of passing I to
//   // fromArray() which doesn't currently work with Float64Array.
//   var I = [];
//   for (i = 0; i < n; i++) {
//     Ii = new Array(n);
//     I.push(Ii);
//     for (j = 0; j < n; j++) {
//       Ii[j] = i === j ? 1 : 0;
//     }
//   }

//   for (j = 0; j < n; ++j) {
//     var i0 = -1;
//     var v0 = -1;
//     for (i = j; i !== n; ++i) {
//       k = Math.abs(A[i][j]);
//       if (k > v0) {
//         i0 = i; v0 = k;
//       }
//     }
//     Aj = A[i0];
//     A[i0] = A[j];
//     A[j] = Aj;
//     Ij = I[i0];
//     I[i0] = I[j];
//     I[j] = Ij;
//     x = Aj[j];
//     for (k = j; k !== n; ++k) {
//       Aj[k] /= x;
//     }
//     for (k = n - 1; k !== -1; --k) {
//       Ij[k] /= x;
//     }
//     for (i = n - 1; i !== -1; --i) {
//       if (i !== j) {
//         Ai = A[i];
//         Ii = I[i];
//         x = Ai[j];
//         for (k = j + 1; k !== n; ++k) {
//           Ai[k] -= Aj[k] * x;
//         }
//         for (k = n - 1; k > 0; --k) {
//           Ii[k] -= Ij[k] * x;
//           --k;
//           Ii[k] -= Ij[k] * x;
//         }
//         if (k === 0) {
//           Ii[0] -= Ij[0] * x;
//         }
//       }
//     }
//   }
//   return new Tensor([n, n]).fromArray(I);
// };

// // Determinant.
// // Ported from numeric.js.
// Tensor.prototype.determinant = function() {
//   assert.ok(this.rank === 2);
//   assert.ok(this.dims[0] === this.dims[1]);
//   var n = this.dims[0];
//   var ret = 1;

//   var i, j, k;
//   var Aj, Ai, alpha, temp, k1, k2, k3;

//   var A = [];
//   for (i = 0; i < n; i++) {
//     Ai = new Float64Array(n);
//     A.push(Ai);
//     for (j = 0; j < n; j++) {
//       Ai[j] = this.data[i * n + j];
//     }
//   }

//   for (j = 0; j < n - 1; j++) {
//     k = j;
//     for (i = j + 1; i < n; i++) {
//       if (Math.abs(A[i][j]) > Math.abs(A[k][j])) {
//         k = i;
//       }
//     }
//     if (k !== j) {
//       temp = A[k];
//       A[k] = A[j];
//       A[j] = temp;
//       ret *= -1;
//     }
//     Aj = A[j];
//     for (i = j + 1; i < n; i++) {
//       Ai = A[i];
//       alpha = Ai[j] / Aj[j];
//       for (k = j + 1; k < n - 1; k += 2) {
//         k1 = k + 1;
//         Ai[k] -= Aj[k] * alpha;
//         Ai[k1] -= Aj[k1] * alpha;
//       }
//       if (k !== n) {
//         Ai[k] -= Aj[k] * alpha;
//       }
//     }
//     if (Aj[j] === 0) {
//       return 0;
//     }
//     ret *= Aj[j];
//   }
//   return ret * A[j][j];
// };

// Tensor.prototype.dot = function(t) {
//   var a = this, b = t;

//   if (a.rank !== 2 || b.rank !== 2) {
//     throw new Error('Inputs to dot should have rank = 2.');
//   }
//   if (a.dims[1] !== b.dims[0]) {
//     throw new Error('Dimension mismatch in dot. Inputs have dimension ' + a.dims + ' and ' + b.dims + '.');
//   }

//   var l = a.dims[1];
//   var h = a.dims[0], w = b.dims[1];
//   var y = new Tensor([h, w]);

//   for (var r = 0; r < h; r++) {
//     for (var c = 0; c < w; c++) {
//       var z = 0;
//       for (var i = 0; i < l; i++) {
//         z += a.data[r * l + i] * b.data[w * i + c];
//       }
//       y.data[r * w + c] = z;
//     }
//   }
//   return y;
// };

// Tensor.prototype.cholesky = function() {
//   var a = this;
//   assert.ok((a.rank === 2) && (a.dims[0] === a.dims[1]),
//             'cholesky is only defined for square matrices.');

//   // If a isn't positive-definite then the result will silently
//   // include NaNs, no warning is given.

//   var s;
//   var n = a.dims[0];
//   var L = new Tensor([n, n]);

//   for (var i = 0; i < n; i++) {
//     for (var j = 0; j <= i; j++) {
//       s = 0;
//       for (var k = 0; k < j; k++) {
//         s += L.data[i * n + k] * L.data[j * n + k];
//       }
//       L.data[i * n + j] = (i === j) ?
//           Math.sqrt(a.data[i * n + i] - s) :
//           1 / L.data[j * n + j] * (a.data[i * n + j] - s);
//     }
//   }

//   return L;
// };


module.exports = Tensor;
