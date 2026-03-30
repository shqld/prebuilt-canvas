#!/bin/bash
set -x

# Debian 10 (buster) repos are archived
sed -i '
  s|deb.debian.org/debian|archive.debian.org/debian|g;
  s|security.debian.org/debian-security|archive.debian.org/debian-security|g;
' /etc/apt/sources.list 2>/dev/null || true
apt-get -o Acquire::Check-Valid-Until=false update
apt install -y patchelf pax-utils

# Use any .node binary to determine shared library dependencies
FIRST_NODE=$(ls build/Release/canvas-node-v*.node 2>/dev/null | head -1)
[ -z "$FIRST_NODE" ] && FIRST_NODE="build/Release/canvas.node"

# Filter out system libs. Debian 10 image puts source-built libs in /usr/local/lib.
copies=$(lddtree -l "$FIRST_NODE" | sed -r -e '/^\/lib/d' -e '/\.node$/d')

# remove build artifacts
rm -rf build/Release/.deps
rm -rf build/Release/obj.target

for so in $copies; do
  cp "$so" build/Release/
  patchelf --set-rpath '$ORIGIN' "build/Release/$(basename $so)"
done

# Set rpath on all .node binaries
for node_bin in build/Release/canvas-node-v*.node build/Release/canvas.node; do
  [ -f "$node_bin" ] || continue
  patchelf --set-rpath '$ORIGIN' "$node_bin"
done

echo "Before strip:"
du -sh build/Release/

find "./build/Release" -type f \( -name "*.so*" -o -name "*.node" \) -exec strip --strip-unneeded {} \;

echo "After strip:"
du -sh build/Release/
