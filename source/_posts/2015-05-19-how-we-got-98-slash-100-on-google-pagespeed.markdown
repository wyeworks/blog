---
layout: post
title: "How we got 98/100 on Google PageSpeed"
category: front-end
date: 2015-05-19 09:38:36 -0300
published: true
comments: true
hero_image: /blog/images/heros/post-high.jpg
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle: spastorino
  image: /images/team/santiago-pastorino.jpg
  description: WyeWorks Co-Founder, Ruby on Rails Core Team Member
---


The story begins when we noticed that [our site](http://www.wyeworks.com/) was not loading as fast as we'd liked to. This being a purely static site presenting content, led to a single possible culprit: the Front–End.

We originally used a "PSD2HTML" service, which for a single page may feel like a nice cost-cutting alternative. But of course, cheap is expensive on the long run.

In this article we're going to dig into the journey of analyzing and understanding what we we had on our hands and what had to be done to be at our own standards of quality.

<!--more-->

## Initial assessment

The most apparent low-hanging fruit was the fact that our slider images were "retina-optimized", meaning we had *huge* 2550×1000 jpegs that were just too heavy. Naively, there was also a script to alternatively load images depending on the viewport size and pixel density... which we decided was not appropriate for our case, opting to avoid the logic and present photos in a sensible size and iconography in retina densities by default. This change in binaries reduced the size of the page on first load considerably.

Another aspect of the delivered HTML and CSS was redundancy and contrived structures with unhelpful and unsemantic class names. At this point we pondered on what was the best choice: Reuse and Refact or Rebuild. We ended up deciding on rebuilding when we saw that we'd actually spend more time refactoring.

Now we had the opportunity to build a system of modular front-end components that would play nicely with each other.


## Implementation

Some decision were taken at rebuild time. First: how would the application be bootstraped? We had the good ol' grab an html and css file (which is still an option with low a low entry barrier), we had initial templates like [h5bp](https://html5boilerplate.com/) and perhaps we could have fired up a [Sinatra](http://www.sinatrarb.com/) or [Middleman](https://middlemanapp.com/) app.

We decided to use [Yeoman](http://yeoman.io/) with the [webapp generator](https://github.com/yeoman/generator-webapp). This gave us a nice scaffolding with Grunt, Bower, Livereload & SASS.


### Initial structure

Following the same principles of "Convention over configuration", we start each project with an initial CSS folder structure that aids on our understanding of the front-end structure; this structure being:

{% codeblock %}
└── styles
    ├── _baseline.scss
    ├── _font-face.scss
    ├── _mixins.scss
    ├── _print.scss
    ├── _responsive.scss
    ├── _section-specific.scss
    ├── _variables.scss
    ├── main.scss
    ├── modular
    │   └── .keep
    └── persistent
        ├── _footer.scss
        ├── _header.scss
        └── _omnipresent.scss
{% endcodeblock %}

Over the process of building the app, each file gets the code pertinent to its purpose, while folders like `modular` get new files created inside of it. All these files are then invoked in main.scss, since an underscore beginning of file in SCSS denotes a partial that must be explicitly required.

Files like `_section-specific` could be themselves folders, and folders like `persistent` could be single files, this is left to the criterium of the implementator after analyzing the project's needs.


### Modular front-end

While an initial file structure is an important aid to having a proper mental model of the project, it's not a silver bullet to solve all our problems. While building the HTML care must be taken to decouple the structures we use in such a way that they are reusable accross the board.

For a simple example of this, check this HTML:

{% codeblock lang:html %}
<article class='project'>
  <div class='brand-description'>
    <img src='/images/logos/{{client name}}.png' alt='{{client name}} logo'>
    <p>Pack my box with five dozen liquor jugs. Few quips galvanized the mock jury box. Quick brown fox jumps over the lazy dog.</p>
    <p>Jumpy halfling dwarves pick quartz box. Vex quest wizard, judge my backflop hand. Sympathizing would fix Quaker objectives.</p>
  </div>
  <div class='testimonial'>
    <strong>{{client representative's name}}</strong>
    <em>{{client representative's role}}</em>
    <blockquote>
      <p>Bored? Craving a pub quiz fix? Why, just come to the Royal Oak! Grumpy wizards make toxic brew for the evil Queen and Jack. Crazy Fredericka bought many very exquisite opal jewels.</p>
    </blockquote>
  </div>
</article>
{% endcodeblock %}

And this CSS:

{% codeblock lang:css modular/project.scss %}
.project {
  @extend .row;
  border-bottom: .1em solid lighten($quality-color, 33);
  padding-top: .7em;
  padding-bottom: .7em;
  margin-top: .7em;
  margin-bottom: .7em;
  &:last-child {
    border: none;
  }
}
.project p {
  margin: .5em 0;
  line-height: 1.255;
  letter-spacing: .0075em;
}
.brand-description {
  @extend .col-4;
  margin: 0 0 1em;
}
.brand-description img {
  display: block;
  margin: 0 auto;
  max-height: 3.77rem;
}
.brand-description p {
}
.testimonial {
  @extend .col-2;
}
.testimonial strong,
.testimonial em {
  display: block;
  line-height: 1.1;
  color: $proactive-color;
}
.testimonial strong {
  font-size: 1.3575em;
  text-transform: uppercase;
}
.testimonial em {
  margin: 0 0 1.75em 0;
}
{% endcodeblock %}

Even thou in this case `.project` will always have `.brand-description` and `.testimonial` as children, the CSS is written in such a way that these are independent modules, being perfectly capable of existing inside other contexts without the need to participate in a specific hierarchy. Now, the content of these modules _will_ depend on their parents; the key is to recognize the minimum necessary code to represent a concept. For instance, if the `img` representing the client logo had a special treatment independent of its context, this could be represented by yet another class that could be reused in other parts of the project (but this is not the case).


### Responsive

Now, you will notice that we have a separate, speicifc file named `_responsive.scss`. Some authors prefer to have the responsive `@media` statements of a module inside of its own module file. While this is definitely better for code organization, it's not as good for the final rendered CSS, where the `@media` statements will repeat as many times as modules you have. Additionally, having a single file for `@media` statements is more in line with the process itself of the responsiveness last step.

Remember that writing a responsive front-end starts way before writing `@media` statements. RWD is basically the amalgamation of a fluid layout with conditional statements depending on viewport size (and/or several [less used conditionals](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries)).

All being said, this structuration is open to discussion and not written in stone.


### Critical CSS

On the yore times of speed improvement, Yahoo recommended injecting all application CSS on the header; which even thou we nowadays have build tools like Grunt or Gulp to automatize this, we know it's a practice that unnecesarily increases requests size and denies the benefits of caching css files that have statements used throught the app.

On the other hand, we can have our all our CSS on a single file, which gets cached but can impact the initial load of the site due to painting of the layour having to wait for the whole CSS to be loaded (which has statements beyond what the user will probably see on initial load). This takes us back to the dreaded concept of "[Above the fold](http://en.wikipedia.org/wiki/Above_the_fold)", which has been disproved to impact user's engagement since scrolling is a natural action for even unexperienced users to perform. Even thou what the user initially sees is not necessarily the most important, we now need to treat this area differently due to a technical necessity: Painting the visible layour as fast as possible and deferring the loading of the remaining CSS.

The middle road of putting all of our CSS on the `head` vs having it on a separate file is having the CSS that affects "Above the fold" or "Critical content" on the `head` and the rest of our css on a separate file. [This is a good talk that explains this and further](https://www.youtube.com/watch?v=PkOBnYxqj3k).

There are [several projects](https://github.com/addyosmani/critical-path-css-tools) for performing this (more or less) automatically. In our specific case, we had the benefit of knowing what is the above the fold content (The slider adapts to the viewport height), and our CSS was already modular enough that we could separate them easily into two files: `main.scss` and `critical.scss`.

In the end, our SCSS file structure, modular.scss & critical.scss ended up as such:

{% codeblock %}
└── styles
    ├── _baseline.scss
    ├── _font-face.scss
    ├── _mixins.scss
    ├── _print.scss
    ├── _responsive.scss
    ├── _section-specific.scss
    ├── _variables.scss
    ├── critical.scss
    ├── lte-ie8.css
    ├── main.scss
    ├── modular
    │   ├── _browsehappy.scss
    │   ├── _buttons.scss
    │   ├── _client-logos.scss
    │   ├── _forms.scss
    │   ├── _icons.scss
    │   ├── _project.scss
    │   ├── _service.scss
    │   ├── _simple-columns.scss
    │   ├── _tooltip.scss
    │   └── _wye-slider.scss
    └── persistent
        ├── _footer.scss
        ├── _header.scss
        └── _omnipresent.scss
{% endcodeblock %}

{% codeblock lang:css critical.scss %}
@import 'variables';
@import 'mixins';
@import 'font-face';
@import 'baseline';
@import 'persistent/omnipresent';
@import 'persistent/header';
@import 'modular/wye-slider';
{% endcodeblock %}

{% codeblock lang:css main.scss %}
@import 'variables';
@import 'mixins';
@import 'persistent/footer';
@import 'section-specific';
@import 'modular/simple-columns';
@import 'modular/forms';
@import 'modular/buttons';
@import 'modular/browsehappy';
@import 'modular/project';
@import 'modular/client-logos';
@import 'modular/service';
@import 'modular/tooltip';
@import 'modular/icons';
@import 'responsive';
@import 'print';
{% endcodeblock %}

Then we call critical.scss from our document header, but inject the content of the file to the header when building the project. We achieve this by calling a simple ruby script using [grunt shell](https://github.com/sindresorhus/grunt-shell) only when invoking `grunt build`.

[We run PageSpeed](https://developers.google.com/speed/pagespeed/insights/?url=wyeworks.com&tab=mobile) and voilá! We get a great score of 98 on speed and 100 on user experience!.

## What we learned

la sicodelia, quiero ver como va quedando esto.
