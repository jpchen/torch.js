# Install script for directory: /Users/jpchen/torchjs/thlib

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
    "/Users/jpchen/torchjs/thlib/build/libmTH.0.dylib"
    "/Users/jpchen/torchjs/thlib/build/libmTH.dylib"
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
    "/Users/jpchen/torchjs/thlib/ccTH.h"
    "/Users/jpchen/torchjs/thlib/THAllocator.h"
    "/Users/jpchen/torchjs/thlib/THMath.h"
    "/Users/jpchen/torchjs/thlib/THBlas.h"
    "/Users/jpchen/torchjs/thlib/THDiskFile.h"
    "/Users/jpchen/torchjs/thlib/THFile.h"
    "/Users/jpchen/torchjs/thlib/THFilePrivate.h"
    "/Users/jpchen/torchjs/thlib/build/THGeneral.h"
    "/Users/jpchen/torchjs/thlib/THGenerateAllTypes.h"
    "/Users/jpchen/torchjs/thlib/THGenerateFloatTypes.h"
    "/Users/jpchen/torchjs/thlib/THGenerateIntTypes.h"
    "/Users/jpchen/torchjs/thlib/THLapack.h"
    "/Users/jpchen/torchjs/thlib/THLogAdd.h"
    "/Users/jpchen/torchjs/thlib/THMemoryFile.h"
    "/Users/jpchen/torchjs/thlib/THRandom.h"
    "/Users/jpchen/torchjs/thlib/THStorage.h"
    "/Users/jpchen/torchjs/thlib/THTensorExtra.h"
    "/Users/jpchen/torchjs/thlib/THTensorApply.h"
    "/Users/jpchen/torchjs/thlib/THTensorDimApply.h"
    "/Users/jpchen/torchjs/thlib/THTensorMacros.h"
    "/Users/jpchen/torchjs/thlib/THVector.h"
    "/Users/jpchen/torchjs/thlib/THAtomic.h"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/TH/generic" TYPE FILE FILES
    "/Users/jpchen/torchjs/thlib/generic/THBlas.c"
    "/Users/jpchen/torchjs/thlib/generic/THBlas.h"
    "/Users/jpchen/torchjs/thlib/generic/THLapack.c"
    "/Users/jpchen/torchjs/thlib/generic/THLapack.h"
    "/Users/jpchen/torchjs/thlib/generic/THStorage.c"
    "/Users/jpchen/torchjs/thlib/generic/THStorage.h"
    "/Users/jpchen/torchjs/thlib/generic/THStorageCopy.c"
    "/Users/jpchen/torchjs/thlib/generic/THStorageCopy.h"
    "/Users/jpchen/torchjs/thlib/generic/THTensor.c"
    "/Users/jpchen/torchjs/thlib/generic/THTensor.h"
    "/Users/jpchen/torchjs/thlib/generic/THTensorExtraJS.c"
    "/Users/jpchen/torchjs/thlib/generic/THTensorExtraJS.h"
    "/Users/jpchen/torchjs/thlib/generic/THTensorConv.c"
    "/Users/jpchen/torchjs/thlib/generic/THTensorConv.h"
    "/Users/jpchen/torchjs/thlib/generic/THTensorCopy.c"
    "/Users/jpchen/torchjs/thlib/generic/THTensorCopy.h"
    "/Users/jpchen/torchjs/thlib/generic/THTensorLapack.c"
    "/Users/jpchen/torchjs/thlib/generic/THTensorLapack.h"
    "/Users/jpchen/torchjs/thlib/generic/THTensorMath.c"
    "/Users/jpchen/torchjs/thlib/generic/THTensorMath.h"
    "/Users/jpchen/torchjs/thlib/generic/THTensorRandom.c"
    "/Users/jpchen/torchjs/thlib/generic/THTensorRandom.h"
    "/Users/jpchen/torchjs/thlib/generic/THVectorDispatch.c"
    "/Users/jpchen/torchjs/thlib/generic/THVector.h"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/share/cmake/TH" TYPE FILE FILES "/Users/jpchen/torchjs/thlib/build/cmake-exports/THConfig.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "/Users/jpchen/torchjs/thlib/build/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
