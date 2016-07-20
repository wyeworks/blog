---
layout: post
title: "Six useful Ember addons for testing"
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

In this post I want to share with you a set of addons that I regularly use to aid me when testing an Ember application or addon which I think should be in
every Ember developer toolbox.

The idea is to give you a hint of what problems they solve and how they work.

This is the list of addons we'll go through

* [ember-cli-mirage](#ember-cli-mirage)
* [ember-sinon](#ember-sinon)
* [ember-cli-page-object](#ember-cli-page-object)
* [ember-try](#ember-try)
* [ember-exam](#ember-exam)
* [ember-qunit-nice-errors](#ember-qunit-nice-errors)

<!--more-->

## <a name="ember-cli-mirage"></a>ember-cli-mirage

Let's start with a well-known addon
[ember-cli-mirage](http://www.ember-cli-mirage.com/) mantained by [Sam Selikoff](https://twitter.com/samselikoff). The idea of the addon is to help you mock your complex APIs easily using an integrated [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping).

I won't cover how to use the addon, you can check the documentation
[here](http://www.ember-cli-mirage.com/docs/v0.2.x/quickstart/) but I will show you just a snippet of what it allows you to do.

Let's say you have a user page which list all the users of your system, you can mock the responses of your API by doing the following

1 - Create a mirage model named "user"

```js
// mirage/models/user.js
import { Model } from 'ember-cli-mirage';

export default Model;
```

2 - Create a mirage factory named "user"

```js
// mirage/factories/user.js
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) { return `Person ${i}`; },
  age: 28,
  admin: false,
  avatar(i) { return faker.internet.avatar(); }
});
```

3 - Tell mirage to stub your API route using the model we defined earlier

```js
// mirage/config.js
export default function() {
  this.namespace = 'api'
  this.get('/users');
}
```

4 - And lastly, instance some fake users in your test

```js
test("shows all users", function() {
  server.createList('user', 10)

  visit('/users');

  andThen(function() {
    assert.equal(find('.users tr').length, 10, 'Shows ten users');
  });
});
```

By following these four steps Mirage will know everything it needs to know in order to respond to your API requests and take control over the XHR layer of your application. That way, any test that makes a XHR call to `/api/users` will respond with these fake users without making the actual HTTP request to the server.

At first glimpse it could be seen as a lot of indirection layers to mock an API request (mirage model, mirage factory, mirage configuration, etc.) but this structure works really well in medium to large size projects (ambitious projects!).

## <a name="ember-sinon"></a>ember-sinon

[ember-sinon](https://github.com/csantero/ember-sinon) is a shim for adding the [Sinon](http://sinonjs.org/) library to an Ember application.

Sinon provides test spies, stubs and mocks to your tests which helps you break object dependencies.

Let's say you have a unit test for an object which has a dependency and want to stub that dependency, with ember-sinon you can do the following

```js
// object under test
function MyAwesomeObject(callback) {
  this.callback = callback;
}

MyAwesomeObject.prototype = {
  foo: function() {
    return this.callback();
  }
};
```

```js
import { module, test } from 'qunit';
import sinon from 'sinon'
import MyAwesomeObject from '../lib/my-awesome-object';

module('Unit | MyAwesomeObject');

it('returns the return value from the original function', function () {
    var callback = sinon.stub().returns(42);
    var subject = new MyAwesomeObject(callback);

    assert.equals(subject.foo(), 42);
});
```

You can also use spies to assert that a function was called, for example

```js
import { module, test } from 'qunit';
import sinon from 'sinon'
import MyAwesomeObject from '../lib/my-awesome-object';

module('Unit | MyAwesomeObject');

it('calls the original function only once', function () {
    var callback = sinon.spy();
    var subject = new MyAwesomeObject(callback);

    subject.foo();

    assert(callback.calledOnce);
});
```

Having these primitives make it really easy to stub, mock and spy on any dependency and makes the code easier to understand but remember that if a dependency is hard to mock, stub or spy, then it might be a sign that you need to refactor your application code.

## <a name="ember-cli-page-object"></a>ember-cli-page-object

Acceptance tests are great because with little code they allow you to test a big part of your application almost end-to-end (at least at client-side level). One problem though is that they can become unmaintainable really fast if you don't give the tests a proper structure.

[ember-cli-page-object](http://ember-cli-page-object.js.org/) aids you by providing a set of well known practices and conventions that help you avoid common mistakes like tying your tests to the HTML structure of your application and by avoiding the repetition of lots of code (CSS selectors and DOM manipulation helpers).

Here's a glimpse of how you can write an acceptance test using a page object.

```js
const page = PageObject.create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors')
});

test('login failed', function(assert) {
  page
    .visit()
    .username('admin')
    .password('invalid')
    .submit();

  andThen(() => {
    assert.equal(page.error, 'Invalid credentials');
  });
});
```

This addon also supports component integration tests so you can use the same abstractions that you use in your acceptance tests.

## <a name="ember-try"></a>ember-try

Included by default in Ember addon projects, this awesome addon by [Katie Gengler](https://twitter.com/katiegengler) (of emberobserver.com fame!) allows you to run your test suite against multiple versions of a dependency.

Let's say that you create an addon and want to ensure that it won't break with future releases of Ember, you can declare in ember-try's configuration file that you would like to run the tests using Ember Canary, Beta, Release and why not, Ember LTS. The addon adds a new command to ember-cli which reads said configuration file and runs your entire test suite several times but changing the ember version in each run to cover all the different versions you specified. This way you can ensure that your addon will continue working when newer versions of Ember are released.

Apart from testing against different versions of Ember, you can also test against different versions of other libraries, let's say you want to ensure that your addon runs correctly using different versions of jQuery, you can do this really easily also.

You can find more information about the addon [here](https://github.com/ember-cli/ember-try).

## <a name="ember-exam"></a>ember-exam

[ember-exam](https://github.com/trentmwillis/ember-exam) is a much needed and awaited project by [Trent Willis](https://twitter.com/trentmwillis), a QUnit core developer. The addon adds a new ember-cli command which allows you to run your tests with randomization, splitting, and parallelization which reduces the time to run your complete test suite and also helps you spot flaky tests.

After you install the addon you just use the command `exam`

```
$ ember exam --random --split=4 --parallel
```

This will run your tests in four different processes, making it much faster and in random order so you can spot dependent tests.

## <a name="ember-qunit-nice-errors"></a>ember-qunit-nice-errors

And finally a new addition to my toolbox is this excellent addon by [Federico Kauffman](https://twitter.com/fedekauffman), [Samanta de Barros](https://twitter.com/sami_dbc) and [Diego Acosta](https://twitter.com/acostami) which improves A LOT the default output of QUnit assertions.

The idea behind this addon is to rewrite on build time your assertions to include the expressions being asserted so you have more information when they fail.

Before

![before](/images/posts/ember-qunit-nice-errors-before.png)

After

![after](/images/posts/ember-qunit-nice-errors-after.png)

No more `expected true, result false` errors. The addon also rewrites `notOk`, `equal` and `notEqual` assertion types.

## What other addons for testing do you find invaluable?

So to sum up, with this battery of addons you can make your test suite easier to understand, easier to maintain, faster to execute and to spot errors which in the end leads to faster development pace.

Please, share in the comment section which testing addons you find invaluable.
