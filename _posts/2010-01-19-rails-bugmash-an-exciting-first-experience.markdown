---
layout: post
title: Rails Bugmash an exciting first experience
categories:
- ruby
tags:
- bugmash
- rails
author: santiago.pastorino
published: true
date: 2010-01-19 20:10:00.000000000 -02:00
---
As many of you must know, last weekend a [Railsbridge Bugmash](http://bugmash.com) was celebrated, and I had the honor to be part of it for the first time.
For those who are not aware about what this is, it's a virtual event that takes place on irc.freenode.net at #railsbridge channel.
The general idea of these events is to work on the Rails Core, taking a look at the [Rails Issue Tracker](https://rails.lighthouseapp.com/projects/8994-ruby-on-rails/overview.) However, given that Rails 3 is about to see the light, this opportunity was intended to deeply test it looking for:

  * Fix a known issue
  * Report a bug
  * Make sure your favorite gem or plugin still works. If not, fork it and make it so.
  * Write a blog post about a certain component
  * Write some documentation
  * Get an app up and running and document what you had to do to upgrade.
  * Create a screencast

Each accepted contribution or patch done by a participant, gives him chances to win one of several [prizes](http://bugmash.com/sponsors), the more contributions the more chances you have to win. For further details check out the [Railsbridge Bugmash Guide](http://railsbridge.org/BugMashGuide.pdf) and the [RailsBridge Wiki](http://wiki.railsbridge.org.)

Many bugs were fixed during the event, some [plugins and gems were tested](http://wiki.rubyonrails.org/rails/version3/plugins_and_gems), really interesting discussions took place (specially regarding [generators](http://guides.rails.info/generators.html)) and some other articles were made. To mention some:

  * [Making Generators for Rails 3 with Thor](http://caffeinedd.com/guides/331-making-generators-for-rails-3-with-thor)
  * [Getting Started with the Rails 3 Bugmash](http://blog.envylabs.com/2010/01/getting-started-with-the-rails-3-bugmash)
  * [Getting Rails 3 (pre) up on OSX](http://jamesarosen.com/post/339319063)
  * [Rails 3 and Passenger](http://cakebaker.42dh.com/2010/01/17/rails-3-and-passenger)
  * [Upgrading an Application to Rails 3 - Part 1](http://caffeinedd.com/guides/348-upgrading-to-rails-3)
  * [Customizing your scaffold template become easier in Rails3](http://zigzag.github.com/2010/01/18/customizing-your-scaffold-template-become-easier-in-rails3.html)
  * [Let your SQL Growl in Rails 3](http://hasmanyquestions.wordpress.com/2010/01/17/let-your-sql-growl-in-rails-3)
  * [Rails Bugmash 2010](http://blog.trydionel.com/2010/01/16/rails-bugmash-2010)
  * [migrating a rails app from 2.x to 3.0](http://www.madcowley.com/madcode/?p=12)
  * [Notes from Rails 3 bugmash](http://blazingcloud.net/2010/01/17/notes-from-rails-3-bugmash)
  * [Notes from the field upgrading to Rails 3](http://rails3.community-tracker.com/permalinks/5/notes-from-the-field-upgrading-to-rails-3)

And then Jose Valim, motivated by the posts done regarding rails 3 generators, published one himself called [Discovering Rails 3 Generators](http://blog.plataformatec.com.br/2010/01/discovering-rails-3-generators)

This was my first participation and it was a bloody great experience. During the event I was specially devoted to search bugs on Rails 3 and try to patch them. I managed myself to find 4 code bugs and 1 documentation bug, proposing a solution for all of them. One of them was not approved though, for there was a bigger problem that required José Valim's intervention, the 3 other patches were approved.

I would also want to highlight the gigantic work done by the organizers, the core team members, and also to all the participants. I strongly valued the support [José Valim](http://twitter.com/josevalim), [Pratik Naik](http://twitter.com/lifo) and [Michael Koziarski](http://twitter.com/nzkoz) gave me. They were a hell of a help when trying to find solutions for the bugs. Would also want to thank [Ryan Bigg](http://twitter.com/ryanbigg) for his cooperation, and specially to [Sam Elliott](http://twitter.com/lenary), an incredible 18 year old guy with a great future ahead.
Besides working together with Ryan and Sam, we kept a really nice chat during almost the entire bugmash. The awesome will to help at #railsbridge really overwhelmed me, where everybody was willing to help each other, something that makes it so much easier for the ones starting to contribute to Rails.

I would also want to congrat and thank all the participants for trying to make Rails better. So don't hesitate to join the next time, it's not as hard as I expected it to be and you would definitely not regret it. Now I'm really motivated to help others so I'm going to join to [Rails Mentors](http://www.railsmentors.org) on [RailsBridge](http://www.railsbridge.com) to give back the good things I received during this experience.
