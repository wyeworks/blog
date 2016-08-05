---
layout: post
title: "Making page objects to play nicely with ember-wormhole"
category: ember
comments: true
author:
  name: 'Santiago Ferreira'
  email: 'santiago.ferreira@wyeworks.com'
  twitter_handle: 'san650'
  github_handle: 'san650'
  image: '/images/team/santiago-ferreira.jpg'
  description: 'Developer working with Ruby, JavaScript and Ember. Love working with Free Software in general. Ember and Angular meetup organizer in Montevideo'
---

A very common problem people have while testing an ember application that uses the wonderful [ember-wormhole](https://github.com/yapplabs/ember-wormhole) addon is making the page objects to play nicely with it. In this blog post I'll try to cover some of the problems and solutions regarding this.

<!--more-->

A bit of context first, by default all page object properties lookups are done inside the Ember application's container, this means that if you try to find an element in your tests through a page object, that search will be scoped by this container, so any element outside of it won’t be found.

As you may know, one of the characteristics of ember-wormhole is the ability to render a block of code outside the application container making it unreachable using the out-of-the-box properties of ember-cli-page-object.

**Since [version 1.3.0](https://github.com/san650/ember-cli-page-object/releases/tag/v1.3.0) ember-cli-page-object has built-in support to make it work well together, specially on acceptance tests.**

As of this version, the restriction was overcome by a [new option included on all page object properties](https://github.com/san650/ember-cli-page-object/pull/168), the `testContainer ` option which accepts a CSS selector to specify a different container on where to look for the DOM elements.

Lets see an example of how to use this.

`templates/application.hbs`

{% codeblock lang:html %}
{% raw %}
{{#ember-wormhole to="destination"}}
  <button onclick={{action "clickMe"}}>Click me!</button>
{{/ember-wormhole}}

<div class=".message">
  {{message}}
</div>
{% endraw %}
{% endcodeblock %}

`controller/application.js`

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    clickMe() {
      this.set('message', 'Button clicked!');
    }
  }
});
```

Let's test this button using a page object.

`tests/acceptance/ember-wormhole-test.js`

```js
import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import { create, visitable, clickable, text } from 'ember-cli-page-object';

var page = create({
  visit: visitable('/'),

  clickButton: clickable('button', { testContainer: '#destination' }),

  text: text('.message')
});

moduleForAcceptance('Acceptance | ember-wormhole integration');

test('clicks button inside #destination container', function(assert) {
  page
    .visit()
    .clickButton();

  andThen(function() {
    assert.equal(page.text, 'Button clicked!');
  });
});
```

As you can see in the page object definition, we want to click a button that is outside the application container so we tell the page object to look for the element on `#destination` container.

Hope this clarifies a bit how to use ember-wormhole and ember-cli-page-object in conjunction. Any feedback on how to improve the integration of both addons is more than welcome!

Happy testing!
