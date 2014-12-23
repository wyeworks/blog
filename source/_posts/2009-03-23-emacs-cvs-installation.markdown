---
layout: post
title: Install Emacs 23 from CVS
category: Emacs
hero_image: /images/heros/post-high.jpg
comments: true
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle:  spastorino
  image:  /images/team/santiago.jpg
  description: WyeWorks Co-Founder, Ruby on Rails Core Team Member
published: true
---
This is the first of a set of posts talking about Emacs. In this case we are going to install Emacs from the CVS repositories on Unix based systems. Emacs has alternative mirrors repositories in Bazaar, Git, Mercurial and Arch.
You can check out the procedure and other information on [EmacsFromCVS](http://www.emacswiki.org/emacs/EmacsFromCVS)

<!--more-->

## Why emacs from CVS?

Because the current CVS version provides new exciting features like:

* [XftGnuEmacsYour](http://www.emacswiki.org/emacs-en/XftGnuEmacs) (With XFT support, Emacs will be able to use anti-aliased fonts in the X11)
* [MultiTTYSupport](http://www.emacswiki.org/emacs-en/MultiTTYSupport) (Use the multiple tty if you need one process that displays on tty and X at the same time)
* [UnicodeEncoding](http://www.emacswiki.org/emacs-en/UnicodeEncoding) (built-in Unicode support)

## Installation procedure

If you're going to compile it with the default options, you need the following list of libraries:

* [libXaw3d](ftp://ftp.x.org/contrib/widgets/Xaw3d/) for fancy 3D-style scroll bars
* [libxpm for XPM](ftp://ftp.x.org/contrib/libraries/) Get version 3.4k or later, which lets Emacs use its own color allocation functions.
* [libpng for PNG](ftp://ftp.simplesystems.org/pub/libpng/png/)
* [libz (for PNG)](http://www.zlib.net/)
* [libjpeg for JPEG](ftp://ftp.uu.net/graphics/jpeg/) Get version 6b -- 6a is reported to fail in Emacs.
* [libtiff for TIFF](http://www.libtiff.org/)
* [libgif for GIF](http://sourceforge.net/projects/giflib/)

But you can go without some libraries, check <code>./configure --help</code>, search for (<code>--without-LIB</code> options).
On GNU/Linux systems, these libraries should be available as packages. Check for the mentioned libraries plus dev, in debian the packages are called somethings like libgif-dev, libtiff-dev, and so on.

<pre><code>$ cvs -z3 -d:pserver:anonymous@cvs.savannah.gnu.org:/sources/emacs co emacs
santiago@debian:~$ ./configure --prefix=/home/santiago/bin/emacs
santiago@debian:~$ make
santiago@debian:~$ make install
</code></pre>

If you want to upgrade remember to do:
<pre><code>$ cvs update
santiago@debian:~$ make
santiago@debian:~$ make install
</code></pre>

I'm going to post more Emacs related posts talking about how to set up an Emacs enhanced for Ruby on Rails development.
