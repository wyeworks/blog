---
layout: post
title: "Understanding unknownProperty in Ember"
comments: true
author:
  name: Santiago Ferreira
  email: santiago.ferreira@wyeworks.com
  twitter_handle: san650
  github_handle: san650
  image: /images/team/santiago-ferreira.jpg
  description: Developer working with Ruby, JavaScript and Ember.
---

The Ember object model provides support for dynamically resolving properties in
an object. In other words, if we request the value of a property from an Ember
object, this object has the chance to respond to the request even if the
property doesn’t exist.

This can easily be implemented using the _handler_
[`unknownProperty`](https://github.com/emberjs/ember.js/blob/e88c64460888f8669a63419493d27226b6131668/packages/ember-metal/lib/property_get.js#L28-L30).

<!--more-->

The code documentation tells us that

> Gets the value of a property on an object. If the property is computed,
  the function will be invoked. If the property is not defined but the
  object implements the `unknownProperty` method then that will be invoked.

Let’s see an example of how it works

```js
var MyClass = Ember.Object.extend({
  unknownProperty(key) {
    return `Hi ${key}!`;
  }
});

var object = MyClass.create({});

object.get('Santiago'); // => "Hi Santiago!"
```

Likewise, you can define the _handler_
[`setUnknownProperty`](https://github.com/emberjs/ember.js/blob/e88c64460888f8669a63419493d27226b6131668/packages/ember-metal/lib/property_set.js#L20-L23)
which is called when we try to write in a property.

The code documentation tells us that

> Sets the value of a property on an object, respecting computed properties and
> notifying observers and other listeners of the change. If the property is not
> defined but the object implements the `setUnknownProperty` method then that
> will be invoked as well.

Here is an example that implements a simple _proxy_ which puts the _strings_ in
lowercase.

```js
var MyClass = Ember.Object.extend({
  setUnknownProperty(key, value) {
    var content = this.get('content');

    if (Ember.typeOf(value) === 'string') {
      value = value.toLowerCase();
    }

    content.set(key, value);

    return value;
  },

  unknownProperty(key) {
    var content = this.get('content');

    return content.get(key);
  }
});

var object = MyClass.create({
  content: Ember.Object.create({})
});

object.set('value', 'HELLO WORLD'); // => "hello world"
object.get('value'); // => "hello world"
object.set('anotherValue', 10); // => 10
object.get('anotherValue'); // => 10
```

As we can see in the example, we create an object that intercepts the values
that we want to write and stores them in the object `content`. It also converts
the text to lowercase.

Note that these two _handlers_ are only invoked when there is no property with
that name.

This behavior of the Ember object model is very powerful since it allows you to
implement _proxies_ very easily. This ability to add a level of indirection
when reading or writing attributes can be used to integrate other browser
libraries or APIs with Ember.

## `localStorage` Example

Let’s look at an example in which we will use this functionality to create a
service that allows configurations to easily persist using `localStorage`.

First, we need to create the service that communicates with `localStorage`,
which we’ll name `app/services/preferences.js`

```js
import Ember from 'ember';

function read(key) {
  return window.localStorage.getItem(key);
}

function write(key, value) {
  window.localStorage.setItem(key, value);
}

export default Ember.Service.extend({
  unknownProperty(key) {
    return read(key);
  },

  setUnknownProperty(key, value) {
    write(key, value);

    return value;
  }
});
```

We’ll use the application route to test this mechanism.

We create the controller `app/controllers/application.js`

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  preferences: Ember.inject.service(),

  text: Ember.computed.alias('preferences.text'),

  actions: {
    createPreference() {
      this.set('preferences.text', 'Click!');
    }
  }
});
```
And then the template

{% codeblock lang:html %}
{% raw %}
<h2 id="title">Welcome to Ember</h2>

{{input value=text}}

<button {{action 'createPreference'}}>Save</button>

{{outlet}}
{% endraw %}
{% endcodeblock %}

Now every time we write in the text box or press the button, the value of the
`text` property will be stored in `localStorage`. And if we reload the page, it
will show the last value entered!

In the image below, we can see that when the page loads, we don’t have any
value in `localStorage`

![empty text](/images/posts/unknownProperty-ember-01.png)

Then, once we’ve written in the text box, it will update the value in
`localStorage` thanks to the computed property `Ember.computed.alias`.

![input bind](/images/posts/unknownProperty-ember-02.png)

Finally, if we press the button, it will write directly in the configuration.

![button](/images/posts/unknownProperty-ember-03.png)

If you look closely at the last screenshot, you’ll see that after pressing the
button, the text box was not updated. This is due to the fact that after
successfully responding in the _hook_ `setUnknownProperty`, we must notify that
the property changed. To do this we use the method `notifyPropertyChanged`.

```js
import Ember from 'ember';

function read(key) {
  return window.localStorage.getItem(key);
}

function write(key, value) {
  window.localStorage.setItem(key, value);
}

export default Ember.Service.extend({
  unknownProperty(key) {
    return read(key);
  },

  setUnknownProperty(key, value) {
    write(key, value);
    this.notifyPropertyChanged(key);

    return value;
  }
})
```

Following this change, the application behaves as expected.
