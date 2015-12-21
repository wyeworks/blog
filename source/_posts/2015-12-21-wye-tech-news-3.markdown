---
layout: post
title: "Wye Tech News #3"
category:
comments: true
author:
  name: Jorge Bejar
  email: jorge@wyeworks.com
  twitter_handle: jmbejar
  github_handle:  jmbejar
  image:  /images/team/jorge-bejar.jpg
  description: Software Engineer at Wyeworks. Ruby on Rails developer.
---

Hey! It's Monday! You know what that means? It's time for a new issue of our weekly compilation of interesting news and articles about Ruby, Rails, JavaScript and web development related stuff.

<!--more-->

**Ruby CVE-2015-7551: Unsafe tainted string usage in Fiddle and DL**<br/>
https://www.ruby-lang.org/en/news/2015/12/16/unsafe-tainted-string-usage-in-fiddle-and-dl-cve-2015-7551/<br/>
There is an unsafe tainted string usage vulnerability in Fiddle and DL. This vulnerability has been assigned the CVE identifier CVE-2015-7551.

Ruby 2.2.4, Ruby 2.1.8 and Ruby 2.0.0-p648 were released including a security fix for Fiddle extension.<br/>
https://www.ruby-lang.org/en/news/2015/12/16/ruby-2-2-4-released/<br/>
https://www.ruby-lang.org/en/news/2015/12/16/ruby-2-1-8-released/<br/>
https://www.ruby-lang.org/en/news/2015/12/16/ruby-2-0-0-p648-released/

**Rails 5.0.0.beta1: Action Cable, API mode, Rails command**<br/>
http://weblog.rubyonrails.org/2015/12/18/Rails-5-0-beta1/<br/>
The first beta release of this new major version of Rails.

In addition, you might be interested in upgrading a Rails app to Rails 5:<br/>
http://edgeguides.rubyonrails.org/upgrading_ruby_on_rails.html#upgrading-from-rails-4-2-to-rails-5-0

**Rails 5: Action Cable demo**<br/>
https://www.youtube.com/watch?v=n0WUjGkDFS0<br/>
A quick demo of how to build a Rails 5 simple chat application using Action Cable.

**Rails Attributes API**<br/>
https://github.com/rails/rails/blob/8c752c7ac739d5a86d4136ab1e9d0142c4041e58/activerecord/lib/active_record/attributes.rb<br/>
A new `attribute` class method is available in Rails 5 models, allowing you to easily define a relationship between the model and a non-Active Record type.

**ApplicationRecord**<br/>
https://github.com/rails/rails/pull/22567<br/>
`ApplicationRecord` model superclass in Rails 5.

**ActiveRecord::Relation#or**<br/>
https://github.com/rails/rails/pull/16052<br/>
`ActiveRecord::Relation` has a new `#or` method in Rails 5.

**New Command Router**<br/>
https://github.com/rails/rails/issues/18878<br/>
Starting in Rails 5, many of these old `rake` commands can be run with `rails` instead.

**Inspect network traffic in Capybara with Poltergeist**<br/>
https://medium.com/raise-coffee/inspect-network-traffic-in-capybara-with-poltergeist-16363ec8ecf4<br/>
A way to see the network traffic (as you would see in the Network-Tab of your browser) using the Poltergeist driver in your Capybara tests.

**Avoiding "Call Super" with Callbacks**<br/>
http://weblog.jamisbuck.org/2015/12/19/avoiding-call-super-with-callbacks.html<br/>
How to use ActiveSupport::Callbacks to avoid the Call Super anti-pattern.

**Ruby Can Be Faster with a Bit of Rust**<br/>
http://www.sitepoint.com/ruby-can-be-faster-with-a-bit-of-rust/<br/>
An introduction to Rust for Rubyists, showing how to write a dynamic library to allow Ruby to consume Rust, making Ruby faster when it's done right.

**Getting started with Distributed Ruby (DRb)**<br/>
http://nithinbekal.com/posts/distributed-ruby/<br/>
The Ruby stdlib contains a little known library called `dRuby`, which allows multiple Ruby processes to talk to each other over the network.

**Introducing Background Sync**<br/>
https://developers.google.com/web/updates/2015/12/background-sync?hl=en<br/>
Background sync is a new web API that lets you defer actions until the user has stable connectivity. This is useful for ensuring that whatever the user wants to send, is actually sent.

**Compiling to WebAssembly: It's Happening!**<br/>
https://hacks.mozilla.org/2015/12/compiling-to-webassembly-its-happening/<br/>
WebAssembly is a new binary format for compilation to the web that's in the process of being designed and implemented.

**V8 Engine's Random Number Algorithm Improved**<br/>
http://v8project.blogspot.com.uy/2015/12/theres-mathrandom-and-then-theres.html<br/>
`Math.random()` was reimplemented based on an algorithm called `xorshift128+`.

