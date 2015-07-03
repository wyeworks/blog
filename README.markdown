# Intro

This is the repo for wyework's blog. It's based on [Octopress](http://octopress.org/docs/) and modified considerably.


# Blogging

These are the no nonsense instructions to get you right into blogging, assuming you're a part of wyeworks's team (if you're not, you can [contact us](http://www.wyeworks.com/), we're always looking)


## Installing

```
git clone git@github.com:wyeworks/blog.git
cd blog/
bundle install
npm install
npm install -g gulp
rake generate
rake preview
```

Now you can preview the blog at `http://localhost:4000/blog`


## Create a new post

To generate a new post:

```
rake new_post['title of your post','diego_acosta']
```

The second parameter is the author of the blog post. Values for this are loaded from authors.rb, the current authors you can choose from are:

```
diego_acosta
juan_manuel_azambuja
jorge_bejar
jose_ignacio_costa
marcelo_dominguez
santiago_ferreira
sebastian_gonzalez
sebastian_martinez
gabriel_montero
adrian_mugnolo
santiago_pastorino
gonzalo_undefined
```

You can omit this parameter for blank author data or you can edit authors.rb to add/modify author data.


## Writing the content

if in the last step you had typed `rake new_post['title of your post','diego_acosta']` then you are going to find out there's a new file at `source/_posts/2015-01-04-title-of-your-post.markdown` (whose date will change according to your own time situation)

If we open this file, we'll find this:

```
---
layout: post
title: "title of your post"
category: 
date: 2015-01-04 21:51:00 -0200
comments: true
author:
  name: Diego Acosta
  email: acostami@gmail.com
  twitter_handle: acostami
  github_handle: acostami
  image: /images/team/diego-acosta.jpg
  description: 
---

Initial content and excerpt that will be shown in the posts listing

<!--more-->

Rest of the post content

{% codeblock lang:ruby %}
puts 'some ruby code'
{% endcodeblock %}

{% codeblock lang:css %}
#some-css {
  color: red;
}
{% endcodeblock %}
```

In between `---` you'll find the the [Front Matter](http://jekyllrb.com/docs/frontmatter/) block that has all the post metadata.

Now add the category for the post (Examples: Ruby, Rails, Javascript, Ember, Management, Vim, etc.)

If you want to preserve the post as draft (avoid generation when publishing), add `published: false`

Each post can be accompanied by a Hero Banner (1280x784 recommended) whose url is specified in the `hero_image` property and whose file you'll have to add to `source/images/heros/`. You can omit this attribute if you don't wish to include a Hero Banner.

After the metadata you'll find some placeholder content that shows us the usage for the `<!--more-->` comment to specify a post excerpt. This excerpt will appear in the landing, and the excerpt and everything after it will appear in the post page.

Now we can get right into writing our content in plain old [Markdown](http://daringfireball.net/projects/markdown/)!

If you wish to include code snippets (and who wouldn't) you can use `{% codeblock %}` [liquid tags](http://docs.shopify.com/themes/liquid-documentation/basics#tags), with an optional lang parameter. [Here is a list of available languages](http://pygments.org/docs/lexers/). For more ways to include code, [check the Octopress docs on the subject](http://octopress.org/docs/blogging/code/).

Make sure to preview your blog post by typing `rake preview` and checking `http://localhost:4000/blog`


## Deploying


To generate the static site, type:

```
rake generate
```

And to upload:

TODO: Update readme to add upload steps
