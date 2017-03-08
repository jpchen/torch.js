#ifndef TH_INC
#define TH_INC

#include "THGeneral.h"

#include "THBlas.h"
#ifdef USE_LAPACK
#include "THLapack.h"
#endif

#include "THAtomic.h"
#include "THVector.h"
#include "THLogAdd.h"
#include "THRandom.h"
#include "THStorage.h"
#include "THTensorExtra.h"
#include "THTensorApply.h"
#include "THTensorDimApply.h"

#include "THFile.h"
#include "THDiskFile.h"
#include "THMemoryFile.h"

// typedef float (*callbackFP_t)(float i_val);
// void THFloatTensor_fctapply(THFloatTensor *tensor, callbackFP_t js_fct)
// { 
// 	TH_TENSOR_APPLY(float, tensor, *tensor_data= (*js_fct)(*tensor_data););
// }


#endif
