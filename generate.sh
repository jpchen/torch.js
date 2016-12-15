# call this, then remove the lapack calls for the non-float types, and the THVector* functions
# ffi-generate -f ~/torch/install/include/TH/TH.h -l libTH -L /Library/Developer/CommandLineTools/usr/lib/ -m TH -p TH -s --I ~/torch/install/include/TH/ >TH.js
# ffi-generate -f ~/torch/install/include/TH/CCTH.h -l libTH -L /Library/Developer/CommandLineTools/usr/lib/ -m TH -p TH -s --I ~/torch/install/include/TH/ >TH.js
ffi-generate -f ./thlib/ccTH.h -l ./thlib/build/libmTH -L/Library/Developer/CommandLineTools/usr/lib/ -m TH -p TH -s -- -I./thlib/ -I./thlib/build > TH.js

  # THCudaInit: [ref.types.void, [
  #   THCStatePtr,
  # ]],
  # THCudaShutdown: [ref.types.void, [
  #   THCStatePtr,
  # ]],
# create the cuda bindings
#ffi-generate -f ./cuthlib/ccTHC.h -l ./cuthlib/build/libmTHC -L /Library/Developer/CommandLineTools/usr/lib/ -L/usr/lib/ -m THC -p THC -s -- -I/usr/local/cuda/include -I./thlib -I./thlib/build -I./cuthlib -I./cuthlib/build > cuTH.js

ffi-generate -f ./cuthlib/ccTHC.h -l ./cuthlib/build/libmTHC -L/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/ -m THC -p TH -s -- -I/usr/local/cuda/include -I./thlib -I./thlib/build -I./cuthlib -I./cuthlib/build > cuTH.js

# clean up the TH.js file
node cleaner.js

# then add ~/torch-distro/install/lib to DYLD_LIBRARY_PATH

