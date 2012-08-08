---
layout: post
title: Making Paperclip work with Sinatra & Datamapper
categories:
- ruby
tags:
- datamapper
- paperclip
- sinatra
author: sebastian.martinez
published: true
date: 2010-02-10 00:01:00.000000000
---
I was working lately on a Sinatra project, and got fascinated on how fast you can get things up and running.
Everything was beautiful, until I tried to upload a file using paperclip.

Although Paperclip was originally built for rails [Ken Robertson](http://invalidlogic.com/dm-paperclip/) ported it to Datamapper.
Let me explain in few steps how you can upload with Paperclip, using Datamapper.

Start declaring your model like this:
<pre><code>class Resource
  include DataMapper::Resource
  include Paperclip::Resource

  property :id,     Serial

  has_attached_file :file,
                    :url => "/system/:attachment/:id/:style/:basename.:extension",
                    :path => "#{APP_ROOT}/public/system/:attachment/:id/:style/:basename.:extension"
end
</code></pre>

You'll need to specify your :url and :path options as the ones built into dm-paperclip are merb centric which won't quite work. Also set APP_ROOT to where ever your application root directory with your static Sinatra folder is.

Now your routes should look something like this:
<pre><code>post '/upload' do
  resource = Resource.new(:file => make_paperclip_mash(params[:file]))
  halt "There were some errors processing your request..." unless resource.save
end
</code></pre>

And there's the tricky part, on the **make_paperclip_mash** method.
Paperclip expects the file object loaded from the form to be in a different form than what is created by default. To fix this you should create a Mash (which is just a Hash, unless you're actually using merb):

<pre><code>def make_paperclip_mash(file_hash)
  mash = Mash.new
  mash['tempfile'] = file_hash[:tempfile]
  mash['filename'] = file_hash[:filename]
  mash['content_type'] = file_hash[:type]
  mash['size'] = file_hash[:tempfile].size
  mash
end
</code></pre>

And that's it, now you can upload files using Paperclip right on your Sinatra app with Datamapper.
You can check out the code of this example at: [sinatra_paperclip.rb](http://gist.github.com/291877)

