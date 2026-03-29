build=build/Release

# remove the big artifacts we will not use.
rm -rf build/Release/.deps
rm -rf build/Release/obj.target

~/Library/Python/*/bin/macpack build/Release/canvas.node -d .
