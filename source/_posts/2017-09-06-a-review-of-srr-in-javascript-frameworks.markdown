---
layout: post
title: "A review of Server Side Rendering in Javascript frameworks"
category: javascript
comments: true
author:
  name: Jorge Bejar
  email: jorge@wyeworks.com
  twitter_handle: jmbejar
  github_handle: jmbejar
  image: /images/team/jorge-bejar.jpg
  description: Software Engineer at Wyeworks. Ruby on Rails developer.
---

The Javascript ecosystem is always moving fast, so it’s important to keep track of how everything is progressing, especially when it comes to tools and frameworks. The people at [This.Dot](https://www.thisdot.co/) produces an amazing series of webinars, called [This.Javascript](https://www.thisdot.co/javascript/09-07-2017), that discuss the latest on major Javascript frameworks and tools. This post is the first in a series of articles about topics that caught my attention after watching the latest episode.

Let's now discuss the current state of **Server Side Rendering (SSR)** in Javascript frameworks. Each of the big contenders in the ecosystem made remarkable progress in their particular SSR solutions in 2017. Moreover, the existing solutions are still improving while more and more people are using them for real stuff.

<!--more-->

When we speak about SSR in the context of client-side frameworks like **Ember**, **React**, **VueJS** or **Angular**, we are refering to the ability to produce a server response with the initial HTML instead of rendering the entire UI from scracth once the javascript code is loaded in the browser.

Server Side Rendering is important for applications relying on such frameworks when you need SEO or want to improve the performance of the initial render, among other things.

Although there are ways to implement SSR in each of the most used frameworks, the overall complexity and available tools may vary a bit. The following is a summary of what was mentioned during the latest webinar, along with some additional resources to enable you to explore more about the particular solutions.

## Ember

The Ember community is excited about the recent announcement of the release of **Ember Fastboot 1.0**. However, Fastboot is not a new kid on the block. The community already adopted this solution - under development since 2015 - prior to this first "stable version". Library maintainers, especially, were working hard to make their projects compatible with Fastboot in advance. Therefore, it was not a surprise that Ricardo Mendes, a member of the Ember core team, referred to the Fastboot release in the webinar as one of the biggest achievements made by the project.

As stated on the [official website](https://ember-fastboot.com/), Fastboot runs your Ember application over Node.js and delivers the initial HTML. It is even possible to integrate the Fastboot server into an existing Express application, by using it as middleware (see [here](https://ember-fastboot.com/docs/user-guide#the-fastboot-server)). Once loaded on the client, the application runs and the party continues in the browser. I have the feeling this solution is mature enough to make adoption occur very quickly. Moreover, good documentation is available on the Ember fastboot page, so it’s not hard to get started (assuming you are familiar with Ember).

## React

Building a solution with SSR using React is something that requires some research, since there is not much official React documentation. The React API includes an object called [ReactDOMServer](https://facebook.github.io/react/docs/react-dom-server.html), and its purpose is to render components into HTML strings. A naive approach could be to import the React application and the _react-dom-server_ module into a Node.js application and manually make it work. But sooner rather than later, you will need to learn how to work with other complimentary libraries, such as _React Router_ and _Redux_, to make them work properly within the context of application rendering on the server and client. There is specific documentation on this topic for [React Router](https://reacttraining.com/react-router/web/guides/server-rendering) and [Redux](http://redux.js.org/docs/recipes/ServerRendering.html), in case you want to know more details.

Sebastian Markbage, from the React team, commented in the webinar that they are actually focusing more now on SSR, so I would expect real improvements in the future. According to him, they are working hard on a solution for SSR, including support for streaming and async components (this is something that is still under development), as well as progressive rehydration or revival on the client side.

As a side note, it would be worth paying attention to the progress of complementary tools, such as **Next.js**. They aim to be a lightweight framework for building universal React applications. Despite being a relatively new project, they [released Next.js 3.0](https://zeit.co/blog/next3) a few days ago and the roadmap looks promising.

In any case, I'm looking forward to seeing how much will be done by the React Core team itself in the near future.

## VueJS

Evan You, author of VueJS, also dedicated a little time to mentioning improvements to his SSR solution over the last few months (**VueJS supports SSR since 2.0, which was released in September 2016**). It was interesting to find out that they are currently trying out some optimizations in this area, such as avoiding the usage of a virtual DOM while rendering Vue components into the HTTP response (plain HTML), which sounds like a nice experiment.

You can find a section in the official VueJS documentation for version 2.x dedicated to SSR. In addition, they have [another website](https://ssr.vuejs.org/en/) explaining in depth how to implement a VueJS application using SSR. The proposed solution is the glue between a Node.js server and the application code, and there is also some _magic_ done by the framework when the VueJS application loads in the browser. This process is called Hydration and it is briefly documented [here](https://ssr.vuejs.org/en/hydration.html).

Finally, it is worth mentioning that there is a community-driven project called [Nuxt](http://nuxtjs.org/) - referenced in the VueJS documentation itself - to ease the creation of universal VueJS applications. For example, it includes a [starter template](https://github.com/nuxt/starter). The existence of this project is motivated by the fact that the solution shipped with the framework is flexible but non-trivial to begin with.

## Angular

Igor Minar from the Angular team shared that the March arrival of Angular 4 included **Angular Universal**, which was initially a community effort but has now been merged into the Angular project.

Angular Universal is the intermediate piece that connects Node.js with Angular to run the same application on both the server and in the browser. You might want to check out [this example project](https://github.com/ng-seed/universal) to better understand how it works.

One thing I noticed is the lack of official documentation aside from the _ng-seed/universal_ repository. I was unable to find any reference to this topic in the Angular documentation. There is a specific website supposedly dedicated to Angular Universal ([https://universal.angular.io/](https://universal.angular.io/)), but it contains documentation about Angular 2, not the latest version.

## Conclusions

Reviewing the state of SSR within each framework reveals that this is a topic that matters. There are a lot of people hoping for enhanced solutions within the existing frameworks. Those notwithstanding, there are also promising side projects, such as Next.js and Nuxt.js (such similar names!), that are pursuing the same goal.

Frameworks that cover the entire architecture of a web application, such as Ember or Angular, are motivated to include an SSR solution in the package. However, frameworks like React or Vue.js, which focus on the user interface, also have an interest in ecosystem-appropriate solutions.

**Hope you enjoy the Javascript SSR ride!**
