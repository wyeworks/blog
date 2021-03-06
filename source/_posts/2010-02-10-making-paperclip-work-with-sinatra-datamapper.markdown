---
layout: post
title: Making Paperclip work with Sinatra & Datamapper
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
I was working lately on a Sinatra project, and got fascinated on how fast you can get things up and running.
Everything was beautiful, until I tried to upload a file using paperclip.

Although Paperclip was originally built for rails Ken Robertson ported it to Datamapper.
Let me explain in few steps how you can upload with Paperclip, using Datamapper.

<!--more-->

Start declaring your model like this:
{% codeblock lang:ruby %}class Resource
  include DataMapper::Resource
  include Paperclip::Resource

  property :id,     Serial

  has_attached_file :file,
                    :url => "/system/:attachment/:id/:style/:basename.:extension",
                    :path => "#{APP_ROOT}/public/system/:attachment/:id/:style/:basename.:extension"
end
{% endcodeblock %}

You'll need to specify your :url and :path options as the ones built into dm-paperclip are merb centric which won't quite work. Also set APP_ROOT to where ever your application root directory with your static Sinatra folder is.

Now your routes should look something like this:
{% codeblock lang:ruby %}post '/upload' do
  resource = Resource.new(:file => make_paperclip_mash(params[:file]))
  halt "There were some errors processing your request..." unless resource.save
end
{% endcodeblock %}

And there's the tricky part, on the **make_paperclip_mash** method.
Paperclip expects the file object loaded from the form to be in a different form than what is created by default. To fix this you should create a Mash (which is just a Hash, unless you're actually using merb):

{% codeblock lang:ruby %}def make_paperclip_mash(file_hash)
  mash = Mash.new
  mash['tempfile'] = file_hash[:tempfile]
  mash['filename'] = file_hash[:filename]
  mash['content_type'] = file_hash[:type]
  mash['size'] = file_hash[:tempfile].size
  mash
end
{% endcodeblock %}

And that's it, now you can upload files using Paperclip right on your Sinatra app with Datamapper.
You can check out the code of this example at: [sinatra_paperclip.rb](https://gist.github.com/smartinez87/291877)

