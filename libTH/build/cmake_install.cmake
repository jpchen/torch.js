# Install script for directory: /Users/jpchen/jstorch/torch.js/libTH

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
    "/Users/jpchen/jstorch/torch.js/libTH/build/libmTH.0.dylib"
    "/Users/jpchen/jstorch/torch.js/libTH/build/libmTH.dylib"
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
    "/Users/jpchen/jstorch/torch.js/libTH/ccTH.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THAllocator.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THMath.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THBlas.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THDiskFile.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THFile.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THFilePrivate.h"
    "/Users/jpchen/jstorch/torch.js/libTH/build/THGeneral.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THGenerateAllTypes.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THGenerateFloatTypes.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THGenerateIntTypes.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THLapack.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THLogAdd.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THMemoryFile.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THRandom.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THStorage.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THTensorExtra.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THTensorApply.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THTensorDimApply.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THTensorMacros.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THVector.h"
    "/Users/jpchen/jstorch/torch.js/libTH/THAtomic.h"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/TH/generic" TYPE FILE FILES
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THBlas.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THBlas.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THLapack.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THLapack.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THStorage.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THStorage.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THStorageCopy.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THStorageCopy.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensor.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensor.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorExtraJS.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorExtraJS.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorConv.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorConv.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorCopy.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorCopy.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorLapack.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorLapack.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorMath.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorMath.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorRandom.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THTensorRandom.h"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THVectorDispatch.c"
    "/Users/jpchen/jstorch/torch.js/libTH/generic/THVector.h"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/share/cmake/TH" TYPE FILE FILES "/Users/jpchen/jstorch/torch.js/libTH/build/cmake-exports/THConfig.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "/Users/jpchen/jstorch/torch.js/libTH/build/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
