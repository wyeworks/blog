---
layout: post
title: Rails API is going to be included in Rails 5
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

We've decided to include Rails API in Rails core :party: :party: :party:. I've been working on this the last week and today we opened a [Pull Request](https://github.com/rails/rails/pull/19832) to discuss the results.

## What is Rails API?
Rails API's original idea was to be the starting point for a more suitable Rails for JS heavy apps. The project is composed of Rails API per se, Active Model Serializers and a bunch of other ideas that haven't been implemented yet.
Right now it provides a reduced controller, a reduced middleware stack and a proper set of generators, all suitable for API apps.

For more detailed information about the project [read our previous article](http://wyeworks.com/blog/2012/4/20/rails-for-api-applications-rails-api-released/)

## Next steps: what we need to talk about
We still need to decide exactly how we want api apps to be built and what other features we would like to include out of our list of ideas.
For example ...

- Would we like to have a backend app and a frontend app and then avoid assets generation in Rails?
- Would we prefer to have just one app and keep assets generation in Rails?
- Would we like to include Active Model Serializers by default or jbuilder?
- How this will play nicely when used with jbuilder?

## Join the conversation
Like every year, I'm attending RailsConf. This is a great opportunity to talk to each other. So if you find me we can talk about this or any other thing you want. Any comments, reviews, suggestions and improvements are more than welcome.
