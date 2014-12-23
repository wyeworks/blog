---
layout: post
title: Gravatars in Mephisto (article's title included)
category: Gravatars
hero_image: /images/heros/post-high.jpg
comments: true
author:
  name: José Costa
  email: jose@wyeworks.com
  twitter_handle: joseicosta
  github_handle:  joseicosta
  image:  /images/team/jose.jpg
  description: Cofounder & CEO at WyeWorks. Fitness aficionado. Home Barista wannabe.
published: true
---
**Goal:** I just want to see the gravatars not only for comments but in the article's title also.

I have no prior knowledge of Mephisto (this is my second day with it) nor Liquid.
So, here is how i did it ... may be far from perfect but it seems to pull it off:
### Comments, easy:

There is already a method <code>gravatar</code> that receives a hash with the comment properties and does the trick.
So, placing the following line in the right spot of the appropriate liquid file (for me that's the _article.liquid file) should be enough:

<!--more-->

{% codeblock %}{{ comment | gravatar:50,'avatar'' }}{% endcodeblock %}

### Articles are a little more tricky

Since there is no support in for gravatars for article's author i've coded a simple initializer to add a new method for this purpose and keep the original code as clean as possible. This initializer adds the method <code>gravatar_for_article</code> to the UrlFilters module.

{% codeblock %}module UrlFilters
 
   def gravatar_for_article(article, size=80, default=nil)
     article = Article.find article["id"]
     gravatar({'author_email' => article.user.email,
                     'author' => article.user.login},size,default)
   end
   
 end
{% endcodeblock %}

The code above creates a new hash from some of the article's properties to mock the comment structure and passes it to the original <code>gravatar</code> method.
Now, place the following line inside the article's header and voilá.

{% codeblock %}{{ article | gravatar_for_article :60,'avatar' }}{% endcodeblock %}

Style it and you're done.
