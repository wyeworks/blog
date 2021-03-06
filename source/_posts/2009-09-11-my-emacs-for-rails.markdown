---
layout: post
title: My Emacs for Rails
comments: true
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle:  spastorino
  image:  /images/team/santiago-pastorino.jpg
  description: WyeWorks Co-Founder, Ruby on Rails Core Team Member
published: true
---
I'd like to share with the community my emacs init file and a set of plugins to give a nicer experience on Ruby on Rails development, which you can checkout from [here](http://github.com/spastorino/my_emacs_for_rails).
I have been using this environment under emacs 23, and it has not been tested on other emacs versions, so all feedback is welcome, if something goes wrong please feel free to contact me.

<!--more-->

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
* [yasnippet](http://emacswiki.org/emacs/Yasnippet)
* [yasnippets-rails](http://github.com/eschulte/yasnippets-rails/)

## Installation

Before you can use some plugins you have to install a few packages:

To use rcodetools you need to install the rcodetools, gem with
{% codeblock %}sudo gem install rcodetools{% endcodeblock %}
To use autotest you need the ZenTest gem, install it with
{% codeblock %}sudo gem install ZenTest{% endcodeblock %}
On further post I'm going to explain how to set it up under the gnome environment using all the beauty that gnome-notifier has.

Checkout the package
{% codeblock %}git clone github.com/spastorino/my_emacs_for_rails{% endcodeblock %}
 and copy all the files under my_emacs_for_rails directory to ~/.emacs.d directory if it doesn't exist you have to create it.

## Screenshot

You can see here some screenshots to get a taste of the look and feel that this one has.
