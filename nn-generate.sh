ffi-generate -f ~/torch/extra/nn/lib/THNN/generic/THNN.h -l libTHNN -L /Library/Developer/CommandLineTools/usr/lib/ -m THNN -p THNN -s --I ~/torch/extra/nn/lib/THNN/ >THNN.js

# then add ~/torch/install/lib to DYLD_LIBRARY_PATH

