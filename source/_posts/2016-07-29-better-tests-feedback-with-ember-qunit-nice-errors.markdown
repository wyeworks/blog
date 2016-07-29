---
layout: post
title: "Better tests feedback with ember-qunit-nice-errors"
category: ember
comments: true
author:
  name: Samanta de Barros
  email: samanta@wyeworks.com
  twitter_handle: sami_dbc
  github_handle: sdebarros
  image: /images/team/samanta-de-barros.png
  description: Software Engineer, currently working with Ruby and Javascript. Tea Lover.
---

As any Ember developer probably knows by now, the error messages shown by failing asserts are far from ideal. Getting a **failed, expected argument to be truthy, was: false** followed by a stack trace that points to lines on the generated test file (one file with **all** your compiled tests), can be pretty disappointing when you want to be able to get quick feedback from your tests.

One of the best practices when using QUnit is to always include an error message that explains what's the purpose of the assertion. This is a good practice but in reality it falls short, developers tend to be lazy and not include all messages, or sometimes the error message and the assertion are one to one equivalent, e.g.: `assert.equal(page.title, 'hello world', "Page title is hello world");`
Having better errors by default can help in those cases.

As part of our [Technical Thursdays'](https://wyeworks.com/blog/2015/7/16/technical-thursdays-or-how-we-do-continuous-learning/) last cycle, we set out to improve this, looking to both enhance our tests and learn more about ember-cli and its addons.

The result was [**ember-qunit-nice-errors**](https://github.com/wyeworks/ember-qunit-nice-errors), a _just add water and mix_ kinda addon.

<!--more-->

Just install it on your desired project and it will take care of all those asserts on your tests that don't have a custom message set by you. The following test:

{% codeblock lang:js %}
import { module, test } from 'qunit';

module('Unit | example test');

test('it works', function(assert) {
  assert.ok(1===3);
  assert.equal(1, 2);
});
{% endcodeblock %}

will go from giving you a message error like:

![before](/images/posts/output-before.png)

to:

![after](/images/posts/output-after.png)

The addon basically hooks up on your app's build process, and for all the asserts on the test files that don't have a custom message (since we don't want to override your work), it will add a message that tells you the assert method you're using and the params you're calling it with.

We hope this improves your quality of life! Or at least makes it easier to find those errors.
So try it out! We're always looking for feedback and ways to improve the project.
