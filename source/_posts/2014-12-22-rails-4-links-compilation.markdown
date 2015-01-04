---
layout: post
title: "Rails 4 Links Compilation"
category: Ruby
date: 2014-12-22 15:38:37 -0200
comments: true
hero_image: /images/heros/post-high.jpg
author:
  name: Jose Ignacio Costa
  email: jose@wyeworks.com
  twitter_handle: jose
  github_handle: jose
  image: /images/team/jose-ignacio-costa.jpg
  description: Founder, Software Engineer, Ruby "of" Rails contributor
published: true
---

First of all, I want to apologize to all for the long time it has taken me to push this humble new code. 

I started to work on `ActiveModel::Serializers` because I'm interested in the Rails API project in general and ActiveModel::Serializers in particular. Given that ActiveModel::Serializers has few contributors, I thought it could be a good opportunity to understand the code and help the community around the project.

<!--more-->

I began contributing to the project on a trip to San Francisco. There, I had the opportunity to work a bit with Yehuda Katz and Tom Dale at Tilde, but when I returned back to my job at WyeWorks, day-to-day responsibilities did not allow me to continue the project at the same velocity and manner I would have liked. This, in part, explains the above mentioned delay.

You can check out the code following [this link](https://github.com/rails-api/active_model_serializers/compare/919bb3840107...c65d387705ec)

## Improvements

- The code structure after the rewrite is pretty similar but with a number of advantages I will try to share here with you:

- The code is cleaner and clearer to understand and maintain.

- The following is a list of previous solutions that were either fixed or changed:

- [Refine method](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L7-29) [used here](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer.rb#L128), which implemented a solution that I found complicated. Now at load time, associations create objects that represent each and hold needed options, instead of generating an anonymous class per association.

- [Associations knew the source and target serializer](https://github.com/rails-api/active_model_serializers/blob/731528e1/lib/active_model/serializer/associations.rb#L49-56). That is, if we had a post serializer that had many comments, an object was created to represent the association recording, not only the comment serializer, but also the post serializer. Such visibility was eliminated in the rewrite. In fact, the responsibility of the associations object was changed as well. Now the responsibility is only that of building a serializer using the options specified for that association.

{% blockquote %}
Lorem ipsum dolorem sin amet, lorem ipsum dolorem sit amet, lorem impsum dolorem sit amet.
{% endblockquote %}

{% codeblock %}├── fixtures
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
{% endcodeblock %}

```
$ git clone git@github.com:imathis/octopress.git # fork octopress
```

``` ruby Discover if a number is prime http://www.noulakaz.net/weblog/2007/03/18/a-regular-expression-to-check-for-prime-numbers/ Source Article
class Fixnum
  def prime?
    ('1' * self) !~ /^1?$|^(11+?)\1+$/
  end
end
```

{% gist 4321346 %}

{% gist 4321346 gistfile1.diff %}

{% gist 1059334 svg_bullets.rb %}
{% gist 1059334 usage.scss %}

{% codeblock %}
Awesome code snippet
{% endcodeblock %}

{% codeblock lang:objc %}
[rectangle setX: 10 y: 10 width: 20 height: 20];
{% endcodeblock %}

{% codeblock Time to be Awesome - awesome.rb %}
puts "Awesome!" unless lame
{% endcodeblock %}

{% codeblock Javascript Array Syntax lang:js http://j.mp/pPUUmW MDN Documentation %}
var arr1 = new Array(arrayLength);
var arr2 = new Array(element0, element1, ..., elementN);
{% endcodeblock %}
