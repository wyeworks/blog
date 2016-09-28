---
layout: post
title: "What the tag? Episode 1 - The Document object"
category: html
comments: true
author:
  name: 'Federico Kauffman'
  email: 'federico@wyeworks.com'
  twitter_handle: 'fedekauffman'
  github_handle: 'fedekau'
  image: '/images/team/federico-kauffman.jpg'
  description: "Developer working with Ruby and Ember, passionate about technology, robotics and crossfit (Yes, I\'am crazy)."
---

Twenty three years ago, as I was learning to walk, something more important was going on, something that has been part of the technology we use every day, something that pretty much brought us to where we are today (in terms of web development): HTML's birth!

In this series we’ll dig into the DNA of modern HTML (or as the people at [WHATWG](https://whatwg.org/) call it, [The Living Standard](https://html.spec.whatwg.org/multipage/dom.html)). We will identify and explore things that are unusual or unknown (just because nobody was told about them).

<!--more-->

I've been working with HTML for 2 years, but I am pretty sure I’m going to learn just as much as others through this adventure, so don't worry; if you just started coding and you feel that your sites still look like [the world's worst website ever](http://www.theworldsworstwebsiteever.com/), the important thing is that we will improve.

# The Document object

The DOM (Document object model) standard defines a [Document](https://dom.spec.whatwg.org/#interface-document) interface, which has many attributes and functions that allow you to interact with and get to know more about the document you are working with.

**Please right click this website, click inspect, go to the console tab and try the things we learn as you read along. You won't be breaking anything!**

## Resource metadata management

`document.referrer`

This attribute returns the URL of the document from which the user navigated to the current one, or an empty string if there is no such information (for example if you typed the current URL directly) or if this information was blocked using the `noreferrer` link type.

`document.cookie`

Using cookies is a very common thing these days. If you are not using them on your websites, most likely someone is using them on you. The cookie property is used to store the HTTP cookies, containing user information, for the current document. This can be set by you or it can be set automatically by the browser.
In the following example, we use it to store the *name* and *lastname* of a person along with a *session_id*.

```js
document.cookie = "name=John; lastname=Doe, session_id=wekrj2k3jk23j5kwjf";
```

In some cases it will throw an error. See the [definition of the cookie](https://html.spec.whatwg.org/multipage/dom.html#dom-document-cookie) for more info.

`document.lastModified`

It informs you as to when the document was last modified. This info is retrieved from the server response. In the case that this info is not available, the current time in the local timezone is returned.

`document.readyState`

This read-only attribute is a very important and useful one. It holds the current state of the document, of which there are three different ones:

**loading**
When the document has not finished loading (the response from the server is not yet complete).

**interactive**
When the first load is done and the parsing process is complete but there are some resources that still need to be loaded, such as images, styles, javascript, etc.

**complete**
When all related resources are loaded. Once this state is achieved, the `load` event will be triggered.

Every time the value of this attribute changes, the `readystatechange` event is triggered.
This event is equivalent to the better known ones `load` and `DOMContentLoaded`. The following is an example that I borrowed from the docs of [Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState) (if you need more cool examples just visit them!).

```js
// alternative to DOMContentLoaded event
document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    initApplication();
  }
}
```

The above simply listens to the event and performs some application initialization.

## DOM tree accessors

These accessors let you interact directly with the document. By setting the values of these properties, you can modify the document and change it at will, but remember, as uncle Ben once said:
> With great power comes great responsibility.

`document.head`

This returns the head element, and it is a read-only attribute. The head element contains the metadata for the document, including the title, styles and scripts.

`document.title`

This attribute is a very simple one. It lets you retrieve the title of the document or set it. And yes, the title is the thing that is printed on a browser tab.

`document.body`

This is probably where most of your website's HTML is. Here, you can access the code directly and change it. I invite you to try and break this website. Research `innerHTML`, and then in case you succeed just refresh the site.

`document.images`

Using this, you can retrieve a list of all images in the document, but it is read-only. It is just an easy way to access these kinds of elements. You can affect it indirectly by modifying the document and adding more images. There are other accessors similar to this one. Take a look at the [definition of the images attribute](https://html.spec.whatwg.org/multipage/dom.html#dom-document-images).

`document.getElementsByName(name)`

This queries the document and returns a list of elements where the attribute name is set to *name*. So, if you have something like the code below and you do `document.getElementsByName('up')` you’ll get only the input elements with *name* equal to *up*. It’s as simple as that!

{% codeblock lang:html %}
{% raw %}
<form>
  <input type="checkbox" name="up">
  <input type="checkbox" name="down">
</form>
{% endraw %}
{% endcodeblock %}


`document.currentScript`

This will simply return the *script* element that is being processed by the browser. The scripts that will be returned include only the [classic scripts](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script). Once again, thanks to our friends at Mozilla for the [example](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript). In the case below, the script uses the *currentScript* attribute to identify the mode in which it is being executed.That could come in handy when doing some initialization.

```js
if (document.currentScript.async) {
  console.log("Executing asynchronously");
} else {
  console.log("Executing synchronously");
}
```

# What did we learn today?

* The Living Standard has documented all of these things. I invite you to read it. I myself have learned a bunch by doing so!
* Also, there is the [Mozilla Developer Network](https://developer.mozilla.org/en-US/) where you can find many resources. Check it out!
* Documents have states and can be "linked" with the `referrer` attribute.
* You can easily get the current script just by using `document.currentScript`.
* Extra: Take a look at the [Referrer spoofing attack](https://en.wikipedia.org/wiki/Referer_spoofing).

See you in the next episode, where we will be covering
[elements](https://html.spec.whatwg.org/multipage/dom.html#elements).
