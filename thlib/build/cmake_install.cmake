# Install script for directory: /Volumes/256GHD/Work/paultorchjs/torch.js/thlib

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/build/libmTH.0.dylib"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/build/libmTH.dylib"
    )
  foreach(file
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libmTH.0.dylib"
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libmTH.dylib"
      )
    if(EXISTS "${file}" AND
       NOT IS_SYMLINK "${file}")
      execute_process(COMMAND "/usr/bin/install_name_tool"
        -id "libmTH.0.dylib"
        "${file}")
      if(CMAKE_INSTALL_DO_STRIP)
        execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/strip" "${file}")
      endif()
    endif()
  endforeach()
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/TH" TYPE FILE FILES
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/ccTH.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THAllocator.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THMath.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THBlas.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THDiskFile.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THFile.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THFilePrivate.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/build/THGeneral.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THGenerateAllTypes.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THGenerateFloatTypes.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THGenerateIntTypes.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THLapack.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THLogAdd.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THMemoryFile.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THRandom.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THStorage.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THTensorExtra.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THTensorApply.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THTensorDimApply.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THTensorMacros.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THVector.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/THAtomic.h"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/TH/generic" TYPE FILE FILES
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THBlas.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THBlas.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THLapack.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THLapack.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THStorage.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THStorage.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THStorageCopy.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THStorageCopy.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensor.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensor.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorExtraJS.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorExtraJS.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorConv.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorConv.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorCopy.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorCopy.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorLapack.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorLapack.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorMath.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorMath.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorRandom.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THTensorRandom.h"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THVectorDispatch.c"
    "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/generic/THVector.h"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/share/cmake/TH" TYPE FILE FILES "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/build/cmake-exports/THConfig.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/build/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
