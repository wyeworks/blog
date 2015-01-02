---
layout: post
title: Drag & Drop Sortable Lists
category: Ruby
hero_image: /images/heros/post-high.jpg
comments: true
author:
  name: Sebastián Martínez
  email: sebastian@wyeworks.com
  twitter_handle: smartinez87
  github_handle:  smartinez87
  image:  /images/team/sebastian.jpg
  description: VP of Engineering at WyeWorks. Ruby on Rails hacker. ExceptionNotification maintainer. Coffee & bacon lover.
published: true
---
Time has come for us to make a sortable list, and let's face it, drag&drop are the prettiest ones. So, let me explain how to proceed.

Suppose you have a playlist with many videos, and want to establish an order on which they will be played. First thing you will need is to add a 'position' attribute to your Video model. To do that, we'll generate a migration first:

<!--more-->

{% codeblock %}script/generate migration add_position_to_videos position:integer
{% endcodeblock %}

Now just run *rake db:migrate*.

<h3> View Code </h3>
First thing you need to make sure, is that you have the prototype and scriptaculous libraries in your application. Now let's see how your **index.html.erb** file should look like

{% codeblock lang:erb %}   <h1>Videos</h1>  
   <ul id="videos">  
     <% @videos.each do |video| %>  
       <% content_tag_for :li, video do %>  
         <%= link_to video.name, video_path(video) %>  
       <% end %>  
     <% end %>  
   </ul>  
   <%= link_to "New Video, new_video_path %>  
{% endcodeblock %}

Now all we have to do to make the list sortable is add the sortable_element helper method to the index view. You need to pass it the id of the element you want to be sortable, and a URL that is called via an AJAX request so that the updated positions can be stored in the database.

{% codeblock lang:erb %}   <%= sortable_element('videos', :url => 'sort_videos_path') %>  
{% endcodeblock %}

The videos in the list can now be dragged and dropped, but the new order isn’t persisted back to the database.
So let's code the sort method in the videos_controller.rb

{% codeblock lang:ruby %}   def sort  
     params[:videos].each_with_index do |id, index|  
       Video.update_all([’position=?’, index+1], [’id=?’, id])  
     end  
     render :nothing => true  
   end  
{% endcodeblock %}

And that's it. We are now updating the position of the videos.
Most probably, we would want now our videos to be shown in the index in the correct order, so we just need to touch the index method on the controller a bit.

{% codeblock lang:ruby %}   def index  
     @videos = Video.all(:order => ’position’)  
   end  
{% endcodeblock %}

At this point we are almost set to go...did you guess what's missing? Yes, we need to add the route to the sort method :)

{% codeblock lang:ruby %}   map.resources :videos, :collection => { :sort => :post}  {% endcodeblock %}

The line above adds the new action and makes it a POST request, which is the type that our AJAX call uses when making XMLHTTP requests.
And that's pretty much it. Now you have a fully functional sortable list of videos.

There are some more tricks we can use to improve this, for example, the **sortable_element** helper receives one option called 'handle'. What's this? The way to specify the draggable area of the element. This I think is the most used one. Let's give it a try:

We should first add a span tag on the index view:
{% codeblock lang:erb %} <% content_tag_for :li, video do %>  
   <span class="handle">[drag]</span>  
   <%= link_to video.name, video_path(video) %>  
 <% end %> 
{% endcodeblock %}

Note the span has a 'handle' class, and that's what you are going to set as draggable, using the :handle option:

{% codeblock lang:erb %}   <%= sortable_element(’videos’), :url => sort_videos_path, :handle => ’handle’ %>  {% endcodeblock %}

You can style this a bit with a CSS, adding a line similar to this one:
{% codeblock lang:css %} li .handle { color: #777; cursor: move; font-size: 12px; } {% endcodeblock %}

Beautiful....just beautiful...

Ok, we have this magical sortable list now, but we added a 'position' field to videos...we can handle this manually when creating or updating the videos, or we can use the **acts_as_list** plugin, which I recommend.
Just install it by typing {% codeblock %}script/plugin install git://github.com/rails/acts_as_list.git{% endcodeblock %} in your console.
All configuration this needs to work is to add **acts_as_list** in our model, that should look like this:

{% codeblock lang:ruby %}   class Video < ActiveRecord::Base  
     acts_as_list  
   end  
{% endcodeblock %}

Congrats!!! Enjoy your sortable list !!!
