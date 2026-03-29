# remove debug artifacts
rm -rf build/Release/obj
rm -f build/Release/canvas.exp
rm -f build/Release/canvas.iobj
rm -f build/Release/canvas.ipdb
rm -f build/Release/canvas.lib
rm -f build/Release/canvas.pdb

# Copy DLLs from all installed ucrt64 packages (includes transitive deps
# that pacman resolved during preinstall.sh).
pacman -Qq 2>/dev/null \
  | grep 'ucrt-x86_64' \
  | xargs pacman -Qlq 2>/dev/null \
  | grep '/ucrt64/bin/.*\.dll$' \
  | sort -u \
  | while read -r dll; do
    cp "$dll" build/Release/
  done

echo "Bundled DLLs: $(ls -1 build/Release/*.dll 2>/dev/null | wc -l)"
du -sh build/Release/
