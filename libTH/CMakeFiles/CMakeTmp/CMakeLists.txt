cmake_minimum_required(VERSION 3.7.2.0)
set(CMAKE_MODULE_PATH "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/cmake")
project(CMAKE_TRY_COMPILE C)
set(CMAKE_VERBOSE_MAKEFILE 1)
set(CMAKE_C_FLAGS "")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${COMPILE_DEFINITIONS}")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} ${EXE_LINKER_FLAGS}")
include_directories(${INCLUDE_DIRECTORIES})
set(CMAKE_SUPPRESS_REGENERATION 1)
link_directories(${LINK_DIRECTORIES})
cmake_policy(SET CMP0065 OLD)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp")
add_executable(cmTC_645a8 "/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp/src.c")
target_link_libraries(cmTC_645a8 ${LINK_LIBRARIES})
