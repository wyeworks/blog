---
layout: post
title: Twenty Reasons I Love Ruby
hero_image: /blog/images/heros/post-high.jpg
comments: true
author:
  name: Sebastián Martínez
  email: sebastian@wyeworks.com
  twitter_handle: smartinez87
  github_handle:  smartinez87
  image:  /images/team/sebastian-martinez.jpg
  description: VP of Engineering at WyeWorks. Ruby on Rails hacker. ExceptionNotification maintainer. Coffee & bacon lover.
published: true
---
Inspired by Hal Fulton's article [Thirty-seven Reasons I Love Ruby(Thirty-seven Reasons I Love Ruby)](http://rubyhacker.com/ruby37.html), i'd like to share my top twenty reasons I love Ruby.

1. **It's object-oriented.** What does that mean? Well, for every ten programmers, there are twelve opinions as to what OOP is. I will leave it your judgment. But for the record, Ruby does offer encapsulation of data and methods within objects and allows inheritance from one class to another; and it allows polymorphism of objects. Unlike some languages (like C++ for instance) Ruby was designed from the beginning to be object-oriented.

<!--more-->

1. **It's a pure OOP language.** Am I being redundant? I don't think so. By this I mean that everything, including primitive data types such as strings and integers, is represented as an object. There is no need for wrapper classes such as Java has. And in addition, even constants are treated as objects, so that a method may be invoked with, for example, a numeric constant as a receiver.
1. **It's a dynamic language.** For people only familiar with more static languages such as C++ and Java, this is a significant conceptual leap. It means that methods and variables may be added and redefined at runtime. It obviates the need for such features as C's conditional compilation (*#ifdef*), and makes possible a sophisticated reflection API. This in turn allows programs to become more "self-aware" -- enabling runtime type information, detection of missing methods, hooks for detecting added methods, and so on. 
1. **It's an interpreted language.** This is a complex issue, and deserves several comments. It can be argued that performance issues make this a negative rather than a positive. To this concern, I reply saying that a rapid development cycle is a great benefit, and it is encouraged by the interpreted nature of Ruby. 
1. **It understands regular expressions.** For years, this was considered the domain of UNIX weenies wielding clumsy tools such as **grep** and *sed*, or doing fancy search-and-replace operations in *vi*. Perl helped change that, and now Ruby is helping, too. More people than ever recognize the incredible power in the super-advanced string and text manipulation techniques. 
1. **It's multi-platform.** It runs on Linux and other UNIX variants, the various Windows platforms, BeOS, and even MS-DOS.
1. **It's derivative.**  Is this a good thing? Outside of the literary world, yes, it is. Isaac Newton said, "If I have seen farther than others, it is because I stood on the shoulders of giants." Ruby certainly has stood on the shoulders of giants. It borrows features from Smalltalk, CLU, Lisp, C, C++, Perl, Kornshell, and others. The principles I see at work are: 1. Don't reinvent the wheel. 2. Don't fix what isn't broken. 3. Finally, and especially: Leverage people's existing knowledge. You understand files and pipes in UNIX? Fine, you can use that knowledge. You spent two years learning all the **printf** specifiers? Don't worry, you can still use *printf*. You know Perl's regex handling? Good, then you've walked a way in Ruby path too.
1. **It has a smart garbage collector.** Routines like **malloc** and **free** are only last night's bad dream. You don't even have to call destructors. Enough said.
1. **It's a scripting language.** Don't make the mistake of thinking it isn't powerful because of this. It's not a toy. It's a full-fledged language that happens to make it easy to do traditional scripting operations like running external programs, examining system resources, using pipes, capturing output, and so on.
1. **It's open-source.** You want to look at the source code? Go ahead. Want to suggest a patch? Go ahead. You want to connect with a knowledgeable and helpful user community, including the language creator himself? You can. Welcome on board.
1. **It has an advanced Array class.** Arrays are dynamic; you don't have to declare their size at compile-time as in, say, Pascal. You don't have to allocate memory for them as in C, C++, or Java. They're objects, so you don't have to keep up with their length; it's virtually impossible to "walk off the end" of an array as you might in C. Want to process them by index? By element? Process them backwards? Print them? There are methods for all these. Want to use an array as a set, a stack, or a queue? There are methods for these operations, too. Want to use an array as a lookup table? That's a trick question; you don't have to, since we have hashes for that.
1. **It's extensible.** You can write external libraries in Ruby or in C. In addition, you can modify the existing classes and objects at will, on the fly.
1. **It uses punctuation and capitalization creatively.** A method returning a Boolean result (though Ruby doesn't call it that) is typically ended with a question mark, and the more destructive, data-modifying methods are named with an exclamation point. Simple, informative, and intuitive. All constants, including class names, start with capital letters. All object attributes start with an @ sign. Again, simple.
1. **It pays attention to detail.** Synonyms and aliases abound. You can't remember whether to say **size** or **length** for a string or an array? Either one works. For ranges, is it **begin** and **end*, or *first** and *last*? Take your pick. You spell it *indices*, and your evil twin spells it *indexes*? They both work.
1. **It has a debugger.** In a perfect world, we wouldn't need debuggers. This is not a perfect world.
1. **It is concise.** There are no superfluous keywords such as Pascal's **begin*, *then** after **if*, *do** after *while*. Variables need not be declared, as they do not have types. Return types need not be specified for methods. The return keyword is not needed; a method will return the last evaluated expression. On the other hand... it is not so cryptic as C.
1. **It is expression-oriented.** You can easily say things like *x = if a &lt; 0*.
1. **It has powerful string handling.** If you want to search, substitute, justify, format, trim, delimit, interpose, or tokenize, you can probably use one of the built-in methods. If not, you can build on them to produce what you need.
1. **It has few exceptions to its rules.** The syntax and semantics of Ruby are more self-consistent than most languages. Every language has oddities, and every rule has exceptions; but Ruby has fewer than you might expect.
1. **It is laced with syntax sugar.** (To paraphrase Mary Poppins: A spoonful of syntax sugar helps the semantic medicine go down.) If you want to iterate over an array x by saying *for a in x*, for example, you can.
