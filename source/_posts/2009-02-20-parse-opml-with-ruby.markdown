---
layout: post
title: Parsing an OPML with Ruby
category: Ruby
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
And Ruby just doesn't stop surprising us!!
In the past we have to deal with XML files and parse them, incredibly easy task using Hpricot library. Now the turn was for [OPML(OPML)](http://en.wikipedia.org/wiki/OPML) (Outline Processor Markup Language) files. In case you are not familiar with this type of files, its most common use is to exchange lists of web feeds between web feed aggregators.

<!--more-->

We found this function to parse the OPML document recursively preserving its structure in the [desktop weblog(desktop weblog)](http://dekstop.de/weblog/), that does the job of extracting the feeds, and modified it a bit. Now it returns a hash containing the title of the articles as keys, and its links as values.

Here's the function:
{% codeblock lang:ruby %}def self.parse_opml(opml_node, parent_names=[])
    feeds = {}
    opml_node.elements.each('outline') do |el|
      if (el.elements.size != 0)
        feeds.merge!(parse_opml(el, parent_names + [el.attributes['text']]))
      end
      if (el.attributes['xmlUrl'])
        feeds[el.attributes['title']] = el.attributes['xmlUrl']
      end
    end
    return feeds
  end{% endcodeblock %}

All you have to do is call it this way:
{% codeblock lang:ruby %}require 'rexml/Document'

opml = REXML::Document.new(File.read('my_feeds.opml'))
feeds = parse_opml(opml.elements['opml/body']){% endcodeblock %}


Pretty easy, huh? Try it out and leave your comments...

