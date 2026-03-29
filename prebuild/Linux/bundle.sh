set -ex

# ChatGPT gave me this. I'm doing the lazy thing instead of properly updating
# the dockerfile because I'm almost done with a zig cross build
sed -i '
  s|deb.debian.org/debian|archive.debian.org/debian|g;
  s|security.debian.org/debian-security|archive.debian.org/debian-security|g;
' /etc/apt/sources.list
apt-get -o Acquire::Check-Valid-Until=false update
# end ChatGPT

apt-get update
apt install -y patchelf pax-utils

# Use any .node binary to determine shared library dependencies (all ABI builds link the same libs)
FIRST_NODE=$(ls build/Release/canvas-node-v*.node 2>/dev/null | head -1 || echo "build/Release/canvas.node")
copies=$(lddtree -l "$FIRST_NODE" | sed -r -e '/^\/lib/d' -e '/\.node$/d');

# remove the big artifacts we will not use.
rm -r build/Release/.deps
rm -r build/Release/obj.target

for so in $copies; do
  cp $so build/Release
  # Set the run_path for all dependencies.
  patchelf --set-rpath '$ORIGIN' build/Release/$(basename $so)
done;

echo "Before strip:"
du -sh build/Release/

find "./build/Release" -type f \( -name "*.so*" -o -name "*.node" \) -exec strip --strip-unneeded {} \;

echo "After strip:"
du -sh build/Release/
