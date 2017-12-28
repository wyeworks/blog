---
layout: post
title: "New features in Ruby 2.5.0"
category: 
comments: true
author:
  name: Rodrigo Ponce de León
  email: rodrigo@wyeworks.com
  twitter_handle: rponce_89
  github_handle: rodrigopdl
  image: /images/team/rodrigo-pdl.jpg
  description: Ruby on Rails developer at WyeWorks. Beatlemaniac. Guitar freak.
---

The *2.5* series of *Ruby* first saw the light on October 10th, as part of the [first
preview release](https://www.ruby-lang.org/en/news/2017/10/10/ruby-2-5-0-preview1-released/)
toward *Ruby 2.5.0*. Just a couple of months later, on *Christmas* day
(*a [popular release date](https://www.ruby-lang.org/en/downloads/releases/) on
the Ruby releases calendar*), the first stable version of the series was born.

<!--more-->

Reflected on the [release notes](https://www.ruby-lang.org/en/news/2017/12/25/ruby-2-5-0-released/),
we can find a whole bunch of features,
changes and performance improvements which found their way to the final release.
On this post, I'd like to do a quick rundown of the features which I've found more interesting.

## Hash#slice

For a long time, *Ruby* has had built-in support for slicing strings and
arrays. The *Rails* library, *ActiveSupport*, took this one step further,
and [extended slicing to hashes](https://github.com/rails/rails/blob/v5.1.4/activesupport/lib/active_support/core_ext/hash/slice.rb#L21-L24).

On that same note, *Ruby 2.5.0* is now providing a way for the
programmer to *choose* the keys of a hash he or she is interested in (*in
fact, the [proposed name](https://bugs.ruby-lang.org/issues/13563) for the method was `choice` to start with*).

Given a hash, `slice` allows you to return a new hash
which only contains the keys and values you're interested in.

*On Ruby 2.4.3*:

```ruby
irb(main):> "this is a string".slice("is a")
=> "is a"

irb(main):> ["this", "is", "an", "array"].slice(3)
=> "array"

irb(main):> { a: "this", b: "is", c: "a", d: "hash" }.slice(:c, :d)
NoMethodError: undefined method `slice' for {:a=>"this", :b=>"is", :c=>"a", :d=>"hash"}:Hash
  from (irb):3
  from /Users/me/.rubies/ruby-2.4.3/bin/irb:11:in `<main>''
```

*On Ruby 2.5.0*:

```ruby
irb(main):> { a: "this", b: "is", c: "a", d: "hash" }.slice(:c, :d)
=> {:c=>"a", :d=>"hash"}
```

## Hash#transform_keys

As part of *Ruby 2.4*, `Hash#transform_values` [was introduced](https://github.com/ruby/ruby/blob/v2_4_0_preview2/NEWS).
This useful method allows us to transform the values in our hash with the
results of running a `block` once for every value.

*On Ruby 2.4.3*:

```ruby
irb(main):> { a: "hello", b: "world" }.transform_values {|v| v.upcase }
=> {:a=>"HELLO", :b=>"WORLD"}

irb(main):> { a: "hello", b: "world" }.transform_values(&:upcase)
=> {:a=>"HELLO", :b=>"WORLD"}
```

In a similar fashion to `Hash#slice`, the presence of a `transform_keys`
alternative on *Rails* seems to have triggered [this
new proposal](https://bugs.ruby-lang.org/issues/13583).

`Hash#transform_keys` works the same way, only that it affects hash keys
instead of values. A new hash will be returned with the results of
running the provided `block` once for every key.

*On Ruby 2.5.0*:

```ruby
irb(main):> { a: "hello", b: "world" }.transform_keys {|k| k.to_s }
=> {"a"=>"hello", "b"=>"world"}

irb(main):> { a: "hello", b: "world" }.transform_keys(&:upcase)
=> {:A=>"hello", :B=>"world"}
```

## Pattern argument on Enumerable methods

An interesting addition in *Ruby 2.5.0*, is that the `Enumerable` module
methods we all know and love, such as `any?`, `all?`, `none?` and `one?`, now accept a pattern argument.

This behavior was [already present](https://github.com/ruby/ruby/blob/trunk/enum.c#L108)
on the `grep` function, so it made sense to extend it to other `Enumerable` methods as well.

Let's take a look at an example to see how it works.

```ruby
irb(main):> words = ["hello", "fellow", "bye"]
=> ["hello", "fellow", "bye"]

irb(main):> words.any?(/ello/)
=> true
irb(main):> words.all?(/ello/)
=> false
irb(main):> words.one?(/ello/)
=> false
irb(main):> words.one?(/ye/)
=> true
irb(main):> words.none?(/ye/)
=> false
irb(main):> words.all?(/e/)
=> true
```

If a single pattern argument is provided, the method runs `pattern === element` for every collection member. The result will of course depend on the method being used.

On the previous examples, we are matching different regular expression
patterns against each of the strings in our `words` array. But, what
else can we match?

Here are some examples:

```ruby
irb(main):> [1, 2, 3].all?(Numeric)
=> true
irb(main):> [1, 3.14, 42].none?(Float)
=> false
irb(main):> ["Hi", "there", 2].any?(String)
=> true
```

Given that `===` is implemented on a per class basis, we can get
different behavior when using it with, for instance, Classes or Regexps.

*[Here](https://blog.arkency.com/the-equals-equals-equals-case-equality-operator-in-ruby/), you'll find more information on the case equality operator ===.*

## Reverse backtrace

This feature, labeled as experimental on the release notes, has the
potential to save you tons of scrolling at the time of inspecting logs or
reading error backtraces.

As a *Rails* developer, I'm used to long backtraces. Given that we tend
to read these from bottom to top, it sometimes means that we end up
scrolling a lot just to reach the error message we were looking for.

Of course, this wouldn't be as helpful in the case of short backtraces,
but I guess it shouldn't be a negative change if that's your normal
scenario.

I'm stating it's experimental status, given that it currently works only
for TTY, and it's actual user experience benefits are [widely discussed](https://bugs.ruby-lang.org/issues/8661).

As a way to illustrate the new format, here are a couple of examples:

*On Ruby 2.4.3*:

```ruby
irb(main):> raise "Something went wrong!"
RuntimeError: Something went wrong!
        from (irb):1
        from /Users/me/.rubies/ruby-2.4.3/bin/irb:11:in `<main>'
```

*On Ruby 2.5.0*:

```ruby
irb(main):> raise "Something went wrong!"
Traceback (most recent call last):
        2: from /Users/me/.rubies/ruby-2.5.0/bin/irb:11:in `<main>'
        1: from (irb):3
RuntimeError (Something went wrong!)
```

## PP by default

The `PP` *Ruby* module, is a very popular pretty-printer for *Ruby*
objects. Up until now, using it to print nicely formatted objects
enforced you to require the module: `require 'pp'`

It seems that people [got a bit tired of requiring pp](https://bugs.ruby-lang.org/issues/14123) all over the
place, and ended up proposing [its inclusion on the Kernel module](https://github.com/ruby/ruby/blob/trunk/prelude.rb#L148-L151).

*On Ruby 2.4.3*:

```ruby
irb(main):> cart = [{ items: ["tomato", "banana", "mango"], total: 200 }, { shipping_options: ["two_day", "one_day"]}, { payment_method
s: ["Cash", "Credit Card"]}]
=> [{:items=>["tomato", "banana", "mango"], :total=>200}, {:shipping_options=>["two_day", "one_day"]}, {:payment_methods=>["Cash", "Credit Card"]}]

irb(main):> pp cart
NoMethodError: undefined method `pp' for main:Object
Did you mean?  p
        from (irb):11
        from /Users/me/.rubies/ruby-2.4.3/bin/irb:11:in `<main>'

irb(main):> require 'pp'
irb(main):> pp cart

[{:items=>["tomato", "banana", "mango"], :total=>200},
 {:shipping_options=>["two_day", "one_day"]},
 {:payment_methods=>["Cash", "Credit Card"]}]
=> [{:items=>["tomato", "banana", "mango"], :total=>200}, {:shipping_options=>["two_day", "one_day"]}, {:payment_methods=>["Cash", "Credit Card"]}]
```

*On Ruby 2.5.0*:

```ruby
irb(main):> cart = [{ items: ["tomato", "banana", "mango"], total: 200 }, { shipping_options: ["two_day", "one_day"]}, { payment_method
s: ["Cash", "Credit Card"]}]
=> [{:items=>["tomato", "banana", "mango"], :total=>200}, {:shipping_options=>["two_day", "one_day"]}, {:payment_methods=>["Cash", "Credit Card"]}]

irb(main):> pp cart

[{:items=>["tomato", "banana", "mango"], :total=>200},
 {:shipping_options=>["two_day", "one_day"]},
 {:payment_methods=>["Cash", "Credit Card"]}]
=> [{:items=>["tomato", "banana", "mango"], :total=>200}, {:shipping_options=>["two_day", "one_day"]}, {:payment_methods=>["Cash", "Credit Card"]}]
```

## Bottom line

In this rundown, we did a quick tour of some of the new features in
*Ruby 2.5.0*. There's a lot more to discover though.

In particular, I'm a fan of the little method additions
and enchancements, such as `slice` and pattern matching on `Enumerable`
sequence predicates. Also, the reverse backtrace printing looks promising. I hope
it doesn't end up being just an experimental and temporary thing.

What are the features or improvements which caught your attention the most?

Please let me know in the comments section!
