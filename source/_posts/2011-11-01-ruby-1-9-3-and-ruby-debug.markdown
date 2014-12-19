---
layout: post
title: Ruby 1.9.3 and ruby-debug
category: Ruby
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle:  spastorino
  image:  /images/team/santiago.jpg
  description: Description of self
published: true
---
As you probably know Ruby (MRI so brixen doesn't get mad at me :P) [1.9.3 was released](http://www.ruby-lang.org/en/news/2011/10/31/ruby-1-9-3-p0-is-released/.) I've been using 1.9.3 for a while now and as part of my RubyConf Uruguay talk I wanted to show ruby-debug. So my first attempt was:

<!--more-->

<pre><code>$ gem install ruby-debug19
Fetching: linecache19-0.5.12.gem (100%)
Building native extensions.  This could take a while...
Fetching: ruby-debug-base19-0.11.25.gem (100%)
Building native extensions.  This could take a while...
Fetching: ruby-debug19-0.11.6.gem (100%)
Successfully installed linecache19-0.5.12
Successfully installed ruby-debug-base19-0.11.25
Successfully installed ruby-debug19-0.11.6
3 gems installed</code></pre>

Then require 'ruby-debug' and booom!!

<pre><code>$ irb
irb(main):001:0> require 'ruby-debug'
LoadError: dlopen(/Users/santiago/.rbenv/versions/1.9.3/lib/ruby/gems/1.9.1/gems/ruby-debug-base19-0.11.25/lib/ruby_debug.bundle, 9): Symbol not found: _ruby_current_thread
  Referenced from: /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/gems/1.9.1/gems/ruby-debug-base19-0.11.25/lib/ruby_debug.bundle
  Expected in: flat namespace
 in /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/gems/1.9.1/gems/ruby-debug-base19-0.11.25/lib/ruby_debug.bundle - /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/gems/1.9.1/gems/ruby-debug-base19-0.11.25/lib/ruby_debug.bundle
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/1.9.1/rubygems/custom_require.rb:36:in `require'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/1.9.1/rubygems/custom_require.rb:36:in `require'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/gems/1.9.1/gems/ruby-debug-base19-0.11.25/lib/ruby-debug-base.rb:1:in `<top (required)>'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/1.9.1/rubygems/custom_require.rb:36:in `require'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/1.9.1/rubygems/custom_require.rb:36:in `require'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/gems/1.9.1/gems/ruby-debug19-0.11.6/cli/ruby-debug.rb:5:in `<top (required)>'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/1.9.1/rubygems/custom_require.rb:59:in `require'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/1.9.1/rubygems/custom_require.rb:59:in `rescue in require'
	from /Users/santiago/.rbenv/versions/1.9.3/lib/ruby/1.9.1/rubygems/custom_require.rb:35:in `require'
	from (irb):1
	from /Users/santiago/.rbenv/versions/1.9.3/bin/irb:12:in `<main>'</code></pre>

So after some research on the internet I found out that the author of ruby-debug had a fix for it which he considered unstable and didn't push it to rubygems.org yet. Since I prefer an unstable ruby-debug than a non working one :P, I gave it a try ...

First download linecache19-0.5.13.gem and ruby-debug-base19-0.11.26.gem from [http://rubyforge.org/frs/?group_id=8883](http://rubyforge.org/frs/?group_id=8883), then …

<pre><code>$ gem install linecache19-0.5.13.gem 
Building native extensions.  This could take a while...
Successfully installed linecache19-0.5.13
1 gem installed
$ gem install ruby-debug-base19-0.11.26.gem -- --with-ruby-include=/Users/santiago/.rbenv/source/ruby-1.9.3-p0  
Building native extensions.  This could take a while...
Successfully installed ruby-debug-base19-0.11.26
1 gem installed
$ irb
irb(main):001:0> require 'ruby-debug'
=> true</code></pre>

and voilá.

So while we wait for an official release, you can enjoy a working ruby-debug.
