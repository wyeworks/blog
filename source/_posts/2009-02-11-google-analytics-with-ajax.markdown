---
layout: post
title: Google Analytics with AJAX
category: Ajax
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
It's been a while since us all have been working in fully AJAX enabled sites (as is the case of [Indieoma(Indieoma)](http://indieoma.com), one of our projects). Time comes when you'd like to know a little bit about who is accessing the site, when, which page, why .. and a few more questions Google Analytics can answer for you (not particularly the last one) in a very simple manner most of you already know about. 

<!--more-->

You may encounter some issue when trying to check your stats for the AJAX requests people have made. As you can imagine, the code you place in your web pages won't execute itself on each AJAX request, but more like on each entire page load. But Google doesn't let us down and give us a tiny "explanation(
How do I track AJAX applications?)":http://www.google.com/support/analytics/bin/answer.py?hl=en&answer=55519 on how to pull this off.    

At the heart of [Indieoma(Indieoma)](http://indieoma.com) we use [Prototype(Prototype)](http://www.prototypejs.org.) So Google's tip may become more something like the code below:

{% codeblock lang:js %}
Ajax.Responders.register({
  onComplete: function(request) {
    // Assuming the ga.js code was loaded first
    pageTracker._trackPageview(request.url);
  }
});
{% endcodeblock %}

Using the [Ajax.Responders(Prototype Ajax.Responders)](http://www.prototypejs.org/api/ajax/responders), we register a function that will fire the tracker after each AJAX request has been completed. 

The <code>_trackPageview(request.url)</code> allows us to name the tracked page exactly as the requested URL. Note that you can name this page in any way you like. We chose to do so with the requested URL in this case.

So, that's it and happy analytics!
