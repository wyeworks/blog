---
layout: post
title: ActiveModel::Serializers Rewrite (upcoming 0.9.0.pre version)
category: Ruby
hero_image: /images/heros/post-high.jpg
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle:  spastorino
  image:  /images/team/santiago.jpg
  description: WyeWorks Co-Founder, Ruby on Rails Core Team Member
published: true
---

First of all, I want to apologize to all for the long time it has taken me to push this humble new code. 

I started to work on `ActiveModel::Serializers` because I'm interested in the Rails API project in general and ActiveModel::Serializers in particular. Given that ActiveModel::Serializers has few contributors, I thought it could be a good opportunity to understand the code and help the community around the project.

<!--more-->

I began contributing to the project on a trip to San Francisco. There, I had the opportunity to work a bit with Yehuda Katz and Tom Dale at Tilde, but when I returned back to my job at WyeWorks, day-to-day responsibilities did not allow me to continue the project at the same velocity and manner I would have liked. This, in part, explains the above mentioned delay.

You can check out the code following [this link](https://github.com/rails-api/active_model_serializers/compare/919bb3840107...c65d387705ec)

## Improvements

The code structure after the rewrite is pretty similar but with a number of advantages I will try to share here with you:

**The code is cleaner and clearer to understand and maintain.**

The following is a list of previous solutions that were either fixed or changed:

- [Refine method](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L7-29) [used here](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L128), which implemented a solution that I found complicated. Now at load time, associations create objects that represent each and hold needed options, instead of generating an anonymous class per association.

- [Associations knew the source and target serializer](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L49-56). That is, if we had a post serializer that had many comments, an object was created to represent the association recording, not only the comment serializer, but also the post serializer. Such visibility was eliminated in the rewrite. In fact, the responsibility of the associations object was changed as well. Now the responsibility is only that of building a serializer using the options specified for that association.

- The [fast_attributes](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L453-467) solution and [its invalidation strategy](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L105-111) were removed.

- Mutability as seen [here](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L395) and [here](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L418). The previous solution passed a global hash that was modified by the objects that intervened in the solution. This is now changed using a more functional approach, decoupling objects and making them more testable.

- ActiveModel::Serializer [talked to the controller](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L260-287).
This is now the responsibility of ActionController::Serializable.

- ActiveModel::Serializer responsibility is to decorate the object we want to serialize but that contract [wasn't honored in the previous code](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L137). Now there's no direct access to the serialized object and everything is done inside the serializer.

- The responsibilities of a few objects were not very clear. 
For example, Association.
Those were used to register associations to be serialized together with their respective options. In addition, [it recorded the serializer origin and destination of the association](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L49-56). It also [built a serializer](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L92-100) for the target relationship. Lastly, it was responsible for [initiating the objects serialization process](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L122-126) and [serialization of ids](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L134-143). Association current responsibility is only to construct and configure a serializer for the association.

- Given the structure of the code and the new responsibilities, it is now easier to implement adapters for different formats.


**The tests now make it easier to understand how each part of the code works, are better organized and make sure that everything gets tested.**

There are test files organized by functionality:

<pre><code>├── fixtures
│   ├── active_record.rb
│   └── poro.rb
├── integration
│   ├── action_controller
│   │   └── serialization_test.rb
│   └── active_record
│       └── active_record_test.rb
├── test_helper.rb
└── unit
    └── active_model
        ├── array_serializer
        │   ├── meta_test.rb
        │   ├── root_test.rb
        │   ├── scope_test.rb
        │   └── serialize_test.rb
        ├── default_serializer_test.rb
        └── serializer
            ├── attributes_test.rb
            ├── filter_test.rb
            ├── has_many_test.rb
            ├── has_one_test.rb
            ├── meta_test.rb
            ├── root_test.rb
            ├── scope_test.rb
            └── settings_test.rb
</code></pre>

**A lot less code for equivalent functionality.**

LOC went down by ~50% from 682 to 340.

**Performance is much better than before.**

But please try this out in your apps. I've ran Sam Saffron's Discourse benchmarks using Rails 4 and current master of AMS and the rewrite branch. Here you have the results.

Current master branch:

<pre><code>Starting benchmark...
Running apache bench warmup
Benchmarking /
Running apache bench warmup
Benchmarking /t/oh-how-i-wish-i-could-shut-up-like-a-tunnel-for-so/69
Your Results: (note for timings- percentile is first, duration is second in millisecs)
---
home_page:
 50: 51
 75: 53
 90: 55
 99: 237
topic_page:
 50: 84
 75: 87
 90: 91
 99: 142
timings:
 load_rails: 4786
ruby-version: 2.0.0-p247
rails4?: true
architecture: x86_64
operatingsystem: Darwin
kernelversion: 12.5.0
memorysize: 8.00 GB
virtual: physical
</code></pre>

Rewrite branch:

<pre><code>Starting benchmark...
Running apache bench warmup
Benchmarking /
Running apache bench warmup
Benchmarking /t/oh-how-i-wish-i-could-shut-up-like-a-tunnel-for-so/69
Your Results: (note for timings- percentile is first, duration is second in millisecs)
---
home_page:
 50: 40
 75: 41
 90: 44
 99: 236
topic_page:
 50: 76
 75: 78
 90: 81
 99: 130
timings:
 load_rails: 4331
ruby-version: 2.0.0-p247
rails4?: true
architecture: x86_64
operatingsystem: Darwin
kernelversion: 12.5.0
memorysize: 8.00 GB
virtual: physical
</code></pre>

Why is it faster? Because AMS now does less work in order to produce the same results. Plus, much of the work that used to happen per each request are now carried out at load time.

**We have a new project maintainer**

For some time, AMS has been somewhat inactive as a project. Thankfully, Steve Klabnik has been recently working a great deal on issues and merging pull requests. From now on, I will also be actively contributing to the project. My intention is to resolve **all** pending issues and pull requests.

## What's next?

It would be great if you could test your applications against this new branch and **report any issues**. I successfully ran the Discourse tests applying [this patch](https://gist.github.com/spastorino/6991672). That patch gives an idea of some of the changes introduced but, depending on what you're using, problems can show up. Consider yourself warned. :)

After all that, here I have my to-do list. Several people have offered help via mail, Twitter, etc. Please feel free to grab tasks from here and make them yours it if you'd like. I'll continue to work on these issues as well.

### To-do list

- Complete the CHANGELOG of version 0.9.0 (part of this post can be reused)
- Write the project's RDoc
- Make the current format interchangeable
- Tests for MongoID
- Make Rails 4 controller generator output code that responds to JSON. This was true for Rails 3.2 but currently not with Rails 4.
- Think more about the `filter` method. Should it filter by association name or by serialization keys? This is probably easier to explain with code. For example: `def filter(keys); keys - [:comments]; end` versus `def filter(keys); keys - [:comments, :comment_ids]; end`.
- Re-implement [merge_assoc](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L430-449) which cached serialization output to improve performance for larger serialization operations. We could change the current implementation with a per-serializer output cache.
- Implement the JSON API format
- Add support for polymorphic associations
- Come up with a better caching solution
- Re-add Serializer#schema
