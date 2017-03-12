# call this, then remove the lapack calls for the non-float types, and the THVector* functions
ffi-generate -f ~/torch/install/include/TH/TH.h -l libTH -L /Library/Developer/CommandLineTools/usr/lib/ -m TH -p TH -s --I ~/torch/install/include/TH/ >THnew.js
#ffi-generate -f /Users/jpchen/torch/pkg/torch/lib/TH/TH.h -l libTH -L /Library/Developer/CommandLineTools/usr/lib/ -m TH -p TH -s --I /Users/jpchen/torch/pkg/torch/lib/TH/  > THnew.js

# then add ~/torch-distro/install/lib to DYLD_LIBRARY_PATH

