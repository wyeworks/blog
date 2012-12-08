---
layout: post
title: Rails 4 links compilation
categories:
- ruby, rails
tags:
- ruby
- rails
- master
author: santiago.pastorino
published: true
---

I'm leaving here a curated compilation of interesting links where you will find information that is not very well known. There are pull requests, issues, commits, examples, posts, videos and more about Rails 4.

I'm also giving a shout out asking for improvements to this compilation. If you find something is missing or you have suggestions to make let me know by commenting in this post.

The Rails Guides are not always enough. When you don't find something in the guides or docs, you probably search for information on the internet or a blog post about the specific subject. But wouldn't it be better if you had all the related information together? This could also be a great starting point for a new Rails guide. 

So, I encourage everyone to help compiling more material about each new section of Rails 4 and then, by looking at all this compilation, start guides about specific topics. You can do that by directly pushing to [docrails](http://github.com/lifo/docrails), which has public access for everyone to push documentation changes only.

[![Rails 4 MindNode](/images/posts/Rails4-mini-4.png "Rails 4
MindNode")](/images/posts/Rails4-4.png)

## Overview

- [Ruby on Rails Guides: Rails 4.0 Release Notes](http://edgeguides.rubyonrails.org/4_0_release_notes.html)
- [Rails 4 in 30'](http://blog.wyeworks.com/2012/10/29/rails-4-in-30-minutes/)
- [Why should I care about Rails 4](http://vimeo.com/51898266)
- [Rails 4 and the Future of Web](http://confreaks.com/videos/1228-aloharuby2012-keynote-rails-4-and-the-future-of-web)
- [Rails 4 Whirlwind Tour](http://vimeo.com/51181496)
- [BostonRB: what to expect in Rails 4.0](http://bostonrb.org/presentations/what-to-expect-in-rails-40)
- [Rails 4 Countdown to 2013](http://blog.remarkablelabs.com/2012/11/rails-4-countdown-to-2013)

## Upgrade

- Ruby 1.9.3
	- [Commit](https://github.com/rails/rails/commit/4fa615a8661eb13d4bd8a7de4d839e9883ef26ec)
- New deprecation policy
	- [Weblog Post mentions deprecation policy](http://weblog.rubyonrails.org/2012/8/9/ann-rails-3-2-8-has-been-released/)
- vendor/plugins has gone
	- [Commit](https://github.com/rails/rails/commit/dad7fdc5734a3813246f238ac5760b2076932216)
- Moved to a plugin
	- Hash-based & Dynamic finder methods
		- [Gem](https://github.com/rails/activerecord-deprecated_finders)
	- Mass assignment in AR models
		- [Gem](https://github.com/rails/protected_attributes)
	- ActiveRecord::SessionStore
		- [Gem](https://github.com/rails/activerecord-session_store)
	- ActiveResource
		- [Gem](https://github.com/rails/activeresource)
		- [ActiveResource is dead, long live ActiveResource](http://yetimedia.tumblr.com/post/35233051627/activeresource-is-dead-long-live-activeresource)
	- Action Caching
		- [Gem](https://github.com/rails/actionpack-action_caching)
	- Page Caching
		- [Gem](https://github.com/rails/actionpack-page_caching)
	- Page and Action Caching
		- [Rails 4 Countdown to 2013 - Page and Action Caching Gem Extraction](http://blog.remarkablelabs.com/2012/12/page-caching-action-caching-gem-extraction-rails-4-countdown-to-2013)
	- New default test locations
		- [Pull Request](https://github.com/rails/rails/pull/7878)
	- Observers
		- [Gem](https://github.com/rails/rails-observers)
		- [Commit](https://github.com/rails/rails/commit/ccecab3ba950a288b61a516bf9b6962e384aae0b)
		- [Rails 4 Countdown to 2013 - Observers Gem Extraction](http://blog.remarkablelabs.com/2012/12/observers-gem-extraction-rails-4-countdown-to-2013)

## Active Support

- Queue API
	- [Commit](https://github.com/rails/rails/commit/adff4a706a5d7ad18ef05303461e1a0d848bd662)
- Notifiers start & finish
	- [Commits](https://github.com/rails/rails/compare/60736fe...c7847f1)

## Action Mailer

- Asynchronous Mailer
	- [Pull Request](https://github.com/rails/rails/pull/6839)

## Active Model

- ActiveModel::Model
	- [Plataforma: barebone models to use with actionpack in rails 4.0](http://blog.plataformatec.com.br/2012/03/barebone-models-to-use-with-actionpack-in-rails-4-0/)
	- [Commit](https://github.com/rails/rails/commit/3b822e91d1a6c4eab0064989bbd07aae3a6d0d08)

## Action Pack

- ActionController::Live
	- [Aaron Patterson's blog post: Is it Live](http://tenderlovemaking.com/2012/07/30/is-it-live.html)
	- [Why Rails 4 Live Streaming is a big deal](http://blog.phusion.nl/2012/08/03/why-rails-4-live-streaming-is-a-big-deal/)
	- [Commit](https://github.com/rails/rails/commit/af0a9f9eefaee3a8120cfd8d05cbc431af376da3)
- Strong parameters
	- [Gem](https://github.com/rails/strong_parameters)
	- [Parameters Security Tour](http://iconoclastlabs.com/cms/blog/posts/upgrading-to-rails-4-parameters-security-tour)
	- [Ruby on Rails Weblog: Strong parameters](http://weblog.rubyonrails.org/2012/3/21/strong-parameters/)
	- [Rails 4 Quick Look: Strong Parameters](http://rubysource.com/rails-4-quick-look-strong-parameters/)
	- [Pull Request](https://github.com/rails/rails/pull/7251)
	- [Railscast](http://railscasts.com/episodes/371-strong-parameters)
	- [Rails 4 Countdown to 2013 - Strong Parameters](http://blog.remarkablelabs.com/2012/12/strong-parameters-rails-4-countdown-to-2013)
- Turbolinks
	- [Gem](https://github.com/rails/turbolinks)
	- [Introducing Turbolinks for Rails 4.0 geekmonkey](http://geekmonkey.org/articles/28-introducing-turbolinks-for-rails-4-0)
	- [Turbolinks benchmarks from Steve Klabnik](http://blog.steveklabnik.com/posts/2012-09-27-seriously--numbers--use-them-)
	- [Railscast](http://railscasts.com/episodes/390-turbolinks)
- Russian Doll Caching
	- [How key-based cache expiration works](http://37signals.com/svn/posts/3113-how-key-based-cache-expiration-works)
	- [Evening on Backbone.js/ Q&A with dhh](http://www.youtube.com/watch?v=FkLVl3gpJP4#t=33m30s)
- Cache Digests
	- [Gem](https://github.com/rails/cache_digests)
	- [Commit](https://github.com/rails/rails/commit/502d5e24e28b3634910495d0fb71cb20b1426aee)
	- [Railscast](http://railscasts.com/episodes/387-cache-digests)
- Declarative ETags
	- [Gem](https://github.com/rails/etagger)
	- [Commit](https://github.com/rails/rails/commit/ed5c938fa36995f06d4917d9543ba78ed506bb8d)
	- [Rails 4 Countdown to 2013 - Generate Controller-Wide ETags](http://blog.remarkablelabs.com/2012/12/generate-controller-wide-etags-rails-4-countdown-to-2013)
- Decouple Action Pack and Action View
	- [Pull Request](https://github.com/rails/rails/pull/7356)
- Asset Pipelining
	- [Moving forward with the Rails asset pipeline](http://yetimedia.tumblr.com/post/33320732456/moving-forward-with-the-rails-asset-pipeline)
	- sprockets-rails
		- [Gem](https://github.com/rails/sprockets-rails)
		- [Extraction](https://github.com/rails/rails/pull/5409)
- Replace memcache-client with dalli
	- [Pull Request](https://github.com/rails/rails/pull/6903)
- Routing Concerns
	- [Gem](https://github.com/rails/routing_concerns)
	- [Commit](https://github.com/rails/rails/commit/0dd24728a088fcb4ae616bb5d62734aca5276b1b)
- PATCH verb
	- [Weblog post](http://weblog.rubyonrails.org/2012/2/25/edge-rails-patch-is-the-new-primary-http-method-for-updates/)
	- [Rails issue: use PATCH verb instead of PUT](https://github.com/rails/rails/issues/348)
	- [Rails 4 Countdown to 2013 - HTTP PATCH Verb](http://blog.remarkablelabs.com/2012/12/http-patch-verb-rails-4-countdown-to-2013)
- Helpers
	- [HTML5 tag helpers - Pull Request](https://github.com/rails/rails/pull/6359)
	- [Rails 4 Countdown to 2013 - Collection Form Helpers](http://blog.remarkablelabs.com/2012/12/collection-form-helpers-rails-4-countdown-to-2013)

## Active Record

- MySQL strict mode by default
	- [Pull Request](https://github.com/rails/rails/pull/6069)
- Support for array datatype in PostgreSQL
	- [Rails 4.0 sneak peek: PostgreSQL array support](http://reefpoints.dockyard.com/ruby/2012/09/18/rails-4-sneak-peek-postgresql-array-support.html)
	- [Pull Request](https://github.com/rails/rails/pull/7547)
- Support for MACADDR, INET, CIDR datatypes in PostgreSQL
	- [Rails 4.0 sneak peek: PostgreSQL MACADDR, INET, CIDR support](http://reefpoints.dockyard.com/ruby/2012/05/18/rails-4-sneak-peek-expanded-activerecord-support-for-postgresql-datatype.html)
- Support for specifying transaction isolation level
	- [Commit](https://github.com/rails/rails/commit/392eeecc11a291e406db927a18b75f41b2658253)
- Schema cache dump
	- [Pull Request](https://github.com/rails/rails/pull/5162)
- ActiveRecord::Relation bang methods
	- [Commit](https://github.com/rails/rails/commit/8c2c60511beaad05a218e73c4918ab89fb1804f0)
- ActiveRecord::Base.all returns a Relation
	- [Commit](https://github.com/rails/rails/commit/6a81ccd69d96f36f4322ef927191ab5a35e68d68)
- Relation#find_or_create_by and friends
	- [Commit](https://github.com/rails/rails/commit/eb72e62c3042c0df989d951b1d12291395ebdb8e)
- CollectionProxy#scope
	- [Commit](https://github.com/rails/rails/commit/0e1cafcbc4d67854faf35e489571bc30f5e2ac14)
- Support for partial inserts
	- [Commit](https://github.com/rails/rails/commit/144e8691cbfb8bba77f18cfe68d5e7fd48887f5e)
- Relation.where with no args can be chained with not
	- [Pull Request](https://github.com/rails/rails/pull/8332)
	- [Revert of like and not_like](https://github.com/rails/rails/commit/8d02afeaee8993bd0fde69687fdd9bf30921e805)

## Railties

- Threadsafe on by default
	- [Aaron Patterson's blog post](http://tenderlovemaking.com/2012/06/18/removing-config-threadsafe.html)
	- [Discusion of Tony Arcieri's Pull Request](https://github.com/rails/rails/pull/6685)
	- [Improve eager load on Rails: Pull Request](http://github.com/rails/rails/pull/7225)
	- [Railscast](http://railscasts.com/episodes/365-thread-safety)

## Security

- Default headers
	- [Security Guide's default headers](http://edgeguides.rubyonrails.org/security.html#default-headers)
- match doesn't catch all
	- [Commit](https://github.com/rails/rails/commit/56cdc81c08b1847c5c1f699810a8c3b9ac3715a6)
- Set escaping HTML in JSON encoding to true by default
	- [Pull Request](https://github.com/rails/rails/pull/6287)
- Add ActiveSupport::KeyGenerator as a simple wrapper around PBKDF2
	- [Pull Request](https://github.com/rails/rails/pull/6952)
- Encrypted Cookies + Sign using Derived Keys
	- [Pull Request](https://github.com/rails/rails/pull/8112)

Please send me more information about Rails 4 if you find that I'm missing something in this post.

P.D.: Thanks to Nikolay Petrachkov who gave me a starting point for building this list and to Guillermo Iguaran who contributed reviewing and sharing some links too.
