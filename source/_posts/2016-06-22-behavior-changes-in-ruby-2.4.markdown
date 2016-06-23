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

[The first preview version of Ruby 2.4 was released](https://www.ruby-lang.org/en/news/2016/06/20/ruby-2-4-0-preview1-released/) a few days ago. This particular release includes a bunch of new features. Moreover, it introduces some fixes and changes that are not entirely backward compatible. Thus, we need to pay close attention to these differences in this new version of Ruby.

In this post, we’ll focus on some remarkable changes in behavior, so as to better understand how our applications could be affected or improved once we upgrade to Ruby 2.4.

<!--more-->

## Fixnum and Bignum were unified into Integer

Until Ruby 2.3, we had three different classes representing integer numbers. The `Integer` class was an abstract class and the parent of the concrete classes `Fixnum` and `Bignum`. Small values were represented using the `Fixnum` class, but if the value exceeded the allowed range, `Bignum` was used instead.

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

This behavior changed slightly with Ruby 2.4.0-preview1. The `Integer` class is now the only concrete one. All integer objects are now instances of `Integer`. The constants `Fixnum` and `Bignum` remain available but they are just aliases for `Integer`.

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

It’s funny to note that in Ruby 2.4, even little numbers such as the integer `3` are "big numbers" as well 😏. Jokes aside, remember that `Integer` is equivalent to `Fixnum` and `Bignum` and, as a result, `Fixnum` and `Bignum` are also aliases.

The unification of the `Integer` classes was motivated by the argument that `Fixnum` and `Bignum` simply constitute an implementation detail to handle integer numbers in Ruby internals. In particular, new people learning the language will find it easier to deal with a unique `Integer` class.

However, this change may break existing code, so be warned! If you have code that directly relies on the `Fixnum` or `Bignum` classes, you may need to double-check your code’s compatibility. As usual, you should verify that the gems in your bundle don’t break given this change. For example, Rails maintainers have done their due diligence and [internal references to `Fixnum` and `Bignum` have already been removed](https://github.com/rails/rails/pull/25056). Therefore, Rails 5 will be ready for the new `Integer` behavior in Ruby 2.4.

## Case conversion methods work with Unicode

The following case conversion methods were improved upon so that they work better with Unicode characters: `upcase`, `downcase`, `swapcase` and `capitalize`. These four methods, which belong to the classes `String` and `Symbol`, were affected by this change. The similar methods in `String` that make changes in place (the ones that end with an exclamation mark, such as `upcase!`) were also updated.

Before Ruby 2.4, case conversion only worked with ASCII characters, having no effect on other characters. See the following Ruby 2.3 example, using a Spanish name with an accent on the first letter:

```ruby
irb(main):> "ángela".upcase
"áNGELA"
irb(main):> "ángela".capitalize
"ángela"
```

The `á` character is not part of the ASCII charset, so case conversions are not applied to this particular letter of the word even though the rest of the ASCII characters are converted. Fortunately, this is now working well in the latest version of  Ruby. See how Ruby 2.4.0-preview1 handles it:

```ruby
irb(main):> "ángela".upcase
=> "ÁNGELA"
irb(main):> "ángela".capitalize
=> "Ángela"
```

Ángela can now input her name and see it capitalized in a banner or title section of her favorite web application...but only if it is run with Ruby 2.4!

This change can also affect existing code because it is actually altering the language’s behavior. However, we shouldn’t run into many cases where things break. In fact, I feel this change can fix existing errors. Nevertheless, if you are in a situation where this change is somehow problematic, all the affected methods in Ruby 2.4 accept the `:ascii` symbol as a parameter to force the previous behavior:

```ruby
irb(main):> "ángela".upcase :ascii
=> "áNGELA"  
```

## Time and DateTime `to_time` method preserves time zone 

This is considered a bug fix, since early Ruby versions did not preserve the time zone of the receiver object when invoking the `to_time` method. The following demonstrates the issue in Ruby 2.3:

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

In the above example, we created a `DateTime` object that is expressed in the Pacific Standard Time time zone (PST). Unexpectedly, when we convert it to a `Time` object, its time zone is not preserved. The new object uses the Uruguayan time zone (-03:00), which is my system’s local time zone. Please note that the first value is `0:00 AM PST` and the other is `5:00 AM UYT`. Both values are equivalent, just expressed in different time zones.

The same code in Ruby 2.4.0-preview1 will result in a new `Time` object that preserves the original time zone:

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

As with the other changes previously mentioned, some existing code may break, so always test thoroughly when upgrading your version of Ruby. As a consequence of this latter change in Ruby, the Rails framework had to [be changed as some related methods are part of their API, including `String#to_date`](https://github.com/rails/rails/commit/c9c5788a527b70d7f983e2b4b47e3afd863d9f48). Rails 5 will support Ruby 2.2 and later, so the `ActiveSupport.to_time_preserves_timezone` config option was added to control how all `to_date` methods behave, ensuring backward compatibility with previous Ruby versions if said option is set to `false`.  New Rails 5 apps will contain an initializer file including `ActiveSupport.to_time_preserves_timezone = true`, encouraging the use of the new time zone handling introduced by Ruby 2.4.

## Final thoughts

Only some of the changes in behavior introduced in the recently released Ruby 2.4.0-preview1 were discussed in this post. It is worth mentioning that many other features and fixes were implemented in this new version of the language. A more extensive list of additions and changes can be found [in the Ruby NEWS file for this version](https://github.com/ruby/ruby/blob/v2_4_0_preview1/NEWS).

We've looked at some important changes that are part of this first Ruby 2.4 preview. Without a doubt, these modifications represent improvements to the language, but at the same time these changes in behavior may not be fully compatible with existing code that runs in Ruby 2.3 or earlier. On the other hand, there is little chance we will experience one of the compatibility issues with custom applications code. Some extra work might be needed with gems or third party libraries to avoid problems with Ruby 2.4. We mentioned a few areas of work in Rails to prepare for the new version of Ruby; the Rails team wants to make sure the next major version of the framework, Rails 5, is fully compatible with the latest version of the language.

It's your turn now! I hope you have the opportunity to try this preview version of Ruby 2.4 and take advantage of the changes it includes. After all, this is open source and the Ruby team is awaiting feedback from developers using the language 😎.

## References

__Integer class unification__<br/>
Ruby issue: https://bugs.ruby-lang.org/issues/12005<br/>
Rails fix: https://github.com/rails/rails/pull/25056<br/>

__Unicode changes__<br/>
Ruby issue: https://bugs.ruby-lang.org/issues/10085

__Timezone handling__<br/>
Ruby issues: https://bugs.ruby-lang.org/issues/12189 and https://bugs.ruby-lang.org/issues/12271<br/>
Rails fix: https://github.com/rails/rails/issues/24617

__Other resources__<br/>
https://www.ruby-lang.org/en/news/2016/06/20/ruby-2-4-0-preview1-released/<br/>
https://github.com/ruby/ruby/blob/v2_4_0_preview1/NEWS<br/>
https://docs.google.com/document/u/1/d/1Nh94gv2oTp4_Kg6OgRJY7pRzm53zwBQ0v07_n1sW1Y4/pub<br/>
https://docs.google.com/document/u/1/d/1nQZDYtqlK8m2ed0q7nvaFWTOc_yNfvIgYa0Jydocr-o/pub
