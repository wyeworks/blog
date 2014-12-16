---
layout: post
title: Paperclip file rename
category: Ruby
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle:  spastorino
  image:  /images/team/santiago.jpg
published: true
---
While developing an application with Sebastián that allow users to upload videos with some file name restrictions, meaning that it must contain only A-Z and 0-9 digits, underscores (_) as a valid component as well, and also the name must be preceded by it's own #id, we came up with the need of applying this custom filter to each uploaded video.
After doing some research on paperclip source code and internet tutorials, we suggest the following solution:

<pre><code>class Video < ActiveRecord::Base
  has_attached_file :video,
    :path => ":rails_root/public/system/:attachment/:id/:style/:normalized_video_file_name",
    :url => "/system/:attachment/:id/:style/:normalized_video_file_name"

  Paperclip.interpolates :normalized_video_file_name do |attachment, style|
    attachment.instance.normalized_video_file_name
  end

  def normalized_video_file_name
    "#{self.id}-#{self.video_file_name.gsub( /[^a-zA-Z0-9_\.]/, '_')}"
  end
end</code></pre>

What are we doing here? Easy, in **has_attached_file** we edit the way paperclip returns the **path** and **url** by default, the most relevant components when saving and loading the file in order to display it.
Paperclip default values are:
<pre><code>path default => ":rails_root/public/system/:attachment/:id/:style/:filename"
url default => "/system/:attachment/:id/:style/:filename"</code></pre>

Values preceded by  ':' are the standard interpolations paperclip has. For further information on this visit [http://wiki.github.com/thoughtbot/paperclip/interpolations(Interpolations)](http://wiki.github.com/thoughtbot/paperclip/interpolations.)

What we did was change **:filename** with **:normalized_video_file_name** in both path and url, being the second a custom interpolation and then added the 'normalized_video_file_name' method to video.rb.

By doing this we not only achieve a way for paperclip to handle the file by this normalized way, but also have a method to access the normalized file name, plus being able to access the original file name through paperclip video_file_name method.

So remember on video_file_name you have the uploaded filename and on normalized_video_file_name you have the server filename.
