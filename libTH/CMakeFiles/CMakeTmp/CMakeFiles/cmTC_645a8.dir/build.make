# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.7

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Produce verbose output by default.
VERBOSE = 1

# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/Cellar/cmake/3.7.2/bin/cmake

# The command to remove a file.
RM = /usr/local/Cellar/cmake/3.7.2/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp

# Include any dependencies generated for this target.
include CMakeFiles/cmTC_645a8.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/cmTC_645a8.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/cmTC_645a8.dir/flags.make

CMakeFiles/cmTC_645a8.dir/src.c.o: CMakeFiles/cmTC_645a8.dir/flags.make
CMakeFiles/cmTC_645a8.dir/src.c.o: src.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --progress-dir=/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building C object CMakeFiles/cmTC_645a8.dir/src.c.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc  $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/cmTC_645a8.dir/src.c.o   -c /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp/src.c

CMakeFiles/cmTC_645a8.dir/src.c.i: cmake_force
	@echo "Preprocessing C source to CMakeFiles/cmTC_645a8.dir/src.c.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc  $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp/src.c > CMakeFiles/cmTC_645a8.dir/src.c.i

CMakeFiles/cmTC_645a8.dir/src.c.s: cmake_force
	@echo "Compiling C source to assembly CMakeFiles/cmTC_645a8.dir/src.c.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc  $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp/src.c -o CMakeFiles/cmTC_645a8.dir/src.c.s

CMakeFiles/cmTC_645a8.dir/src.c.o.requires:

.PHONY : CMakeFiles/cmTC_645a8.dir/src.c.o.requires

CMakeFiles/cmTC_645a8.dir/src.c.o.provides: CMakeFiles/cmTC_645a8.dir/src.c.o.requires
	$(MAKE) -f CMakeFiles/cmTC_645a8.dir/build.make CMakeFiles/cmTC_645a8.dir/src.c.o.provides.build
.PHONY : CMakeFiles/cmTC_645a8.dir/src.c.o.provides

CMakeFiles/cmTC_645a8.dir/src.c.o.provides.build: CMakeFiles/cmTC_645a8.dir/src.c.o


# Object files for target cmTC_645a8
cmTC_645a8_OBJECTS = \
"CMakeFiles/cmTC_645a8.dir/src.c.o"

# External object files for target cmTC_645a8
cmTC_645a8_EXTERNAL_OBJECTS =

cmTC_645a8: CMakeFiles/cmTC_645a8.dir/src.c.o
cmTC_645a8: CMakeFiles/cmTC_645a8.dir/build.make
cmTC_645a8: CMakeFiles/cmTC_645a8.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --progress-dir=/Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking C executable cmTC_645a8"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/cmTC_645a8.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/cmTC_645a8.dir/build: cmTC_645a8

.PHONY : CMakeFiles/cmTC_645a8.dir/build

CMakeFiles/cmTC_645a8.dir/requires: CMakeFiles/cmTC_645a8.dir/src.c.o.requires

.PHONY : CMakeFiles/cmTC_645a8.dir/requires

CMakeFiles/cmTC_645a8.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/cmTC_645a8.dir/cmake_clean.cmake
.PHONY : CMakeFiles/cmTC_645a8.dir/clean

CMakeFiles/cmTC_645a8.dir/depend:
	cd /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp /Volumes/256GHD/Work/paultorchjs/torch.js/thlib/CMakeFiles/CMakeTmp/CMakeFiles/cmTC_645a8.dir/DependInfo.cmake
.PHONY : CMakeFiles/cmTC_645a8.dir/depend
