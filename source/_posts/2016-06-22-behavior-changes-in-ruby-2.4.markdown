---
layout: post
title: 'Behavior changes in Ruby 2.4'
category: 
comments: true
author:
  name: Jorge Bejar
  email: jorge@wyeworks.com
  twitter_handle: jmbejar
  github_handle: jmbejar
  image: /images/team/jorge-bejar.jpg
  description: Software Engineer at Wyeworks. Ruby on Rails developer.
---

A few days ago, [the first preview version of Ruby 2.4 was released](https://www.ruby-lang.org/en/news/2016/06/20/ruby-2-4-0-preview1-released/). This particular release includes a bunch of new features; moreover, it brings some fixes and changes that are not fully backward compatible. For this reason, we need to pay extra attention to those things that are not working exactly the same in this new Ruby version.

In this post, we will focus on some remarkable behavior changes, so we can better understand what could be affected or improved in our applications once we upgrade to Ruby 2.4.

<!--more-->

## Fixnum and Bignum were unified into Integer

Until Ruby 2.3 we have three different classes representing integer numbers. The `Integer` class was an abstract class and the parent of the concrete classes `Fixnum` and `Bignum`. Small values were represented using the `Fixnum` class, but if the value exceeded the allowed range `Bignum` was used instead.

See the following examples for Ruby 2.3:

```ruby
irb(main):> 3.class
Fixnum < Integer
irb(main):> 400_000_000_000_000_000_000.class
Bignum < Integer
irb(main):> 3.is_a? Integer
true
irb(main):> 3.is_a? Fixnum
true
irb(main):> 3.is_a? Bignum
false
```

Ruby 2.4.0-preview1 changed a bit this behavior. The `Integer` class is now the only concrete one. All integer objects are now instances of `Integer`. However, the constants `Fixnum` and `Bignum` remains available but these are just aliases for `Integer`.

Let's see how that affects the code from the previous example:

```ruby
irb(main):> 3.class
=> Integer
irb(main):> 400_000_000_000_000_000_000.class
=> Integer
irb(main):> 3.is_a? Integer
=> true
irb(main):> 3.is_a? Fixnum
=> true
irb(main):> 3.is_a? Bignum
=> true
```

It's funny to know that, in Ruby 2.4, even little numbers as the integer `3` are "big numbers" as well 😏 . Joking apart, remember that `Integer` is equal to `Fixnum` and `Bignum` and, as a result, `Fixnum` and `Bignum` are also aliases.

The `Integer` classes unification was motivated by opinions arguing that `Fixnum` and `Bignum` are just an implementation detail to deal with integer numbers in Ruby internals. In particular, new people learning the language will find easier to deal with a unique `Integer` class.

However, this change may break existing code, so be warned! If you have code that directly relies on the `Fixnum` or `Bignum` classes, you may need to double check the compatibility of your code. As usual, you might need to check if the gems in your bundle do not break because of this change. Just as an example, Rails maintainers have done their due diligence and [internal references to `Fixnum` and `Bignum` have been already removed](https://github.com/rails/rails/pull/25056). Therefore, Rails 5 will be prepared for the new `Integer` behavior in Ruby 2.4.

## Case conversion methods work with Unicode

The following case conversion methods were improved to work better with Unicode characters: `upcase`, `downcase`, `swapcase`, `capitalize`. These four methods included in the classes `String` and `Symbol` were affected by this change. The similar methods in `String` that makes changes in place (the ones that ends with exclamation mark, such as `upcase!`) were also covered.

Before Ruby 2.4, the case conversion only worked with ASCII characters, having no effect in other characters. See this example in Ruby 2.3, using a Spanish name with an accent in the first letter:

```ruby
irb(main):> "ángela".upcase
"áNGELA"
irb(main):> "ángela".capitalize
"ángela"
```

The `á` character is not part of the ASCII charset, so case conversions are not applied to this particular letter of the word even though the rest of the ASCII characters are actually converted. Fortunately, this is working great in the new ruby version. See how is goes in Ruby 2.4.0-preview1:

```ruby
irb(main):> "ángela".upcase
=> "ÁNGELA"
irb(main):> "ángela".capitalize
=> "Ángela"
```

Ángela can now provide her name and she will see her name capitalized in a banner or title section of their favorite web application... only if it is run with Ruby 2.4!

This change can also affect existing code because it is actually altering behavior in the language. However, it does not seem a problematic change and it will be likely to fix existing issues rather than break things. Nevertheless, the changed methods in Ruby 2.4 accept the `:ascii` symbol as a parameter to force the previous behavior:

```ruby
irb(main):> "ángela".upcase :ascii
=> "áNGELA"  
```

## Time and DateTime `to_time` method preserves timezone 

This is actually considered a bug fix, because early Ruby versions did not preserve the timezone of the receiver object when invoking the `to_time` method. The following is a demonstration of the issue present in Ruby 2.3:

```ruby
irb(main):> require 'date'
true
irb(main):> time = DateTime.strptime('2016-06-21 PST', '%Y-%m-%d %Z')
#<DateTime: 2016-06-21T00:00:00-08:00 ((2457561j,28800s,0n),-28800s,2299161j)>
irb(main):> time.zone
"-08:00"
irb(main):> time.to_time
2016-06-21 05:00:00 -0300
```

In this example code, we created a `DateTime` object that is expressed using the Pacific Standard Time timezone (PST). Unexpectedly, when we convert it to a `Time` object its timezone is not preserved. The new object uses the Uruguayan timezone (-03:00) which is the local timezone in my system. Please note that the first value is `0:00 AM PST` and the other is `5:00 AM UYT`. Both values are the same, but expressed in different timezones.

The same code in Ruby 2.4.0-preview1 will result in a new `Time` object that preserves the original timezone:

```ruby
irb(main):> require 'date'
=> true
irb(main):> time = DateTime.strptime('2016-06-21 PST', '%Y-%m-%d %Z')
=> #<DateTime: 2016-06-21T00:00:00-08:00 ((2457561j,28800s,0n),-28800s,2299161j)>
irb(main):> time.zone
=> "-08:00"
irb(main):> time.to_time
=> 2016-06-21 00:00:00 -0800
```

As in the previous changes, it may break some existing code so please check and test when upgrading the Ruby version. As a consequence of this change in Ruby, the Rails framework had to make [some changes because some related methods are part of their API, such as `String#to_date`](https://github.com/rails/rails/commit/c9c5788a527b70d7f983e2b4b47e3afd863d9f48). Rails 5 will support Ruby 2.2 and later, so the `ActiveSupport.to_time_preserves_timezone` config option was added to control how all `to_date` methods behave, ensuring backward compatibility with previous ruby versions if this option is set to `false`.  New Rails 5 apps will include an initializer file including`ActiveSupport.to_time_preserves_timezone = true` encouraging the use of the new timezone handling brought by Ruby 2.4.

## Final thoughts

Only part of the behavior changes that are bundled in the recently released Ruby 2.4.0-preview1 were discussed in this post. It is worth to mention that many other features and fixes were implemented for this new version of the language. A more extensive list of additions and changes can be found [here](https://github.com/ruby/ruby/blob/v2_4_0_preview1/NEWS).

We've looked at some relevant changes that are part of this first preview for Ruby 2.4. Those modifications are improvements to the language without any doubt, but at the same time those behaviors changes could not be fully compatible with existing code that runs in Ruby 2.3 or earlier versions. In the other hand, we can expect to have a very little chance to hit one of the compatibility issues in custom applications code. Some extra work might be needed for gems or third party libraries to avoid problems with Ruby 2.4. We mentioned a few tracks of work in Rails as a preparation for the new version of Ruby, because the Rails team wants to make sure the next major version of the framework, Rails 5, is fully compatible with the latest version of the language.

It's your turn now! I hope you have the opportunity to try this preview version of Ruby 2.4 and take advantage of the changes included in it. After all, this is open source and the Ruby team is waiting for feedback from the developers using the language 😎.

## References

__Integer class unification__<br/>
Ruby issues tracker: https://bugs.ruby-lang.org/issues/12005<br/>
Rails fix: https://github.com/rails/rails/pull/25056<br/>

__Unicode changes__<br/>
Ruby issues tracker: https://bugs.ruby-lang.org/issues/10085

__Timezone handling__<br/>
Ruby issues tracker: https://bugs.ruby-lang.org/issues/12189 and https://bugs.ruby-lang.org/issues/12271<br/>
Pull Request in Rails: https://github.com/rails/rails/issues/24617

__Other resources__<br/>
https://www.ruby-lang.org/en/news/2016/06/20/ruby-2-4-0-preview1-released/<br/>
https://github.com/ruby/ruby/blob/v2_4_0_preview1/NEWS<br/>
https://docs.google.com/document/u/1/d/1Nh94gv2oTp4_Kg6OgRJY7pRzm53zwBQ0v07_n1sW1Y4/pub<br/>
https://docs.google.com/document/u/1/d/1nQZDYtqlK8m2ed0q7nvaFWTOc_yNfvIgYa0Jydocr-o/pub
