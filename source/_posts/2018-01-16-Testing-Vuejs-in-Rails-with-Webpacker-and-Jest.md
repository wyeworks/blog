---
layout: post
title: "Testing Vue.js in Rails with Webpacker and Jest"
category:
comments: true
author:
  name: Mario Saul
  email: mario@wyeworks.com
  twitter_handle: mario_saul
  github_handle:  mariiio
  image:  /images/team/mario-saul.jpg
  description: Software Developer at Wyeworks.
---

In the project I'm working on, I was given the task of investigating how to integrate [Vue.js](https://vuejs.org/) with our existing Rails app. So I started reading the official guide, watching tutorials and reading various posts until I finally got a fully working Vue component.

Finally it was time to write some tests, but unfortunately, the [Webpacker](https://github.com/rails/webpacker) gem doesn't include testing configuration, so I had to do it on my own.

To my surprise, I found that there wasn't much documentation on how to do the setup. So I figured I'd make this post to share with you how I managed to eventually get it working.

<!--more-->

## 1. Install Jest
I decided to go with [Jest](https://facebook.github.io/jest/) for no personal preference, I just noticed that [vue-cli](https://github.com/vuejs/vue-cli) ships with it and went for it.

To install Jest all you have to do is run `yarn add --dev jest` from the root of your project.
Then, add a test script to your `package.json`:
{% codeblock lang:json %}
{
  "scripts": {
    "test": "jest",
    ...
  },
  ...
}
{% endcodeblock %}
Now you can run your tests with `yarn test`.

## 2. Define the location of your tests
If you try to run `yarn test` at this point, you'll see that `config/webpack/test.js` failed. This is because of the way [Jest looks for test files in the project](https://facebook.github.io/jest/docs/en/configuration.html#testmatch-array-string). It basically executes all files matching `.spec.js` or `.test.js` in the whole project. In this case, the file matched `*.test.js` so it tried to run it as a test.

Since we don't want the Webpack config file as well as other files in the project that meet this criteria to run with our tests, we need to tell Jest where to look for them.

In my case since I'm using [Rspec](http://rspec.info/), I decided to point it to the `spec/javascripts` directory. But you can feel free to choose whichever directory fits your project the best.

To do this you just have to add [roots](https://facebook.github.io/jest/docs/en/configuration.html#roots-array-string) to your `package.json`:
{% codeblock lang:json %}
"jest": {
  "roots": [
    "spec/javascript"
  ]
},
{% endcodeblock %}

<div style="background: linen; padding: 15px; margin-bottom: 15px; border-radius: 15px">
  <p>
    If your <code>package.json</code> is quite big and you don't want to keep adding more stuff to it, you can define the jest configuration through the <code>--config &lt;path/to/js|json&gt;</code> option. If you choose to do so, your <code>package.json</code> should now be like:
  </p>
  {% codeblock lang:json %}
  {
    "scripts": {
      “test”: “jest --config spec/javascript/jest.conf.js”,
      ...
    },
    ...
  }
  {% endcodeblock %}
</div>

To verify it worked, you can create a `spec/javascript/team.spec.js` file with a simple test like:
{% codeblock lang:javascript %}
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});
{% endcodeblock %}
Now run `yarn test` again and you should see a green "PASS" in the output meaning that it worked 🎉.

## 3. Babel to the rescue
Now that we got our first test working, let's take it one step further and try to test a Vue component.

The first thing you'd probably try is to create a file under the `spec/javascript/` directory and name it something like `my_component.spec.js`. Then try to import your component from within your spec with the [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) statement like:

{% codeblock lang:javascript %}
  import MyComponent from '../../app/javascript/my_component.vue';
{% endcodeblock %}

If you did try this, go ahead and run your tests. You'll see a `SyntaxError: Unexpected token import` in the output.

The problem here is that `import` is part of ECMAScript 6, so we need the help of a transpiler such as [Babel](https://babeljs.io/).

To get it working you need to install two packages by running `yarn add --dev babel-jest babel-preset-es2015` and add the "es2015" preset to your `.babelrc` file:
{% codeblock lang:json %}
{
  "presets": ["es2015",
    ["env", {
			...
{% endcodeblock %}
If you want to take it one step further, you can add [moduleDirectories](https://facebook.github.io/jest/docs/en/configuration.html#moduledirectories-array-string) to your `.package.json` so you don't have to type out the full path to your modules:
{% codeblock lang:json %}
"jest": {
	...
  "moduleDirectories": [
    "node_modules",
    "app/javascript"
	]
}
{% endcodeblock %}
So what we had before as
{% codeblock lang:javascript %}
  import MyComponent from '../../app/javascript/my_component.vue';
{% endcodeblock %}
can now be written as
{% codeblock lang:javascript %}
  import MyComponent from 'my_component.vue';
{% endcodeblock %}

## 4. Where's Vue?
If you followed every step, you should be getting a `SyntaxError` when trying to run your tests. This means that it successfully imported your component, but it can't yet understand `.vue` file's format.

Fortunately, we have a package that will take care of it for us, [vue-jest](https://github.com/eddyerburgh/vue-jest).
So go ahead and run `yarn add --dev vue-jest` along with adding "moduleFileExtensions", "transform" and "mapCoverage" as explained in the [README](https://github.com/eddyerburgh/vue-jest/blob/master/README.md).
Your `package.json` should look something like this:
{% codeblock lang:json %}
"jest": {
  ...
	"moduleFileExtensions": [
    "js",
    "json",
    "vue"
  ],
  "transform": {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
  },
  "mapCoverage": true
}
{% endcodeblock %}

With [moduleFileExtensions](https://facebook.github.io/jest/docs/en/configuration.html#modulefileextensions-array-string) we no longer need the `.vue` when importing Single File Components. So what we had before as
{% codeblock lang:javascript %}
  import MyComponent from 'my_component.vue';
{% endcodeblock %}
can now be written as
{% codeblock lang:javascript %}
  import MyComponent from 'my_component';.
{% endcodeblock %}
You should now be able to use `import` seamlessly.

The rules in the [transform](https://facebook.github.io/jest/docs/en/configuration.html#transform-object-string-string) section indicate which package is responsible for the transformation of testing files. In our case, we want `vue-jest` to handle all our `.vue` files, so they are converted to plain javascript before being handled by Jest.

[mapCoverage](https://facebook.github.io/jest/docs/en/configuration.html#mapcoverage-boolean) is set in order to use source maps that the transformer emits. Jest will use them to try and map code coverage against the original source code when writing reports and checking thresholds.

Lastly, let's add the official unit testing utility library for Vue, [vue-test-utils](https://vue-test-utils.vuejs.org/en/). Just run `yarn add --dev @vue/test-utils` and you are good to go.

You can now start writing tests for your Vue components 🎉

## Credits

This post is the result of gathering many documentation around the web such as [Jest official docs](https://facebook.github.io/jest/docs/en/configuration.html), [this post](https://medium.com/@kylefox/how-to-setup-javascript-testing-in-rails-5-1-with-webpacker-and-jest-ef7130a4c08e), and many more.
