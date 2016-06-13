---
layout: post
title: 'Using "async" and "await" with ember-cli-page-object'
category: 
date: 2016-06-13 10:40:43 -0300
comments: true
author:
  name: Santiago Ferreira
  email: santiago.ferreira@wyeworks.com
  twitter_handle: san650
  github_handle: san650
  image: /images/team/santiago-ferreira.jpg
  description: 
---

TC39 has a [proposal](https://tc39.github.io/ecmascript-asyncawait/) for adding async functions to ECMAScript. This new language feature is very useful for working with the promise pattern that is heavily used in Ember's acceptance tests.

<!--more-->

Babel supports async functions through a _polyfill_ which _transpiles_ the `async` and `await` keywords into valid ES5 JavaScript. Before starting to use the new `async` and `await` keywords we need to tell ember-cli to include the Babel polyfills.

_ember-cli-build.js_

{% codeblock lang:js %}
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    babel: {
      includePolyfill: true
    }
  });

  return app.toTree();
};
{% endcodeblock %}

Now you can start using `async` and `await` keywords in your project, specially in your acceptance tests.

Imagine that we have the following acceptance test:

{% codeblock lang:js %}
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { create, clickable, fillable, text, visitable } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/login'),
  userName: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  message: text('.message')
});

test('validates invalid credentials', function(assert) {
  page
    .visit()
    .userName('john doe')
    .password('wrong password')
    .submit();

  andThen(function() {
    assert.equal(page.message, 'Invalid user name or password');
  });

  page
    .password('secret')
    .submit();

  andThen(function() {
    assert.equal(page.message, 'Welcome back John Doe');
  });
});
{% endcodeblock %}

You can update this test to use the `async` and `await` keywords as follows

{% codeblock lang:js %}
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { create, clickable, fillable, text, visitable } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/login'),
  userName: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  message: text('.message')
});

test('validates invalid credentials', async function(assert) {
  await page
    .visit()
    .userName('john doe')
    .password('wrong password')
    .submit();

  assert.equal(page.message, 'Invalid user name or password');

  await page
    .password('secret')
    .submit();

  assert.equal(page.message, 'Welcome back John Doe');
});
{% endcodeblock %}

As you can see [ember-cli-page-object](https://github.com/san650/ember-cli-page-object)'s actions support the `await` keyword, even if you chain multiple actions. Also note that you have to mark the test function as asynchronous `async function(assert)`.

Take a look at [this commit](https://github.com/san650/tajpado/commit/6638a26564e41f3503886dbe36bf860b2f6d7ac1) of the [tajpado](https://github.com/san650/tajpado) project to see how we upgraded the project to start using `async` and `await` in the test suite.
