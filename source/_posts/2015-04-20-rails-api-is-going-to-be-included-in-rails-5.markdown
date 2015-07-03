---
layout: post
title: Rails API to be part of Rails 5
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

A decision was made to incorporate Rails API into Rails core &#x1f389; &#x1f389; &#x1f389;. During the last week I’ve been working on this and, today we [opened a pull request](https://github.com/rails/rails/pull/19832) to discuss the results.

## What is Rails API?

The original idea behind Rails API was to serve as a starting point for a version of Rails better suited for JS-heavy apps. The project consists of: Rails API per se, the Active Model Serializers project plus a bunch of ideas that haven’t been implemented yet. As of today, Rails API provides: trimmed down controllers and middleware stack together with a matching set of generators, all specifically tailored for API type applications.

For more detailed information about the Rails API project, please read [my previous article](http://wyeworks.com/blog/2012/4/20/rails-for-api-applications-rails-api-released/) on the subject.

## Next steps: What we need to talk about?

We still need to discuss the “Rails way” for API applications, how API apps should be built and, what features we’d like included from our original list of ideas. In particular:

- Do we want to avoid asset generation in Rails by having a back-end and a front-end apps?
- Do we prefer to have a single application and keep asset generation in Rails instead?
- Do we like Active Model Serializers better than Jbuilder?
- If not, can we make Rails API play nicely with Jbuilder?

## Join the conversation

Like every year, I’m attending RailsConf 2015 in Atlanta. This could be a great opportunity to meet and interact. So, please come find me throughout the conference or say hi if we run into each other. I’d love to talk about Rails API or any other topic. Comments, reviews, suggestions and improvements are always welcome.
