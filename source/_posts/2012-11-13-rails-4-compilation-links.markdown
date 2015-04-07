---
layout: post
title: Rails 4 links compilation
hero_image: /blog/images/heros/post-high.jpg
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

I'm leaving here a curated compilation of interesting links where you will find information that is not very well known. There are pull requests, issues, commits, examples, posts, videos and more about Rails 4.

<!--more-->

I'm also giving a shout out asking for improvements to this compilation. If you find something is missing or you have suggestions to make let me know by commenting in this post.

The Rails Guides are not always enough. When you don't find something in the guides or docs, you probably search for information on the internet or a blog post about the specific subject. But wouldn't it be better if you had all the related information together? This could also be a great starting point for a new Rails guide. 

So, I encourage everyone to help compiling more material about each new section of Rails 4 and then, by looking at all this compilation, start guides about specific topics. You can do that by directly pushing to [docrails](http://github.com/rails/docrails), which has public access for everyone to push documentation changes only.

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
	- [Rails 4 Countdown to 2013 - Rails 4 requires at least Ruby 1.9.3](http://blog.remarkablelabs.com/2012/12/rails-4-requires-at-least-ruby-1-9-3-rails-4-countdown-to-2013)
- New deprecation policy
	- [Weblog Post mentions deprecation policy](http://weblog.rubyonrails.org/2012/8/9/ann-rails-3-2-8-has-been-released/)
- vendor/plugins has gone
	- [Commit](https://github.com/rails/rails/commit/dad7fdc5734a3813246f238ac5760b2076932216)
	- [Rails 4 Countdown to 2013 - Rails::Plugin reaches end of life](http://blog.remarkablelabs.com/2012/12/rails-plugin-reaches-end-of-life-rails-4-countdown-to-2013)
- Moved to a plugin
	- Hash-based & Dynamic finder methods
		- [Gem](https://github.com/rails/activerecord-deprecated_finders)
	- Mass assignment in AR models
		- [Gem](https://github.com/rails/protected_attributes)
	- ActiveRecord::SessionStore
		- [Gem](https://github.com/rails/activerecord-session_store)
		- [Commit](https://github.com/rails/rails/commit/0ffe19056c8e8b2f9ae9d487b896cad2ce9387ad)
		- [Rails 4 Countdown to 2013 - ActiveRecord::SessionStore Gem Extraction](http://blog.remarkablelabs.com/2012/12/activerecord-sessionstore-gem-extraction-rails-4-countdown-to-2013)
	- ActiveResource
		- [Gem](https://github.com/rails/activeresource)
		- [ActiveResource is dead, long live ActiveResource](http://yetimedia.tumblr.com/post/35233051627/activeresource-is-dead-long-live-activeresource)
		- [Rails 4 Countdown to 2013 - ActiveResource Gem Extraction](http://blog.remarkablelabs.com/2012/12/activeresource-gem-extraction-rails-4-countdown-to-2013)
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

- Queue API (NOTE: This was reverted and will be included in Rails 4.1)
	- [Commit](https://github.com/rails/rails/commit/adff4a706a5d7ad18ef05303461e1a0d848bd662)
	- [Rails 4 Countdown to 2013 - Rails.queue](http://blog.remarkablelabs.com/2012/12/rails-queue-rails-4-countdown-to-2013)
- Notifiers start & finish
	- [Commits](https://github.com/rails/rails/compare/60736fe...c7847f1)
- Dalli replaces memcache-client
	- [Rails 4 Countdown to 2013 - Dalli replaces memcache-client](http://blog.remarkablelabs.com/2012/12/dalli-replaces-memcache-client-rails-4-countdown-to-2013)

## Action Mailer

- Asynchronous Mailer (NOTE: This was reverted and will be included in Rails 4.1)
	- [Pull Request](https://github.com/rails/rails/pull/6839)
	- [Rails 4 Countdown to 2013 - Asynchronous Action Mailer](http://blog.remarkablelabs.com/2012/12/asynchronous-action-mailer-rails-4-countdown-to-2013)

## Active Model

- ActiveModel::Model
	- [Plataforma: barebone models to use with actionpack in rails 4.0](http://blog.plataformatec.com.br/2012/03/barebone-models-to-use-with-actionpack-in-rails-4-0/)
	- [Commit](https://github.com/rails/rails/commit/3b822e91d1a6c4eab0064989bbd07aae3a6d0d08)
	- [Rails 4 Countdown to 2013 - ActiveModel::Model](http://blog.remarkablelabs.com/2012/12/activemodel-model-rails-4-countdown-to-2013)
- ActiveModel Validator
	- [Rails 4 Countdown to 2013 - ActiveModel Absence Validator](http://blog.remarkablelabs.com/2012/12/activemodel-absence-validator-rails-4-countdown-to-2013)

## Action Pack

- ActionController::Live
	- [Aaron Patterson's blog post: Is it Live](http://tenderlovemaking.com/2012/07/30/is-it-live.html)
	- [Why Rails 4 Live Streaming is a big deal](http://blog.phusion.nl/2012/08/03/why-rails-4-live-streaming-is-a-big-deal/)
	- [Commit](https://github.com/rails/rails/commit/af0a9f9eefaee3a8120cfd8d05cbc431af376da3)
	- [Rails 4 Countdown to 2013 - Live Streaming](http://blog.remarkablelabs.com/2012/12/live-streaming-rails-4-countdown-to-2013)
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
	- [Rails 4 Countdown to 2013 - Turbolinks](http://blog.remarkablelabs.com/2012/12/turbolinks-rails-4-countdown-to-2013)
- Russian Doll Caching
	- [How key-based cache expiration works](http://37signals.com/svn/posts/3113-how-key-based-cache-expiration-works)
	- [Evening on Backbone.js/ Q&A with dhh](http://www.youtube.com/watch?v=FkLVl3gpJP4#t=33m30s)
	- [Rails 4 Countdown to 2013 - Russian Doll Caching & Cache Digests](http://blog.remarkablelabs.com/2012/12/russian-doll-caching-cache-digests-rails-4-countdown-to-2013)
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
		- [Rails 4 Countdown to 2013 - Sprockets Rails](http://blog.remarkablelabs.com/2012/12/sprockets-rails-rails-4-countdown-to-2013)
- Replace memcache-client with dalli
	- [Pull Request](https://github.com/rails/rails/pull/6903)
- Routing Concerns
	- [Gem](https://github.com/rails/routing_concerns)
	- [Commit](https://github.com/rails/rails/commit/0dd24728a088fcb4ae616bb5d62734aca5276b1b)
	- [Rails 4 Countdown to 2013 - Routing Concerns](http://blog.remarkablelabs.com/2012/12/routing-concerns-rails-4-countdown-to-2013)
- PATCH verb
	- [Weblog post](http://weblog.rubyonrails.org/2012/2/26/edge-rails-patch-is-the-new-primary-http-method-for-updates/)
	- [Rails issue: use PATCH verb instead of PUT](https://github.com/rails/rails/issues/348)
	- [Rails 4 Countdown to 2013 - HTTP PATCH Verb](http://blog.remarkablelabs.com/2012/12/http-patch-verb-rails-4-countdown-to-2013)
- Rename all action callbacks from \*\_filter to \*\_action
	- [Commit](https://github.com/rails/rails/commit/9d62e04838f01f5589fa50b0baa480d60c815e2c)
	- [Rails 4 Countdown to 2013 - Renaming \*\_filter to \*\_action](http://blog.remarkablelabs.com/2012/12/renaming-_filter-to-_action-rails-4-countdown-to-2013)
- Helpers
	- [HTML5 tag helpers - Pull Request](https://github.com/rails/rails/pull/6359)
	- [Rails 4 Countdown to 2013 - Collection Form Helpers](http://blog.remarkablelabs.com/2012/12/collection-form-helpers-rails-4-countdown-to-2013)
	- [Rails 4 Countdown to 2013 - New HTML5 Form Input Helpers](http://blog.remarkablelabs.com/2012/12/new-html5-form-input-helpers-rails-4-countdown-to-2013)
- Render default index page
	- [Pull Request](https://github.com/rails/rails/pull/8468)
	- [Rails 4 Countdown to 2013 - Dynamic index.html](http://blog.remarkablelabs.com/2012/12/dynamic-index-html-rails-4-countdown-to-2013)
- Register your flash types
	- [Rails 4 Countdown to 2013 - Register your own flash types](http://blog.remarkablelabs.com/2012/12/register-your-own-flash-types-rails-4-countdown-to-2013)
	- [Commit](https://github.com/rails/rails/commit/238a4253bf229377b686bfcecc63dda2b59cff8f)
- New exceptions pages for development
	- [Pull Request](https://github.com/rails/rails/pull/8668)

## Active Record

- What's new
	- [Rails 4 Countdown to 2013 - What's new in Active Record](http://blog.remarkablelabs.com/2012/12/what-s-new-in-active-record-rails-4-countdown-to-2013)
- MySQL strict mode by default
	- [Pull Request](https://github.com/rails/rails/pull/6069)
- PostgreSQL support
	- [Rails 4 Countdown to 2013 - A love affair with PostgreSQL](http://blog.remarkablelabs.com/2012/12/a-love-affair-with-postgresql-rails-4-countdown-to-2013)
- Support for array datatype in PostgreSQL
	- [Rails 4.0 sneak peek: PostgreSQL array support](http://reefpoints.dockyard.com/ruby/2012/09/18/rails-4-sneak-peek-postgresql-array-support.html)
	- [Pull Request](https://github.com/rails/rails/pull/7547)
- Support for MACADDR, INET, CIDR datatypes in PostgreSQL
	- [Rails 4.0 sneak peek: PostgreSQL MACADDR, INET, CIDR support](http://reefpoints.dockyard.com/ruby/2012/05/18/rails-4-sneak-peek-expanded-activerecord-support-for-postgresql-datatype.html)
- Support for specifying transaction isolation level
	- [Commit](https://github.com/rails/rails/commit/392eeecc11a291e406db927a18b75f41b2658253)
- Schema cache dump
	- [Pull Request](https://github.com/rails/rails/pull/5162)
	- [Rails 4 Countdown to 2013 - Schema Cache Dump](http://blog.remarkablelabs.com/2012/12/schema-cache-dump-rails-4-countdown-to-2013)
- ActiveRecord::Relation bang methods
	- [Commit](https://github.com/rails/rails/commit/8c2c60511beaad05a218e73c4918ab89fb1804f0)
- ActiveRecord::Base.all returns a Relation
	- [Commit](https://github.com/rails/rails/commit/6a81ccd69d96f36f4322ef927191ab5a35e68d68)
- Relation#find\_or\_create\_by and friends
	- [Commit](https://github.com/rails/rails/commit/eb72e62c3042c0df989d951b1d12291395ebdb8e)
- CollectionProxy#scope
	- [Commit](https://github.com/rails/rails/commit/0e1cafcbc4d67854faf35e489571bc30f5e2ac14)
- Support for partial inserts
	- [Commit](https://github.com/rails/rails/commit/144e8691cbfb8bba77f18cfe68d5e7fd48887f5e)
- Relation.where with no args can be chained with not
	- [Pull Request](https://github.com/rails/rails/pull/8332)
	- [Revert of like and not\_like](https://github.com/rails/rails/commit/8d02afeaee8993bd0fde69687fdd9bf30921e805)
	- [Rails 4 Countdown to 2013 - Not Equal support for Active Record queries](http://blog.remarkablelabs.com/2012/12/not-equal-support-for-active-record-queries-rails-4-countdown-to-2013)
- Add metadata to schema\_migrations table
	- [Pull Request](https://github.com/rails/rails/pull/8399)
- Rename update\_attributes method to update, keep update\_attributes as an alias
	- [Commit](https://github.com/rails/rails/commit/1f3a1fedf951dbc4b72d178e2a649c4afd2f1566)

## Railties

- Threadsafe on by default
	- [Aaron Patterson's blog post](http://tenderlovemaking.com/2012/06/18/removing-config-threadsafe.html)
	- [Discusion of Tony Arcieri's Pull Request](https://github.com/rails/rails/pull/6685)
	- [Improve eager load on Rails: Pull Request](http://github.com/rails/rails/pull/7225)
	- [Railscast](http://railscasts.com/episodes/365-thread-safety)
	- [Rails 4 Countdown to 2013 - Rails 4 is thread safe by default](http://blog.remarkablelabs.com/2012/12/rails-4-is-thread-safe-by-default-rails-4-countdown-to-2013)
- Binstubs
	- [Install binstubs by default](https://github.com/rails/rails/commit/f34c27a452418d8aa17f92bb0fd7ae97b5f7e252)
	- [Revert "Install binstubs by default"](https://github.com/rails/rails/commit/1e9d6e7b567c778baa884e7e569e67cdf5040119)
	- [Revert "Ignore /bin on new apps" -- given the move to default binstubs, we want you to check those in!](https://github.com/rails/rails/commit/61b91c4c55bcbd5a2ec85d6e1c67755150653dff)
	- [bundle binstubs \<gem\>](https://github.com/carlhuda/bundler/compare/17561867...885ed215)
        - [Understanding binstubs](https://github.com/sstephenson/rbenv/wiki/Understanding-binstubs)
- Add --no-html to scaffold generator
	- [Commit](https://github.com/rails/rails/commit/cb025f850c45f26355892961d5cf05145d247a4d)
- Rails commands
	- [Commands](https://github.com/rails/commands)
	- [Spring](https://github.com/jonleighton/spring)

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
