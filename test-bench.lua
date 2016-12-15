local ffi = require 'ffi'
--local SZ1 = 2
SZ1 = 128*3
SZ2 = 64--//= 10
SZ3 = 64--//= 10
N = 10000

--local N = 10000000

--local N = 10000
--local SZ1 = 500
--local SZ2 = 210
--local SZ3 = 130

require 'torch'

ffi.cdef[[


typedef struct THAllocator THAllocator;

typedef struct
{
   double *data;
   long size;
   int refcount;
   char flag;
   THAllocator *allocator;
   void *allocatorContext;
} THDoubleStorage;

typedef struct
{
   long *size;
   long *stride;
   int nDimension;
   THDoubleStorage *storage;
   long storageOffset;
   int refcount;
   char flag;
} THDoubleTensor;

double THDoubleTensor_sumall(THDoubleTensor *tensor);

]]
require 'cutorch'

local function creatv(TFC, SZ1, SZ2, SZ3, isvec)
   local t
   if SZ2 and SZ3 then
      t = TFC(SZ1, SZ2, SZ3):fill(0.15)
   elseif SZ2 then
      t = TFC(SZ1, SZ2):fill(0.15)
   else
      t = TFC(SZ1):fill(0.15)
   end
   if isvec then
      t = t:reshape(t:nElement())
   end
   return t
end

local tt = torch.Tensor
local cut = torch.CudaTensor

local x = creatv(tt, SZ1, SZ2, SZ3)
local y = creatv(tt, SZ1, SZ2, SZ3, true)
local z = creatv(tt, SZ1, SZ2, SZ3, true)

local cux = creatv(cut, SZ1, SZ2, SZ3)
local cuy = creatv(cut, SZ1, SZ2, SZ3, true)
local cuz = creatv(cut, SZ1, SZ2, SZ3, true)
--x = x:transpose(2,3)

local x_p = x:cdata()
local y_p = y:cdata()
local z_p = z:cdata()

function benchmark(txt, func, endfunc, use_cuda)
   torch.manualSeed(1111)
   if use_cuda then 
      cux:copy(creatv(cut, SZ1, SZ2, SZ3))
      cuy:copy(creatv(cut, SZ1, SZ2, SZ3))
      cuz:copy(creatv(cut, SZ1, SZ2, SZ3))
   else 
      x:copy(creatv(tt, SZ1, SZ2, SZ3))
      y:copy(creatv(tt, SZ1, SZ2, SZ3))
      z:copy(creatv(tt, SZ1, SZ2, SZ3))
   end

   print('--------------------------------------------')
   print(txt .. ' input size: ' .. SZ1)
   local t = torch.Timer()
   for i=1,N do
      func()
   end
   print('time for ' .. N .. ' calls: ', t:time().real)
   endfunc()
end

benchmark(
   'torch7 sumall',
   function()
      sum = torch.sum(x)
   end,
   function()
      print('sum', sum)
   end
)


benchmark(
   'cutorch7 sumall',
   function()
      sum = torch.sum(cux)
   end,
   function()
      print('sum', sum)
   end
)

os.exit()
