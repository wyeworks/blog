---
layout: post
title: My Emacs for Rails
category: Emacs
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle:  spastorino
  image:  /images/team/santiago.jpg
published: true
---
I'd like to share with the community my emacs init file and a set of plugins to give a nicer experience on Ruby on Rails development, which you can checkout from [here](http://github.com/spastorino/my_emacs_for_rails/tree/master).
I have been using this environment under emacs 23, and it has not been tested on other emacs versions, so all feedback is welcome, if something goes wrong please feel free to contact me.

## What's in the package?

The package provides my customized Emacs init file and some plugins I found very useful to enhance Ruby on Rails development experience.

### Plugins

* anything
* auto-complete
* autotest
* [cedet](http://cedet.sourceforge.net/)
* color-theme
* [ecb](http://ecb.sourceforge.net/)
* find-recursive
* flymake
* javascript
* [nxhtml](http://ourcomments.org/Emacs/nXhtml/doc/nxhtml.html)
* [rcodetools](http://eigenclass.org/hiki.rb?rcodetools)
* rdebug
* redo
* ri-emacs
* [rinari](http://rinari.rubyforge.org/)
* ruby-block
* ruby-mode
* toggle
* yaml-mode
* [yasnippet](http://code.google.com/p/yasnippet/)
* [yasnippets-rails](http://github.com/eschulte/yasnippets-rails/tree/master)

## Installation

Before you can use some plugins you have to install a few packages:

To use rcodetools you need to install the rcodetools, gem with
<pre><code>sudo gem install rcodetools</code></pre>
To use autotest you need the ZenTest gem, install it with
<pre><code>sudo gem install ZenTest</code></pre>
On further post I'm going to explain how to set it up under the gnome environment using all the beauty that gnome-notifier has.

Checkout the package
<pre><code>git clone github.com/spastorino/my_emacs_for_rails</code></pre>
 and copy all the files under my_emacs_for_rails directory to ~/.emacs.d directory if it doesn't exist you have to create it.

## Screenshot

You can see here some screenshots to get a taste of the look and feel that this one has.

!http://blog.wyeworks.com/assets/2009/9/11/emacs-screenshot.png!:http://blog.wyeworks.com/assets/2009/9/11/emacs-screenshot-full.png
