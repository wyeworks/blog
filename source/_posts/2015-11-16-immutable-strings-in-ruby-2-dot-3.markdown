---
layout: post
title: "Immutable strings in Ruby 2.3"
category:
date: 2015-11-16 08:39:25 -0300
comments: true
author:
  name: Alexis Mas
  email: alexis@wyeworks.com
  twitter_handle: _axxiss
  github_handle: axxiss
  image: /images/team/
  description: Software Engineer. Turning coffee into software since 2008.
---

String literals immutability is one of the new features you can find in [Ruby 2.3][1].
But what does this implies?

* Equality comparison affected
* Better performance
* Thread safety


Currently string immutability is included as opt-in, as the first step of a multi
stage rollout and if it works well it will be [enabled by default on Ruby 3.0][2].
So it still can end up being just an experiment. Time will tell.

<!--more-->

# Immutability

Quoting [wikipedia][3]:

> An immutable object is an object whose state cannot be modified after it is created.

As immutable objects state cannot be changed it doesn't make sense to copy the
same object over and over. Following that approach it will have three major
consequences:

* Data duplication
* Unnecessary object allocation
* Thread unsafe

All of this can be mitigated using references to objects. Allowing the interpreter
to copy a reference to an object instead copying the object itself. This can have
certain impact on performance when working with a large codebase.


# Moving towards immutability

On this initial phase of Ruby's strings immutability, we can enable this feature
at a project level through a flag or on a per file basis using a pragma. Furthermore
for a more detailed error stack (while debugging) another flag can be enabled.

If you're working on an existent project and want to introduce this new feature,
obviously the most appropriate method is to use the pragma approach. Just add the
following comment at the beginning of each file you want to switch to immutable
strings and your done. Well, not really. Probably you will have some errors to fix.

    # frozen_string_literal: true

But, if today you woken up feeling like a kamikaze enable frozen strings for the
whole project and prepare yourself for some serious bug hunting. So, to enable
string immutability for a project add the following flag when running your app.

    --enable-frozen-string-literal

One way or another, its quite probable that you will encounter some bugs.

Lets run a quick example, create a file named `replace.rb` with the following lines

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
on multiple files? Finding the original string can be cumbersome. Thats why a debug
flag was added, add the debug flag as shown below and lets try again.

    ruby --enable-frozen-string-literal --enable-frozen-string-literal-debug replace.rb

    replace.rb:2:in `gsub!': can't modify frozen String, created at replace.rb:1 (RuntimeError)
      from replace.rb:2:in `<main>'

As you can see a subtle change is made to the error output, now we have exact
information about were the string was created.

### Equality

When it comes to equality comparison working with immutable strings has one
particular side effect: ``'a'.equal? 'a'`` returns `true`. This is because `a` is
the same object. Lets run a small test with and without frozen strings.

{% codeblock lang:ruby %}
 puts 'a' == 'a'
 puts 'a'.equal? 'a'
 puts String.new('a').equal? String.new('a')
{% endcodeblock %}

Without frozen strings for `'a'.equal? 'a'` the interpreter creates two objects with the value
`a`, hence `equal?` will return `false`. With immutable strings this is no longer true, in
this case the interpreter will use a reference to the same object then as each
reference points to the same object `equal?` will return `true`.

|Operation|Mutable|Immutable|
|-|-|-|
|'a' == 'a'|true|true|
|'a'.equal? 'a'|false|true|
|String.new('a').equal? String.new('a')|false|false|

So if you are planning to upgrade your project to frozen strings keep this behavior
in mind and check for existent comparisons.


### Thread safety

Another property of immutability is thread safety. As the object state can't change
after is created there is no need to synchronize, hence accessing the same literal
from several threads will result in cleaner code

# Benchmarks

Running this benchmark will give us a basic notion of what degree of improvement
 are we talking about.

{% codeblock lang:ruby %}
require 'benchmark'

def create(bench)
  bench.report 'create' do
    1_000_000.times { 'a' }
  end
end

def concat(bench)
  ab = 'ab'
  bench.report 'concat' do
    1_000_000.times { 'a' + 'b' }
  end
end

def append(bench)
  result = String.new
  bench.report 'append' do
    1_000_000.times { result << 'a' }
  end
end

def replace(bench)
  bench.report 'replace' do
    1_000_000.times { 'abcd'.gsub('c', 'a') }
  end
end

Benchmark.bm do |bench|
  create bench
  concat bench
  append bench
  replace bench
end
{% endcodeblock %}

On the table below you can find the results obtained from running the benchmark with
three variants: ruby 2.2 and ruby 2.3 without and with frozen literals respectively.
Boost column is the speed up obtained comparing current row with the previous one.

<table>
  <thead>
    <tr>
      <th>Operation</th>
      <th>User</th>
      <th>System</th>
      <th>Total</th>
      <th>Real</th>
      <th>Boost(%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan='3'>create</td>
      <td>0.120000</td>
      <td>0.000000</td>
      <td>0.120000</td>
      <td>0.122728</td>
      <td></td>
    </tr>
    <tr>
      <td>0.080000 </td>
      <td>0.000000</td>
      <td>0.080000</td>
      <td>0.080323</td>
      <td>34</td>
    </tr>
    <tr>
      <td>0.050000</td>
      <td>0.000000</td>
      <td>0.050000</td>
      <td>0.050843</td>
      <td>37</td>
    </tr>

    <tr>
      <td rowspan='3'>concat</td>
      <td>0.280000</td>
      <td>0.000000</td>
      <td>0.280000</td>
      <td>0.278669</td>
      <td></td>
    </tr>
    <tr>
      <td>0.170000</td>
      <td>0.010000</td>
      <td>0.180000</td>
      <td>0.175376</td>
      <td>23</td>
      <td></td>
    </tr>
    <tr>
      <td>0.120000</td>
      <td>0.010000</td>
      <td>0.130000</td>
      <td>0.117729</td>
      <td>30</td>
    </tr>

    <tr>
      <td rowspan='3'>append</td>
      <td>0.200000</td>
      <td>0.010000</td>
      <td>0.210000</td>
      <td>0.207419</td>
      <td></td>
    </tr>
    <tr>
      <td>0.150000</td>
      <td>0.000000</td>
      <td>0.150000</td>
      <td>0.147434</td>
      <td>25</td>
    </tr>
    <tr>
      <td>0.120000</td>
      <td>0.000000</td>
      <td>0.120000</td>
      <td>0.126329</td>
      <td>20</td>
    </tr>
    <tr>

    <tr>
      <td rowspan='3'>replace</td>
      <td>1.300000</td>
      <td>0.000000</td>
      <td>1.300000</td>
      <td>1.330694</td>
      <td></td>
    </tr>
    <tr>
      <td>1.130000</td>
      <td>0.000000</td>
      <td>1.130000</td>
      <td>1.142455</td>
      <td>14</td>
    </tr>
    <tr>
      <td>0.890000</td>
      <td>0.020000</td>
      <td>0.910000</td>
      <td>0.915174</td>
      <td>22</td>
    </tr>
  </tbody>
</table>


As you can see from 2.2 to 2.3 we already have a performance boost, finally  when
frozen literals are activated the speed up is even greater.

Lets see what garbage collection stats says:


Version|GC runs|Object allocation
-|-|-
2.2|499|11,046,267
2.3|584|11,059,587
2.3*|111|2,059,562

Strangely Ruby 2.3 garbage collection increased by a 17% but in both cases
allocated object are very similar. When frozen string literals are introduced a
radical change can be appreciated, garbage collection invocations and object
allocations are reduced by 80%.


# Conclusion

Ruby 2.3 comes with some performance improvements out of the box adding an extra
speed up when frozen string literals are being used.

This could be seen as a small change but for sure it will serve as the foundation
of a greater one.

This could be a first step into immutable objects in Ruby.


[1]: http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/71450
[2]: https://bugs.ruby-lang.org/issues/8976#note-41
[3]: https://en.wikipedia.org/wiki/Immutable_object

https://bugs.ruby-lang.org/issues/11473
https://bugs.ruby-lang.org/issues/8976
