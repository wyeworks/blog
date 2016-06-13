---
layout: post
title: Using the Page Object pattern with Ember CLI
comments: true
author:
  name: Santiago Ferreira
  email: santiago.ferreira@wyeworks.com
  twitter_handle: san650
  github_handle:  san650
  image:  /images/team/santiago-ferreira.jpg
  description: Developer working with Ruby, JavaScript and Ember. Love working with Free Software in general. Ember and Angular meetup organizer in Montevideo
published: true
---

One of the most appealing features in Ember and Ember CLI is the ability to easily create functional or acceptance tests. But, the everyday interaction between UX and development, can hurt how these tests are maintained. Here, I try to describe an approach that helped us overcome this problem.

<!-- more -->

Let's consider a simple example. Let's assume we have a list of users and, we want to validate that a table with 2 users is rendered, so that we can later validate each user's name.

```html
<table>
  <caption>Users list</caption>
  <tbody>
    <tr>
      <td>Jane</td>
      <td>Doe</td>
    </tr>
    <tr>
      <td>John</td>
      <td>Doe</td>
    </tr>
  </tbody>
</table>
```

Ember, and more specifically `ember-testing`, provide a DSL that simplifies creation and validation of these conditions on our tests. An example of such an acceptance test in Ember would be:

```js
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('An Integration test', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('List shows two users', function(assert) {
  assert.expect(4);
  visit('/users');
  andThen(function() {
    assert.equal(find('.users caption').text(), 'Users list');
    assert.equal(find('.users tr').length, 2, 'The list contains two users');
    assert.equal(find('.users tr:first .name').text(), 'Jane');
    assert.equal(find('.users tr:last .name').text(), 'John');
  });
});
```

As we can see in the above example, after visiting the `/users` route we validate that the data shown is what we expect.

### The problem

While working on a client project, where we generate dozens of acceptance tests, we noticed that many of the CSS selectors used to look up elements were repeated across tests. In some cases, this repetition seemed like a smell.

Then, in some cases the complexity of selectors used prevented us to easily identify what we were trying to test. This can become very confusing, concealing the original purpose for the test. Take for example:

```js
assert.equal(find('.users tr:nth-of-type(3) .name'), 'John Doe');
```

Another issue was how maintainable such tests became. For every change in the HTML, no matter how big or small, we'd probably need to update many tests to make these CSS selectors match.

### The solution

Here's where a widely-used design pattern came to the rescue: Page Objects. The main idea behind this pattern is to encapsulate the page structure being tested with an object, hiding the details of its HTML structure and therefore exposing the semantic structure of the page only.

In our case, the goal was to make the intention of the test clearer, hiding the fact that the users list is an HTML table. We also wanted to make our assertions as obvious and concise as possible, easier to read and understand.

Back to our example, this is a possible implementation for a Page Object:

```js
var usersPage = {
  visit: function() {
    return visit('/users');
  },
  caption: function() {
    return find('.users caption');
  },
  usersCount: function() {
    return find('.users tr').length;
  },
  firstUserName: function() {
    return find('.users tr:first .name').text();
  },
  secondUserName: function() {
    return find('.users tr:first .name').text();
  }
};
```

Now, we can take advantage of this object and write our acceptance test in an simpler manner:

```js
test('List shows two users', function(assert) {
  assert.expect(4);
  usersPage.visit();
  andThen(function() {
    assert.equal(usersPage.caption(), 'List of users');
    assert.equal(usersPage.countUsers(), 'The list contains two users');
    assert.equal(usersPage.firstUserName(), 'Jane');
    assert.equal(usersPage.secondUserName(), 'John');
  });
});
```

As we can see, the intention of what we want to test is much clearer after applying the Page Objects pattern.

### A step further

After applying this process to our application and introducing several objects, we started to notice a few additional patterns emerging. Our team decided then to extract those into auxiliary functions, which made the creation of Page Objects even easier.

We were then motivated to extract this into an Ember CLI add-on named [ember-cli-page-object](https://github.com/san650/ember-cli-page-object), which provides a small DSL for creating Page Objects in a declarative fashion.

If using the add-on, our previous example translates into:

```js
var usersPage = PageObject.build({
  visit:          visitable('/users'),
  caption:        text('.users caption'),
  usersCount:     count('.users tr'),
  firstUserName:  text('.users tr:first .name'),
  secondUserName: text('.users tr:last .name')
});
```

A login page, for example, can be modeled like:

```js
var login = PageObject.build({
  visit:        visitable('/login'),
  userName:     fillable('#username'),
  password:     fillable('#password'),
  submit:       clickable('#login'),
  errorMessage: text('.message')
});
```

This allows to express test intentions in a cleaner way:

```js
test('Invalid log in', function(assert) {
  assert.expect(1);
  login
    .visit()
    .userName('user@example.com')
    .password('secret')
    .submit();
  andThen(function() {
    assert.equal(login.errorMessage(), 'Invalid credentials!');
  });
});
```

You can check out more examples and instructions on how to plug it into your own projects [here](https://github.com/san650/ember-cli-page-object).

For further information on the Page Object pattern, I recommend reading Martin Fowler's original description [here](http://martinfowler.com/bliki/PageObject.html), as well as the definition on the Selenium's wiki page [here](https://code.google.com/p/selenium/wiki/PageObjects).

### Getting involved

Try it out! We're always looking for ways to improve the project. You can contribute by suggesting new features, fixing bugs, improving the documentation and working on the features from the [wish list](https://github.com/san650/ember-cli-page-object/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement).
