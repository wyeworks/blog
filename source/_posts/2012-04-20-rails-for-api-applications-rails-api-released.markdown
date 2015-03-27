---
layout: post
title: Rails for API applications (rails-api) released
hero_image: /blog/images/heros/post-high.jpg
comments: true
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle:  spastorino
  image:  /images/team/santiago-pastorino.jpg
  description: WyeWorks Co-Founder, Ruby on Rails Core Team Member
published: true
---
**[rails-api](https://github.com/spastorino/rails-api)** is a plugin developed by Yehuda Katz, José Valim, Carlos Antonio da Silva and me (Santiago Pastorino) which modifies Rails applications trimming down usually unneeded Rails functionalities for API applications.
Do you remember we added support for this on core and [it was reverted](https://github.com/rails/rails/commit/6db930cb5bbff9ad824590b5844e04768de240b1)?. This plugin enables that again.

<!--more-->

### What is an API app?

Traditionally, when people said that they used Rails as an "API", they meant providing a programmatically accessible API alongside their web application. For example, GitHub provides [an API](http://developer.github.com/) that you can use from your own API clients.

### Why using this instead of Rails?

Because you don't need the entire Rails middleware stack. Specifically you won't need middleware that are meant for browser applications. For example you probably won't need cookies support, but you can add that back if you want. You don't need most of the functionality provided by ActionController::Base like template generation for instance. And you won't need generated views, helpers and assets. The plugin also skips the asset pipelining.

### Configuration

#### For existing Rails applications you need …

1. To add gem 'rails-api' to your Gemfile
2. Make *ApplicationController* inherit from *ActionController::API* instead of *ActionController::Base*. As with middleware, this will leave out any *ActionController* module that provides functionality primarily used by browser applications.
3. Remove respond_to from your controllers and just use render :json instead.

#### For new apps

Install the gem if you haven't already:

    gem install rails-api

Then generate a new **Rails API** application:

    rails-api new my_api

And that's it, when you use the generators by default controllers will respond to json only.


### Middlewares

An api application comes with the following middlewares by default.

* *Rack::Cache*: Caches responses with public *Cache-Control* headers using HTTP caching semantics.
* *Rack::Sendfile*: Uses a front-end server's file serving support from your Rails application.
* *Rack::Lock*: If your application is not marked as threadsafe (`config.threadsafe!`), this middleware will add a mutex around your requests.
* *ActionDispatch::RequestId*
* *Rails::Rack::Logger*
* *Rack::Runtime*: Adds a header to the response listing the total runtime of the request.
* *ActionDispatch::ShowExceptions*: Rescue exceptions and re-dispatch them to an exception handling application.
* *ActionDispatch::DebugExceptions*: Log exceptions.
* *ActionDispatch::RemoteIp*: Protect against IP spoofing attacks.
* *ActionDispatch::Reloader*: In development mode, support code reloading.
* *ActionDispatch::ParamsParser*: Parse XML, YAML and JSON parameters when the request's *Content-Type* is one of those.
* *ActionDispatch::Head*: Dispatch *HEAD* requests as *GET* requests, and return only the status code and headers.
* *Rack::ConditionalGet*: Supports the `stale?` feature in Rails controllers.
* *Rack::ETag*: Automatically set an *ETag* on all string responses. This means that if the same response is returned from a controller for the same URL, the server will return a *304 Not Modified*, even if no additional caching steps are taken. This is primarily a client-side optimization; it reduces bandwidth costs but not server processing time.

Other plugins, including *ActiveRecord*, may add additional middlewares. In general, these middlewares are agnostic to the type of app you are building, and make sense in an API-only Rails application.

You can get a list of all middlewares in your application via:

    rake middleware

#### Other Middlewares

Rails ships with a number of other middlewares that you might want to use in an API app, especially if one of your API clients is the browser:

* *Rack::MethodOverride*: Allows the use of the *_method* hack to route POST requests to other verbs.
* *ActionDispatch::Cookies*: Supports the *cookie* method in *ActionController*, including support for signed and encrypted cookies.
* *ActionDispatch::Flash*: Supports the *flash* mechanism in *ActionController*.
* *ActionDispatch::BestStandards*: Tells Internet Explorer to use the most standards-compliant available renderer. In production mode, if ChromeFrame is available, use ChromeFrame.
* Session Management: If a *config.session_store* is supplied, this middleware makes the session available as the *session* method in *ActionController*.

Any of these middlewares can be added via:

    config.middleware.use Rack::MethodOverride

#### Removing Middlewares

If you don't want to use a middleware that is included by default in the api middleware set, you can remove it using *config.middleware.delete*:

    config.middleware.delete ::Rack::Sendfile

Keep in mind that removing these features may remove support for certain features in *ActionController*.

### Choosing Controller Modules

An api application (using *ActionController::API*) comes with the following controller modules by default:

* *ActionController::UrlFor*: Makes *url_for* and friends available
* *ActionController::Redirecting*: Support for *redirect_to*
* *ActionController::Rendering*: Basic support for rendering
* *ActionController::Renderers::All*: Support for *render :json* and friends
* *ActionController::ConditionalGet*: Support for *stale?*
* *ActionController::ForceSSL*: Support for *force_ssl*
* *ActionController::RackDelegation*: Support for the *request* and *response* methods returning *ActionDispatch::Request* and *ActionDispatch::Response* objects.
* *ActionController::DataStreaming*: Support for *send_file* and *send_data*
* *AbstractController::Callbacks*: Support for *before_filter* and friends
* *ActionController::Instrumentation*: Support for the instrumentation hooks defined by *ActionController* (see [the source](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/instrumentation.rb) for more).
* *ActionController::Rescue*: Support for *rescue_from*.

Other plugins may add additional modules. You can get a list of all modules included into *ActionController::API* in the rails console:

    ActionController::API.ancestors - ActionController::Metal.ancestors

#### Adding Other Modules

All Action Controller modules know about their dependent modules, so you can feel free to include any modules into your controllers, and all dependencies will be included and set up as well.

Some common modules you might want to add:

* *AbstractController::Translation*: Support for the *l* and *t* localization and translation methods. These delegate to *I18n.translate* and *I18n.localize*.
* *ActionController::HTTPAuthentication::Basic* (or *Digest* or *Token*): Support for basic, digest or token HTTP authentication.
* *AbstractController::Layouts*: Support for layouts when rendering.
* *ActionController::MimeResponds*: Support for content negotiation (*respond_to*, *respond_with*).
* *ActionController::Cookies*: Support for *cookies*, which includes support for signed and encrypted cookies. This requires the cookie middleware.

The best place to add a module is in your *ApplicationController*. You can also add modules to individual controllers.

### How can I help?

Go to the project url [https://github.com/spastorino/rails-api](https://github.com/spastorino/rails-api) and report issues, test it in real apps and provide bug fixes. We have been measuring the plugin against some applications and we will post more about the results later. Meanwhile, if you can test it and share the improvements you found in your apps, would be awesome. To be able to add this functionality to core we need the plugin to show significant performance improvements for real API applications, so it's important to let us know about your results.

<3 <3 <3 Find me at RailsConf. Tenderlove and I are giving out hugs for free!

**Update #1**: Wycats who after working with us (South American rubyists) is known as wygatos (figure our why :P), is adhering to the campaign of giving hugs for free.
