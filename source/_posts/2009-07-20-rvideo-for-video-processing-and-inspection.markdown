---
layout: post
title: RVideo for video processing and inspection
category: Ruby
hero_image: /images/heros/post-high.jpg
comments: true
author:
  name: José Costa
  email: jose@wyeworks.com
  twitter_handle: joseicosta
  github_handle:  joseicosta
  image:  /images/team/jose.jpg
  description: Cofounder & CEO at WyeWorks. Fitness aficionado. Home Barista wannabe.
published: true
---
At WyeWorks headquarters, every once in a while, we come across some project that needs a media edition/transcoding solution to build into. This was the case of our latest project in which we built a pretty simple interface with [Brightcove(Brightcove - The Leading Online Video Platform.)](http://www.brightcove.com/), a powerful video platform on which we may write something about it in our forthcoming posts, but it's not the point right now.

<!--more-->

Turns out to be that Brightcove recommends that files should be encoded using either H.264 or VP6. As usual, we ask ffmpeg for salvation when we need to transcode media files and this was not the exception. But we didn't want to transcode just every file nor make the choice based on the file's extension. We wanted a way to check the current file encoding.

Searches made at that time lead us to think that the usual way to get a media file encoding is by running:

{% codeblock %}
  ffmpeg -i <filename>
{% endcodeblock %}

which i must say that it's pretty ugly for me since that command it's supposed to be used for conversion and as far as i know it doesn't offer some flag to get only the file information.
In fact, that command returns an error (but still prints the information we need):

{% codeblock %}
  jose:~$ ffmpeg -i barsandtone.flv 
  FFmpeg version 0.5-svn17737+3:0.svn20090303-1ubuntu6, Copyright (c) 2000-2009 Fabrice Bellard, et al.
    configuration: --enable-gpl --enable-postproc --enable-swscale --enable-x11grab --extra-version=svn17737+3:0.svn20090303-1ubuntu6 --prefix=/usr --enable-avfilter --enable-avfilter-lavf --enable-libgsm --enable-libschroedinger --enable-libspeex --enable-libtheora --enable-libvorbis --enable-pthreads --disable-stripping --disable-vhook --enable-libdc1394 --disable-armv5te --disable-armv6 --disable-armv6t2 --disable-armvfp --disable-neon --disable-altivec --disable-vis --enable-shared --disable-static
    libavutil     49.15. 0 / 49.15. 0
    libavcodec    52.20. 0 / 52.20. 0
    libavformat   52.31. 0 / 52.31. 0
    libavdevice   52. 1. 0 / 52. 1. 0
    libavfilter    0. 4. 0 /  0. 4. 0
    libswscale     0. 7. 1 /  0. 7. 1
    libpostproc   51. 2. 0 / 51. 2. 0
    built on Apr 10 2009 23:18:41, gcc: 4.3.3
  Input #0, flv, from 'barsandtone.flv':
    Duration: 00:00:06.00, start: 0.000000, bitrate: 505 kb/s
      Stream #0.0: Video: *vp6f*, yuv420p, 360x288, 409 kb/s, 1k tbr, 1k tbn, 1k tbc
      Stream #0.1: Audio: mp3, 44100 Hz, stereo, s16, 96 kb/s
    **Must supply at least one output file**
{% endcodeblock %}

The information we need is the video codec (in this case vp6f) to determine if we need to transcode it.

Another thing to mention is that nothing that you see as the output there outputs to the stdout.
No rocket science needed but i was kind of lazy to parse this from scratch. Lucky for me, there was this not so new [rvideo(rvideo)](http://code.google.com/p/rvideo/) gem (still unknown for me) that made me save some precious time.

[RVideo(rvideo)](http://code.google.com/p/rvideo/) still relies in ffmpeg command and also it's internal work to get the information we need involves that same output parsing, you just don't have to do it yourself. 
After installation (not covered here, just check rvideo readme file), you can do things as shown below:

{% codeblock %}
  inspector = RVideo::Inspector.new(:file => file.path)
  inspector.video_codec
  => "vp6f"
  inspector.duration
  => 6000
  inspector.audio_codec
  => "mp3"
{% endcodeblock %}

We've just made a tiny introduction to inspection. I'm not covering video processing. Check [rvideo(rvideo)](http://code.google.com/p/rvideo/) for more details!
Enjoy!

