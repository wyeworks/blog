---
layout: post
title: Wildcard search with Thinking Sphinx
category: Ruby
hero_image: /images/heros/post-high.jpg
comments: true
author:
  name: José Costa
  email: jose@wyeworks.com
  twitter_handle: joseicosta
  github_handle:  joseicosta
  image:  /images/team/jose-ignacio-costa.jpg
  description: Cofounder & CEO at WyeWorks. Fitness aficionado. Home Barista wannabe.
published: true
---
Right after starting with [Thinking Sphinx(Thinking Sphinx plugin)](http://ts.freelancing-gods.com/), it was quite hard to find a concise guide on how to enable wildcard search.
For those out there who might not know, [Sphinx(Sphinx  free open-source SQL full-text search engine)](http://www.sphinxsearch.com/) searches default to matching whole words, not partial ones, so you won’t get any results of you search, for example, for one letter or part of a name. So, how to get around this?? .. well .. [Sphinx(Sphinx  free open-source SQL full-text search engine)](http://www.sphinxsearch.com/) provides wildcard search and below is how you can enable this with [Thinking Sphinx(Thinking Sphinx plugin)](http://ts.freelancing-gods.com/)

<!--more-->

## How wildcard search works in Sphinx?

There are basically three settings that rule the wildcard search world:
* enable_star
* min_prefix_len
* min_infix_len

**enabled_star is required plus one of the other two for settings for enabling either prefix or infix search (can't have both, at least on the same index).**

### enable_star

This settings enables "star-syntax", or wildcard syntax (means that '&#42;' can be used at the start and/or end of the keyword), when searching through indexes which were created with prefix or infix indexing enabled. The star will match zero or more characters.

It only affects searching; so it can be changed without reindexing by simply restarting searchd.

For example, assume that the index was built with infixes and that enable_star is 1. Searching should work as follows:

1. "abcdef" query will match only those documents that contain the exact "abcdef" word in them.
1. "abc&#42;" query will match those documents that contain any words starting with "abc" (including the documents which contain the exact "abc" word only);
1. "&#42;cde&#42;" query will match those documents that contain any words which have "cde" characters in any part of the word (including the documents which contain the exact "cde" word only).
1. "&#42;def" query will match those documents that contain any words ending with "def" (including the documents that contain the exact "def" word only).

### min_prefix_len

Minimum word prefix length to index. Optional, default is 0 (do not index prefixes). 
For instance, indexing a keyword "example" with min_prefix_len=3 will result in indexing "exa", "exam", "examp", "exampl" prefixes along with the word itself. Searches against such index for "exam" will match documents that contain "example" word, even if they do not contain "exam" on itself.  Too short prefixes (below the minimum allowed length) will not be indexed.

### min_infix_len

Infix indexing allows to implement wildcard searching by 'start&#42;', '&#42;end', and '&#42;middle&#42;' wildcards. When mininum infix length is set to a positive number, indexer will index all the possible keyword infixes (ie. substrings) in addition to the keywords themselves. Too short infixes (below the minimum allowed length) will not be indexed.

For instance, indexing a keyword "test" with min_infix_len=2 will result in indexing:

* "te"
* "es"
* "st"
* "tes"
* "est" 

infixes along with the word itself. Searches against such index for "es" will match documents that contain "test" word, even if they do not contain "es" on itself. 

## Drawbacks :(

Indexing prefixes will make the index grow significantly (because of many more indexed keywords), and will degrade both indexing and searching times. 
Also, there's no automatic way to rank perfect word matches higher in a prefix index, but there's a number of tricks to achieve that (setup to indexes or extended-mode queries. Read more [here](http://www.sphinxsearch.com/docs/current.html#searching).)

## Show me some code!

So, here it's how you can set a wildcard search on a particular index for any of your models. In this case i'm setting an infix search.

{% codeblock lang:ruby %}class Article < ActiveRecord::Base
  ....
  ....

  define_index do
    indexes title, body, author
    set_property :enable_star => 1
    set_property :min_infix_len => 3
  end

  ....
  ....
end{% endcodeblock %}

You can also set these properties in your sphinx.yml settings file under config/ folder for any environment you want. It might look like this:

{% codeblock lang:ruby %}production:
  enable_star: 1
  min_infix_len: 3{% endcodeblock %}

and it will apply to all of your indexes.

Re-index your data and restart the sphinx deamon (remember i'm using Thinking Sphinx, so i have a set of nice and short rake tasks to achieve this).

{% codeblock %}rake ts:stop
rake ts:in
rake ts:start{% endcodeblock %}

Now you should be able to fire searches like this:
{% codeblock %}Article.search "Sphinx"
Article.search "Think*"
Article.search "*inx*"
{% endcodeblock %}

And many more cool stuff that's beyond the scope of this post :)
Enjoy!

