---
layout: post
title: Method missing to simplify queries to an external service
category: Ruby
author:
  name: José Costa
  email: jose@wyeworks.com
  twitter_handle: joseicosta
  github_handle:  joseicosta
  image:  /images/team/jose.jpg
  description: Description of self
published: true
---
I know there are several discussions on the usage of method_missing in Ruby.
In this post i'll present a pretty simple, yet useful solution that uses method_missing to interact with the [Brightcove Media Read API(Getting Started with the Media API)](http://support.brightcove.com/en/docs/getting-started-media-api) (you don't need to be familiar with this service, i'll explain a little bit in the next few lines). 

<!--more-->

[Brightcove Media Read API(Getting Started with the Media API)](http://support.brightcove.com/en/docs/getting-started-media-api) accepts calls of the form:

<pre><code>http://api.brightcove.com/services/library?command=find_all_videos
&token=0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.

http://api.brightcove.com/services/library?command=find_related_videos
&video_id=123123&token=0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.

http://api.brightcove.com/services/library?command=find_videos_by_text
&text=sometextsample&pageSize=100&token=0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.</code></pre>

A token must be passed on each call, and you could also add more parameters like you would do in a regular GET request.
What comes back is a JSON string that can be easily picked up.

The key thing here is to notice that there are several commands you could execute from the [API](http://docs.brightcove.com/en/media/#Video_Read), naturally each with its own name that must be specified in the request right after [command=". Since the "API](http://docs.brightcove.com/en/media/#Video_Read) also provides a set of error codes to address all wrong requests or non-existent commands requests, we simply wanted to forward all the calls to the [API](http://docs.brightcove.com/en/media/#Video_Read) and reply back with its answer. So, in order to avoid defining all [API](http://docs.brightcove.com/en/media/#Video_Read) methods in our Ruby module, we just used the method_missing and forwarded all calls to it, using the name of the method as the [API](http://docs.brightcove.com/en/media/#Video_Read) command. 

The idea was that a call like:

<pre><code>http://api.brightcove.com/services/library?command=find_videos_by_user_id
&user_id=34876423&token=0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.</code></pre>

became just:

<pre><code>Brightcove::ReadProxy.find_videos_by_user_id :user_id => 34876423</code></pre>

We then implemented what we called the Brightcove::ReadProxy in a few lines like shown below:

<pre><code>module Brightcove
  module ReadProxy

    TOKEN = '0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.'
    SITE = 'http://api.brightcove.com/services/library'

    def self.method_missing(method_id, *args)
      args[0] ||= { }
      args[0].merge!({ :command => method_id, :token => TOKEN })
      get SITE, args[0]
    end

    def self.get(url, params)
      http_client = HTTPClient.new
      result = http_client.get(url, params)
      content = nil
      begin
        content = JSON.parse(result.content)
      rescue Exception => e
        Rails.logger.error e.message
      end
      return content
    end
 
 end</code></pre>

Basically all the magic relies in the method_missing that would convert any call to the Brightcove::ReadProxy module in the format accepted by the [API](http://docs.brightcove.com/en/media/#Video_Read), without having to define every [API](http://docs.brightcove.com/en/media/#Video_Read) method and maintaining the Rails like finders syntax.
We also used the httpclient gem to simplify the GET request calls and the json gem to parse the result of the call.

I'm not saying that this is the best usage, but i think in this particular situation it suits pretty well.

What do you think?
 
