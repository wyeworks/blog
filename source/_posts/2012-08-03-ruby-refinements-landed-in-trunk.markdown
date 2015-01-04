---
layout: post
title: Ruby Refinements landed in trunk
category: Ruby
hero_image: /images/heros/post-high.jpg
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
Refinements arrived to Ruby trunk [here](https://bugs.ruby-lang.org/issues/4085.) The purpose of Refinements is to make monkey patching safer, extending core classes but limiting its effects to a particular area of code.

<!--more-->

Shugo Maeda wrote ...

{% codeblock %}"Refinements are similar to Classboxes.  However, Refinements doesn't
support local rebinding as mentioned later.  In this sense,
Refinements might be more similar to selector namespaces, but I'm not
sure because I have never seen any implementation of selector
namespaces.

In Refinements, a Ruby module is used as a namespace (or classbox) for
class extensions.  Such class extensions are called refinements.  For
example, the following module refines Fixnum."{% endcodeblock %}

You can read the long story here [https://bugs.ruby-lang.org/issues/4085](https://bugs.ruby-lang.org/issues/4085)

So let's see how Refinements work in practice

Basically instead of doing …

{% codeblock lang:ruby %}class Object
  def blank?
    respond_to?(:empty?) ? empty? : !self
  end
end

puts "".blank?
puts "hi".blank?
puts nil.blank?
puts [].blank?
puts [1].blank?{% endcodeblock %}

and polluting all the objects, you can do ...

{% codeblock lang:ruby %}module Blank
  refine Object do
    def blank?
      respond_to?(:empty?) ? empty? : !self
    end
  end
end

class A
  using Blank

  puts "".blank?   # => true
  puts "hi".blank? # => false
  puts nil.blank?  # => true
  puts [].blank?   # => true
  puts [1].blank?  # => false
end{% endcodeblock %}

and monkey patch in a controlled way. You can also check that you won't be polluting all the objects in your system by checking …

{% codeblock lang:ruby %}class B
  puts "".blank?
  puts "hi".blank?
  puts nil.blank?
  puts [].blank?
  puts [1].blank?
end{% endcodeblock %}

This will raise an undefined method `blank?' for [](String) (NoMethodError).

Refinements has been committed to ruby by Shugo Maeda, but it may be reverted for Ruby 2.0. The Ruby Core is asking for feedback, so, what are the use cases you see Refinements is good for you?

You can learn more about Refinements reading [Refinements in practice, a blog post from Yehuda Katz](http://yehudakatz.com/2010/11/30/ruby-2-0-refinements-in-practice/)
