---
layout: post
title: "Immutable strings in Ruby 2.3"
category:
comments: true
author:
  name: Alexis Mas
  email: alexis@wyeworks.com
  twitter_handle: _axxiss
  github_handle: axxiss
  image: /images/team/
  description: Software Engineer. Turning coffee into software since 2008.
---

String literals immutability is one of the new features you can find in
[Ruby 2.3][1]. But, what does this imply?

* Same value literals points to the same object
* Better performance
* Thread safety


Currently string immutability is included as opt-in, being the first step of a
multi stage rollout and if it works well it will be
[enabled by default on Ruby 3.0][2]. So it still can end up being just an
experiment. Time will tell.

You can follow frozen string literals feature status in Ruby issue tracker
[Feature #11473: Immutable String literal in Ruby 3][5]

<!--more-->

# Immutability

Quoting [wikipedia][3]:

> An immutable object is an object whose state cannot be modified after it is
> created.

As immutable objects state cannot be changed it doesn't make sense to copy the
same object over and over. In fact, Ruby 2.3 will hold a unique instance for
each string literal value used in the program. This means that 'a' and 'a'
references the same object.

This approach will help to avoid unnecessary data duplication, therefore
unnecessary object allocation is prevented and it will imply that the program
runs faster because it will spend less time in the Garbage Collector.

Furthermore, when we're concurrently accessing a shared literal across several
threads, there is no need to synchronize it access. This could lead to simpler
multi-threaded programs.

# Moving towards immutability

On this initial phase of Ruby's strings immutability, we can enable this feature
at a project level through a flag or on a per file basis using a pragma. Furthermore
for a more detailed error stack (while debugging) another flag can be enabled.

If you're working on an existent project and want to introduce this new feature,
obviously the most appropriate method is to use the pragma approach. Just add the
following comment at the beginning of each file you want to switch to immutable
strings and your done. Well, not really. Probably you will have some errors to fix.

    # frozen_string_literal: true

But, if you woke up today feeling like a kamikaze, enable frozen strings for the
whole project and prepare yourself for some serious bug hunting. So, to enable
string immutability for a project add the following flag when running your app.

    --enable-frozen-string-literal

One way or another, it's quite probable that you will encounter some bugs.
Mainly because you are relying in 3rd party gems that are not prepared for
immutable strings. Ruby ecosystem will need some time to adapt to this new
feature, once most popular gems start to adapt frozen string literals the
transition will be smoother.

Let's run a quick example, create a file named `replace.rb` with the following
lines:

{% codeblock lang:ruby %}
  str = "abcde"
  str.gsub!("c", "b")
{% endcodeblock %}

Running it with frozen string literal flag enabled, will throw an error like the one below.

    ruby --enable-frozen-string-literal replace.rb

    replace.rb:2:in `gsub!': can't modify frozen String (RuntimeError)
            from replace.rb:2:in `<main>'

Finding were the frozen string was created on a small example is straightforward, but what if we're on a large
codebase trying to modify a string that has been passed around between several methods distributed
on multiple files? Finding the original string can be cumbersome. That's why a debug
flag was added, add the debug flag as shown below and let's try again.

    ruby --enable-frozen-string-literal --enable-frozen-string-literal-debug replace.rb

    replace.rb:2:in `gsub!': can't modify frozen String, created at replace.rb:1 (RuntimeError)
      from replace.rb:2:in `<main>'

As you can see a subtle change is made to the error output, now we have exact
information about were the string was created.

### Same value literals points to the same object

Same value literals points to the same object, i.e. `a` and `a` points to the
same object. In Ruby we can compare two objects in different ways. Let's run a
small test with and without frozen strings to see what's changed.

{% codeblock lang:ruby %}
 puts 'a' == 'a'
 puts 'a'.equal? 'a'
 puts String.new('a').equal? String.new('a')
{% endcodeblock %}

Without frozen strings for `'a'.equal? 'a'` the interpreter creates two objects
with the value `a`, hence `equal?` will return `false`. With immutable strings
this is no longer true, in this case the interpreter will use a reference to the
same object, then as each reference points to the same object `equal?` will
return `true`.

|Operation|Mutable|Immutable|
|-|-|-|
|'a' == 'a'|true|true|
|'a'.equal? 'a'|false|true|
|String.new('a').equal? String.new('a')|false|false|

So if you are planning to upgrade your project to frozen strings keep this behavior
in mind and check for existent comparisons.


### Thread safety

Let's see what wikipedia says about [thread safety][4]:

> A piece of code is thread-safe if it only manipulates shared data structures
> in a manner that guarantees safe execution by multiple threads at the same time.

When dealing with objects we have two basic operations: read and write.
Concurrent reading is inherently thread safe, as we're not changing the state
of the object we're reading. On the other hand we have write operations, in this
case the object state change thus it must be synchronized. When an object state
can change at any moment, we need to synchronize both operations. This happens
because writing on the wrong moment can lead objects to be on an invalid state
and reading can get us an invalid state.

With all this in mind, we can say that string literals (and immutable objects in general)
are thread safe. Its state can't change as we can't change its value and if we try to,
an error will be thrown. Therefore race conditions are gone.

Certainly forgetting about race conditions in certain scenarios is great. But
(there's always a but) bear in mind that string literals are thread safe, not
its references!

{% codeblock lang:ruby %}
class Foo
  attr_accesor :literal

  def initialize(literal)
    @literal = literal
  end
end
{% endcodeblock %}

Picture yourself working with a `Foo` class, what happens when we pass a `Foo`
object to several threads, some of them reading from `literal` attribute and
another ones writing to?

In this case despite we are using string literals, we aren't safe when it comes
to thread safety. Actually we're holding a reference to a literal, nothing stop
us from changing that reference for another literal.

# Benchmarks

In this last section we're going to run a series of benchmarks to see how
strings immutability impacts on object allocation, garbage collection and
performance. Let's take the following snippet as the starting point for the
benchmarks.

{% codeblock lang:ruby %}
require 'objspace'

GC.start
GC.disable

1_000_000.times {}

puts ObjectSpace.count_objects[:T_STRING]
{% endcodeblock %}

Running the previous snippet creates 5,328 and 5,329 objects with and without
frozen strings enabled respectively. Let's change `1_000_000.times {}` for
`1_000_000.times { 'a' }` and run the script again: it returns 5,329 and
1,005,330. The frozen string version differs only by one object (the extra `a`)
meanwhile without frozen strings an extra million objects are being created.

Now let's enable garbage collection, remove object count and see what `GC.stat`
has to say. `GC.stat` will return a hash with garbage collection stats, the key we are
interested on are: `:count` and `:total_allocated_objects`.

{% codeblock lang:ruby %}
GC.start
1_000_000.times {}
puts GC.stat
{% endcodeblock %}


This is the formatted output:


Version|GC runs|Object allocation
-|-|-
mutable|57|1,057,077
immutable|6|57078

Finally let's measure how this impacts on performance.


{% codeblock lang:ruby %}
require 'benchmark'

puts Benchmark.measure { 1_000_000.times { 'a' } }
{% endcodeblock %}

On the table below you can find the results obtained from running the benchmark
without and with frozen literals respectively.

<table>
  <thead>
    <tr>
      <th>User</th>
      <th>System</th>
      <th>Total</th>
      <th>Real</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0.080000 </td>
      <td>0.000000</td>
      <td>0.080000</td>
      <td>0.073067</td>
    </tr>
    <tr>
      <td>0.040000</td>
      <td>0.000000</td>
      <td>0.040000</td>
      <td>0.045621</td>
    </tr>
  </tbody>
</table>


As you can see running the benchmark with frozen string literal result in a
speed improvement of 37%. The main responsible for this is what we saw on the
previous benchmarks: allocated objects.


# Conclusion

Comparing two string literals with `equal?` has a subtle change that can lead
to some hard to find bugs.

In some scenarios thread safety comes for free but remember: string literals are
thread safe, not its references.

Ruby 2.3 overall performance seems to be improved out of the box and frozen
literals adds an extra punch of speed.

Being the first step into immutable objects in Ruby, this could be seen as a
small change but it could serve as the foundation of a greater one.

[1]: http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/71450
[2]: https://bugs.ruby-lang.org/issues/8976#note-41
[3]: https://en.wikipedia.org/wiki/Immutable_object
[4]: https://en.wikipedia.org/wiki/Thread_safety
[5]: https://bugs.ruby-lang.org/issues/11473
