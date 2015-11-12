---
layout: post
title: "Living with singleton controllers"
category:
comments: true
author:
  name: Juan Azambuja
  email: juan@wyeworks.com
  twitter_handle: juanazam
  github_handle: juanazam
  image: /images/team/juan-azambuja.jpg
  description: Passionate Rails developer now transitioning to Ember
---

As you already may know by now, Ember controllers are singleton, this can be handy under some circumstances for example
for keeping global state, but by now, most of the Ember community is moving forward to other solutions (like `Ember.Component` and
`Ember.Service`) to avoid certain problems that arise due to their singleton condition.

<!--more-->

In the beginning of times, when Ember was younger, the typical
thing to do while developing your application was to use controllers. With the arise of
components, the community started to see the benefits from using components and soon
realized that it would be better to get rid of controllers and only use components in their place.

As of versions `2.x`, the community is moving to [routable components](https://github.com/emberjs/rfcs/pull/38)
(you can check the RFC and watch this [video](https://www.youtube.com/watch?v=QgycDZjOnIg)).
This is great, but what can developers with older versions of ember can do at the moment to
avoid the singleton nature of controllers?

## Option 1 - Components all the way

One way to start preparing yourself for version 2.0 is to keep your controllers
as slim as possible. This means:

`app/routes/some-route.js`:

{% codeblock lang:js %}
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return { someKey: 'someValue' }
  }
})
{% endcodeblock %}

`app/template/some-route.hbs`:

{% codeblock lang:html %}
{% raw %}
{{my-handy-component entity=model}}
{% endraw %}
{% endcodeblock %}

As you can see, the main idea is to avoid the controller definition completely
(just use Ember's default one) and instantiate a component with all the necessary data
to be used. In case you have actions, it would be advisable to implement that behavior on
the route. This template - component pair will evolve into a routable
component when the feature is available.

This is great! but what happens with legacy code with LOTS of behavior implemented
in controllers? You can either try this approach which might be a bit painful or
try option 2.

## Option 2 - The ninja way

We are trying to make our controllers reset when we transition from
route to route, so lets do exactly that:

{% codeblock lang:js %}
import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    this._super(controller, model);

    this.controller.reset();
  }
})
{% endcodeblock %}
{% codeblock lang:js %}
import Ember from 'ember';

export default Ember.Controller.extend({
  // ... Stuff

  reset() {
    this.setProperties({
      somePropery: null,
    })
  }
  // ... More stuff
})
{% endcodeblock %}

This works, but what happens if we have several controllers with this issue? No
problem, we can create a mixin for that:

{% codeblock lang:js %}
import Ember from 'ember';

export default Ember.Mixin.create({
  setupController: function(controller, model) {
    this._super(controller, model);

    controller.reset();
  }
});
{% endcodeblock %}

And then we can:

{% codeblock lang:js %}
import Ember from 'ember';
import ResetControllerMixin;

export default Ember.Route.extend(ControllerResetMixin, {
  // my route code
})
{% endcodeblock %}

Awesome, we made it! but wouldn't it be great to have this behavior working by
default automatically on every route whose controller responds to `reset`?

We can create an initializer which includes our mixin by default on all routes.

{% codeblock lang:js %}
import Ember from 'ember';
import ResetControllerMixin from '../mixins/reset-controller';

export function initialize() {
  Ember.Route.reopen(ResetControllerMixin);
}

export default {
  name: 'include-reset-controller',
  initialize: initialize
};
{% endcodeblock %}

We need to modify our mixin a bit to take into account controllers which doesn't implement
`reset`:

{% codeblock lang:js %}
import Ember from 'ember';

export default Ember.Mixin.create({
  setupController: function(controller, model) {
    this._super(controller, model);

    if (controller.reset) {
      controller.reset();
    }
  }
});
{% endcodeblock %}

Voilà! Now we are ready!

Thanks for reading, stay tuned for more interesting posts.
