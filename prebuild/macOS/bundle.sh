build=build/Release

# remove the big artifacts we will not use.
rm -rf build/Release/.deps
rm -rf build/Release/obj.target

# Run macpack on each ABI-specific binary
for node_bin in build/Release/canvas-node-v*.node; do
  [ -f "$node_bin" ] || continue
  ~/Library/Python/*/bin/macpack "$node_bin" -d .
done

# Fallback for single-binary builds (v3/N-API)
if [ -f build/Release/canvas.node ]; then
  ~/Library/Python/*/bin/macpack build/Release/canvas.node -d .
fi
