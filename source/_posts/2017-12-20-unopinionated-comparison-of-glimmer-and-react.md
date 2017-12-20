---
layout: post
title: "Unopinionated comparison of Glimmer and React"
category: javascript
comments: true
author:
  name: Jorge Bejar
  email: jorge@wyeworks.com
  twitter_handle: jmbejar
  github_handle: jmbejar
  image: /images/team/jorge-bejar.jpg
  description: Love to explore and write about Ruby, Javascript, full-stack development and technology in general.
---

In this article, we will discuss how different (or similar) it is to use [Glimmer](https://glimmerjs.com/) as compared with [React](https://reactjs.org/). Glimmer is a new library in the [Ember](https://www.emberjs.com/) ecosystem, which was released in March. Since the creation of this project, the Ember team has been experimenting with a new components API and the result of this work is expected to gradually be integrated into Ember itself in the future.

To some extent, Glimmer is comparable with React because the scope of both libraries is very similar: UI components for the web. However, let's take a look at some examples to highlight some of the similarities, as well as the differences.

<!--more-->

## Our first comparison

Let's start by comparing some basic stuff. Let's say we have a component containing a button. When said button is clicked, a random animal name is displayed.

This is how we could implement it with React:

<script src="https://gist.github.com/jmbejar/80f03eaea5bf8ec3b55935ddf64d7a90.js?file=RandomAnimal.jsx"></script>
<small>Try this code [here](https://jsfiddle.net/69z2wepo/94872/)</small>

What would be the translation for Glimmer? Well, the following does the same (please note, we need two files):

<script src="https://gist.github.com/jmbejar/80f03eaea5bf8ec3b55935ddf64d7a90.js?file=template.hbs"></script>
<script src="https://gist.github.com/jmbejar/80f03eaea5bf8ec3b55935ddf64d7a90.js?file=component.ts"></script>
<small>Try this code [here](http://tinyurl.com/ychd4suv)</small>

Obviously, the HTML code is handled differently in each case: React relies on JSX to embed the HTML into the Javascript code whereas Glimmer requires a specific file for the template into which it is written using [Handlebars](http://handlebarsjs.com/).

You may have noticed that our component does not have a unique root element. Glimmer supports that out-of-the-box. In React, one of the possible ways to create a component with more than one root element is to use `Fragment` tags, as done in the example. Support for such a situation has been improving in the latest React releases, as explained [here](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html).

We have a button that is attached to an action which is invoked when the button is clicked. In React, we achieve this by passing a component function to the `onClick` property of the button. However, we need to make sure that the function is correctly bound to `this` (we are binding the function to the constructor). On the other side, Glimmer comes with an `action` helper and we use it when the component function `setRandomAnimal` is passed to the `onclick` property of the button.

The implementation of the `setRandomAnimal` function is quite similar, but differs a bit depending on how the component’s internal state is updated in each case. React comes with the `setState` function, and it must be used to alter any internal state if we want to cause a re-rendering of our component.

In Glimmer, we use `tracked properties` which are updated by assigning a new value using regular Javascript syntax (in our example, the relevant code is `this.randomAnimal = animal;`). However, this relies on property declaration. We must use the `@tracked` annotation so that Glimmer keeps track of these values and triggers a component rerender when modifications in those properties take place.

We can see that Glimmer follows a more declarative approach while React’s model is more imperative (due to the need to invoke `setState`) to manage when components are refreshed in the UI.

## Iterating over arrays

Let's rewrite our React component to show a list of animals:

<script src="https://gist.github.com/jmbejar/d5f73c0fa0873b00db7d51b7f51d993e.js?file=RandomAnimal.jsx"></script>
<small>Try this code [here](https://jsfiddle.net/69z2wepo/94874/)</small>

Here we changed the code in order to show a list of animals. The click event of the button will invoke a function which adds new animals to the list. The React documentation states that [`this.state` must not be mutated directly](https://reactjs.org/docs/react-component.html#state) because React is designed around the idea that the component's state must be updated only through `setState`. To avoid that, we are using `concat` to generate a new instance of our list of animals, including the added item.

Another piece of advice regarding `setState` that is worth knowing: we need to rely on the value of `prevState` to make sure we are not messing up the array of animals if React decides to batch multiple calls to `setState` [as explained here](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous).

All the above are fundamental _React's gotchas_ to be aware of. In effect, our component could have been implemented by mutating the list or relying on `this.state.animals` in the `setState` callback and _it would work_...most of the time. Unfortunately, it would introduce subtle issues, which would be hard to track if race conditions actually exist.

Let's now explore how it might look in Glimmer:

<script src="https://gist.github.com/jmbejar/d5f73c0fa0873b00db7d51b7f51d993e.js?file=template.hbs"></script>
<script src="https://gist.github.com/jmbejar/d5f73c0fa0873b00db7d51b7f51d993e.js?file=component.ts"></script>
<small>Try this code [here](http://tinyurl.com/y9jsdubp)</small>

Here we have something that is actually very similar between Glimmer and React: we need to mutate the array in order to update the UI. Glimmer does not refresh the component if we mutate the array value directly, as it does not detect a value change in the tracked property. When tracked properties are arrays or objects, a new instance with the modified values must be provided. This is explained in the section, "The Immutable Pattern", [here](https://glimmerjs.com/guides/tracked-properties). However, if we ignore this recommendation and mutate the array of animals anyway, the component is not updated at all when we click the button. Since changes in the list of animals are not reflected on the web page, we know that something is not working as expected and, as a consequence, it is unlikely that a race condition problem would appear as in the React case.

Regarding how the user interface is built, we observe how different the mechanisms to produce HTML are in each case. In Glimmer, we use Handlebars, which comes with control structures such as `if` and `each` blocks to build dynamic content. Moreover, you have access to the component properties (all of them, tracked or not), and you never refer to the component itself via `this`. In fact, this is basically a declarative approach... yet again.

In React, you will end up forming the HTML output in a more programmatic (and imperative) way, probably splitting parts of the output calculation across several variables or auxiliary functions and finally concatenating everything in the value returned by the `render` function. Since our case was not so complicated, we just needed to use the local variable `renderAnimals` with the help of the `map` function to build the list of `li` elements.

## Composing components

With the excuse of exploring the interaction between components, let's rewrite our React example to contain only one specific component for the button:

<script src="https://gist.github.com/jmbejar/243e446f46fcc30b9f961df9b382bb4f.js?file=RandomAnimal.jsx"></script>
<small>Try this code [here](https://jsfiddle.net/69z2wepo/94873/)</small>

Note that we added the stateless component `AnimalButton`, and we are determining the next animal in the list for this component. Then, we are passing a callback function which is invoked by the new animal. Adding the value to the list is the job of our main component. The caption text and the callback function are both values passed as properties.

Similarly, we can do the analogous refactor in Glimmer:

<script src="https://gist.github.com/jmbejar/243e446f46fcc30b9f961df9b382bb4f.js?file=AnimalButton-template.hbs"></script>
<script src="https://gist.github.com/jmbejar/243e446f46fcc30b9f961df9b382bb4f.js?file=AnimalButton-component.ts"></script>
<script src="https://gist.github.com/jmbejar/243e446f46fcc30b9f961df9b382bb4f.js?file=RandomAnimal-template.hbs"></script>
<script src="https://gist.github.com/jmbejar/243e446f46fcc30b9f961df9b382bb4f.js?file=RandomAnimal-component.ts"></script>
<small>Try this code [here](http://tinyurl.com/y9j3lunu)</small>

Looking at the Glimmer solution, we notice that it is very similar in how values are passed to the `AnimalButton` component (note that in Glimmer, arguments begin with the character `@`). In both cases, we are passing a string for the button element to the `AnimalButton` component, as well as a function which adds the animal to the list.

In our React solution, the callback is a property of `props`, so when the button is clicked, the `addAnimalToList` function from the parent component is finally invoked. In Glimmer, the passed function is available in the child component context as a property of `this.args`, making it very easy to invoke as well. The only difference here is the usage of the `action` keyword, which automatically binds the function to the parent component context, which in turn is usually the most convenient binding. Manually binding the callbacks to the component instance is usually required in React, as done in the last line of the `constructor` function in our example.

The most noticeable difference here is related to the very simple components like the `AnimalButton`. In React, it is possible to implement `AnimalButton` as a stateless component. This is a means of simplifying the definition of components that do not contain inner states. No similar concept exists in Glimmer, where the simplest option would be components containing only handlebars code. However, some Typescript code must be present to handle the click event and invoke the callback, hence both files are necessary in our case.

Didn't we mention before that Glimmer uses Typescript instead of Javascript by default? 🤠

Another important thing! In Glimmer, the location and names of files is very important. All components should be placed under `ui/components` in separate folders where the specific files `template.hbs` and `component.ts` exist. This convention must be adhered to in order to keep things properly connected. In the React world, one has more freedom to organize things because you are responsible for importing components as they are needed using the [ES6 module import syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

## Further comparison

Looking beyond the code examples above, there are other similarities between both libraries worth highlighting.

For example, both include support for defining inline content for components. Take a look at the alternative implementation below for the render function of the `AnimalButton` component:

<script src="https://gist.github.com/jmbejar/157278a02e80ad9f382dc72168651de6.js?file=AnimalButton.jsx"></script>

The `props.children` will be replaced by any content nested under the tag `<AnimalButton>`. Here is an example of how it would be invoked by the parent component:

<script src="https://gist.github.com/jmbejar/157278a02e80ad9f382dc72168651de6.js?file=RandomAnimal.jsx"></script>

In Glimmer, it’s possible to do the same using the `yield` keyword. Although it is not officially mentioned in the Glimmer documentation, it works as expected. Well, something that you might expect if you have experience with Ember 😌.

<script src="https://gist.github.com/jmbejar/157278a02e80ad9f382dc72168651de6.js?file=RandomAnimal-component.ts"></script>
<script src="https://gist.github.com/jmbejar/157278a02e80ad9f382dc72168651de6.js?file=RandomAnimal-template.ts"></script>

Both libraries have additional similar features, such as the ability to render outside of the DOM hierarchy of components (see [Portals](https://reactjs.org/docs/portals.html) in React and the `{{in-element}}` helper in Glimmer mentioned [here](https://www.emberjs.com/blog/2017/10/10/glimmer-progress-report.html)).

Another important aspect is the availability of lifecycle hooks in the components API. In fact, Glimmer doesn’t  include a lot of them; only `didInsertElement` , `didUpdate`, and `willDestroy` are present in the public API. React has a few more hooks, but I would expect to see similar capabilities in Glimmer in the near future (for instance, something similar to React’s `componentWillReceiveProps` would be a nice-to-have).

## Conclusions

The examples in the article allowed us to cover similar aspects in both libraries. At the same time, we discussed problems that each library resolves differently. Although the comparison is not a complete review of the capabilities of each library, many relevant aspects have been highlighted and an overall idea of what you can expect from Glimmer and React has been provided.

We should note that Glimmer is a rather young library, and as a consequence, the component API that has been exposed to developers is still changing and being further established. On the other hand, this library is powered by the GlimmerVM, the rendering engine that shipped with later versions of Ember, so it is already in use in many existing applications. The Ember team is currently working on improvements for this engine, and that will impact Glimmer quite soon. For instance, they are trying to optimize the bytecode generated by the GlimmerVM, and are experimenting with incremental rendering and rehydration. Further reading about these topics can be found here: [Glimmer Progress Report](https://www.emberjs.com/blog/2017/10/10/glimmer-progress-report.html). Of course, React itself is a very active project and the rendering engine completely changed with [the arrival of Fiber this year](https://code.facebook.com/posts/1716776591680069/react-16-a-look-inside-an-api-compatible-rewrite-of-our-frontend-ui-library/).

An interesting aspect of Glimmer is that it relies on ES6 classes for components, making it more like React than Ember in this way, and this explains some of the similarities. At the same time, both approaches differ in terms of component state management, templating language, and underlying mechanisms to manipulate the DOM. Naturally, React offers a broader set of features since the API is larger than Glimmer’s, the latter which only covers the most basic of needs, at least for now.

As a web developer, I find it interesting to understand how the different libraries compare with each other. We have seen how UI libraries in the frontend landscape had been consolidating the architecture of components, adopting ES6/ES7 idioms and goodies, and looking for a balance between an accessible API and solid rendering performance.
