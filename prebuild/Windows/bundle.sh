# remove debug artifacts
rm -rf build/Release/obj
rm -f build/Release/canvas.exp
rm -f build/Release/canvas.iobj
rm -f build/Release/canvas.ipdb
rm -f build/Release/canvas.lib
rm -f build/Release/canvas.pdb

# Copy DLLs from installed ucrt64 packages, excluding build-only tools.
# binutils and tools are only needed for gendef/dlltool during preinstall.
EXCLUDE="mingw-w64-ucrt-x86_64-binutils|mingw-w64-ucrt-x86_64-tools"

pacman -Qq 2>/dev/null \
  | grep 'ucrt-x86_64' \
  | grep -Ev "$EXCLUDE" \
  | xargs pacman -Qlq 2>/dev/null \
  | grep '/ucrt64/bin/.*\.dll$' \
  | sort -u \
  | while read -r dll; do
    cp "$dll" build/Release/
  done

echo "Bundled DLLs: $(ls -1 build/Release/*.dll 2>/dev/null | wc -l)"
du -sh build/Release/
