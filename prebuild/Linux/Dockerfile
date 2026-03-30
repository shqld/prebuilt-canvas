FROM debian:bookworm

RUN apt-get update && apt-get -y install \
  curl git cmake make gcc g++ nasm wget gperf bzip2 \
  meson pkg-config python3 python3-pip \
  uuid-dev perl libxml-parser-perl libffi-dev zlib1g-dev

RUN bash -c 'cd; curl -LO https://download.sourceforge.net/giflib/giflib-5.2.1.tar.gz; tar -xvf giflib-5.2.1.tar.gz; cd giflib-5.2.1; make -j$(nproc); make install'
RUN bash -c 'cd; curl -LO https://download.sourceforge.net/libpng/libpng-1.6.37.tar.gz; tar -xvf libpng-1.6.37.tar.gz; cd libpng-1.6.37; ./configure; make -j$(nproc); make install'
RUN bash -c 'cd; curl -LO https://github.com/libjpeg-turbo/libjpeg-turbo/archive/2.0.6.tar.gz; tar -xvf 2.0.6.tar.gz; cd libjpeg-turbo-2.0.6; mkdir b; cd b; cmake -G"Unix Makefiles" -DCMAKE_INSTALL_PREFIX=/usr/local ..; make -j$(nproc); make install'
RUN bash -c 'cd; curl -LO https://downloads.sourceforge.net/project/pcre/pcre/8.44/pcre-8.44.tar.bz2; tar -xvf pcre-8.44.tar.bz2; cd pcre-8.44; ./configure --enable-pcre16 --enable-pcre32 --enable-utf --enable-unicode-properties; make -j$(nproc); make install'
RUN ldconfig
RUN bash -c 'cd; curl -LO https://download.gnome.org/sources/glib/2.74/glib-2.74.6.tar.xz; tar -xvf glib-2.74.6.tar.xz; cd glib-2.74.6; meson _build; cd _build; ninja; ninja install'
RUN ldconfig
RUN bash -c 'cd; curl -LO https://download.sourceforge.net/freetype/freetype-2.10.4.tar.gz; tar -xvf freetype-2.10.4.tar.gz; cd freetype-2.10.4; ./configure; make -j$(nproc); make install'
RUN bash -c 'cd; curl -LO https://github.com/harfbuzz/harfbuzz/releases/download/2.7.4/harfbuzz-2.7.4.tar.xz; tar -xvf harfbuzz-2.7.4.tar.xz; cd harfbuzz-2.7.4; ./configure; make -j$(nproc); make install'
RUN bash -c 'cd; curl -LO https://github.com/libexpat/libexpat/releases/download/R_2_2_10/expat-2.2.10.tar.gz; tar -xvf expat-2.2.10.tar.gz; cd expat-2.2.10; ./configure; make -j$(nproc); make install'
RUN ldconfig
RUN bash -c 'cd; curl -O https://www.freedesktop.org/software/fontconfig/release/fontconfig-2.13.1.tar.bz2; tar -xvf fontconfig-2.13.1.tar.bz2; cd fontconfig-2.13.1; ./configure --enable-static --sysconfdir=/etc --localstatedir=/var; make -j$(nproc); make install'
RUN bash -c 'cd; curl -O https://www.cairographics.org/releases/pixman-0.40.0.tar.gz; tar -xvf pixman-0.40.0.tar.gz; cd pixman-0.40.0; ./configure; make -j$(nproc); make install'
RUN bash -c 'cd; curl -O https://cairographics.org/releases/cairo-1.16.0.tar.xz; tar -xvf cairo-1.16.0.tar.xz; cd cairo-1.16.0; ./configure; make -j$(nproc); make install'
RUN bash -c 'cd; curl -LO https://github.com/fribidi/fribidi/releases/download/v1.0.10/fribidi-1.0.10.tar.xz; tar -xvf fribidi-1.0.10.tar.xz; cd fribidi-1.0.10; ./configure; make -j$(nproc); make install'
RUN bash -c 'cd; curl -LO https://download.gnome.org/sources/pango/1.48/pango-1.48.0.tar.xz; tar -xvf pango-1.48.0.tar.xz; cd pango-1.48.0; meson -Dharfbuzz:docs=disabled -Dgtk_doc=false _build; cd _build; ninja; ninja install'
RUN ldconfig

# librsvg
RUN bash -c 'curl https://sh.rustup.rs -sSf | sh -s -- -y'
RUN bash -c 'curl -LO https://download.gnome.org/sources/libxml2/2.9/libxml2-2.9.10.tar.xz; tar -xvf libxml2-2.9.10.tar.xz; cd libxml2-2.9.10; ./configure --without-python; make -j$(nproc); make install'
RUN bash -c 'curl -O https://ftp.gnu.org/pub/gnu/gettext/gettext-0.21.tar.gz; tar -xvf gettext-0.21.tar.gz; cd gettext-0.21; ./configure; make -j$(nproc); make install'
RUN ldconfig
RUN bash -c 'curl -LO https://launchpad.net/intltool/trunk/0.51.0/+download/intltool-0.51.0.tar.gz; tar -xvf intltool-0.51.0.tar.gz; cd intltool-0.51.0; ./configure; make -j$(nproc); make install'
RUN bash -c 'curl -O https://people.freedesktop.org/~hadess/shared-mime-info-1.8.tar.xz; tar -xvf shared-mime-info-1.8.tar.xz; cd shared-mime-info-1.8; ./configure; make -j$(nproc); make install'
RUN bash -c 'curl -LO https://download.gnome.org/sources/gdk-pixbuf/2.42/gdk-pixbuf-2.42.2.tar.xz; tar -xvf gdk-pixbuf-2.42.2.tar.xz; cd gdk-pixbuf-2.42.2; meson _build; cd _build; ninja install'
RUN ldconfig
RUN bash -c 'curl -LO https://download.gnome.org/sources/libcroco/0.6/libcroco-0.6.13.tar.xz; tar -xvf libcroco-0.6.13.tar.xz; cd libcroco-0.6.13; ./configure; make -j$(nproc); make install'
RUN bash -c 'cd; . .cargo/env; curl -LO https://download.gnome.org/sources/librsvg/2.56/librsvg-2.56.4.tar.xz; tar -xvf librsvg-2.56.4.tar.xz; cd librsvg-2.56.4; ./configure --enable-introspection=no; make -j$(nproc); make install'
RUN ldconfig
