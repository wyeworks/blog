---
layout: post
title: Rails for API applications (rails-api) released
categories:
- ruby
tags:
- api
- applications
- rails
- ruby
author: santiago.pastorino
published: true
date: 2012-04-20 21:59:00.000000000 -03:00
---
*[rails-api](https://github.com/spastorino/rails-api*) is a plugin developed by Yehuda Katz, José Valim, Carlos Antonio da Silva and me (Santiago Pastorino) which modifies Rails applications trimming down usually unneeded Rails functionalities for API applications. Do you remember we added support for this on core and [it was reverted](https://github.com/rails/rails/commit/6db930cb5bbff9ad824590b5844e04768de240b1?.) This plugin enables that again.

### What is an API app?

Traditionally, when people said that they used Rails as an [API", they meant providing a programmatically accessible API alongside their web application. For example, GitHub provides "an API](http://developer.github.com/) that you can use from your own API clients.

### Why using this instead of Rails?

Because you don't need the entire Rails middleware stack. Specifically you won't need middleware that are meant for browser applications. For example you probably won't need cookies support, but you can add that back if you want. You don't need most of the functionality provided by ActionController::Base like template generation for instance. And you won't need generated views, helpers and assets. The plugin also skips the asset pipelining.

### Configuration

#### For existing Rails applications you need ...

1. To add gem 'rails-api' to your Gemfile
1. Make *ApplicationController* inherit from *ActionController::API* instead of *ActionController::Base_. As with middleware, this will leave out any _ActionController* module that provides functionality primarily used by browser applications.
1. Remove respond&#95;to from your controllers and just use render :json instead.

#### For new apps

Install the gem if you haven't already:

bc. gem install rails-api


Then generate a new **Rails API** application:

bc. rails-api new my_api


And that's it, when you use the generators by default controllers will respond to json only.

### Middlewares

An api application comes with the following middlewares by default.

* *Rack::Cache_: Caches responses with public _Cache-Control* headers using HTTP caching semantics.
* _Rack::Sendfile_: Uses a front-end server's file serving support from your Rails application.
* _Rack::Lock_: If your application is not marked as threadsafe (@config.threadsafe!@), this middleware will add a mutex around your requests.
* *ActionDispatch::RequestId*
* *Rails::Rack::Logger*
* _Rack::Runtime_: Adds a header to the response listing the total runtime of the request.
* _ActionDispatch::ShowExceptions_: Rescue exceptions and re-dispatch them to an exception handling application.
* _ActionDispatch::DebugExceptions_: Log exceptions.
* _ActionDispatch::RemoteIp_: Protect against IP spoofing attacks.
* _ActionDispatch::Reloader_: In development mode, support code reloading.
* *ActionDispatch::ParamsParser_: Parse XML, YAML and JSON parameters when the request's _Content-Type* is one of those.
* *ActionDispatch::Head_: Dispatch _HEAD* requests as *GET* requests, and return only the status code and headers.
* _Rack::ConditionalGet_: Supports the @stale?@ feature in Rails controllers.
* *Rack::ETag_: Automatically set an _ETag* on all string responses. This means that if the same response is returned from a controller for the same URL, the server will return a _304 Not Modified_, even if no additional caching steps are taken. This is primarily a client-side optimization; it reduces bandwidth costs but not server processing time.

Other plugins, including _ActiveRecord_, may add additional middlewares. In general, these middlewares are agnostic to the type of app you are building, and make sense in an API-only Rails application.

You can get a list of all middlewares in your application via:

bc. rake middleware


#### Other Middlewares

Rails ships with a number of other middlewares that you might want to use in an API app, especially if one of your API clients is the browser:

* *Rack::MethodOverride_: Allows the use of the _&#95;method* hack to route POST requests to other verbs.
* *ActionDispatch::Cookies_: Supports the _cookie* method in _ActionController_, including support for signed and encrypted cookies.
* *ActionDispatch::Flash_: Supports the _flash* mechanism in _ActionController_.
* _ActionDispatch::BestStandards_: Tells Internet Explorer to use the most standards-compliant available renderer. In production mode, if ChromeFrame is available, use ChromeFrame.
* Session Management: If a *config.session&#95;store* is supplied, this middleware makes the session available as the *session* method in _ActionController_.

Any of these middlewares can be added via:

bc. config.middleware.use Rack::MethodOverride


#### Removing Middlewares

If you don't want to use a middleware that is included by default in the api middleware set, you can remove it using _config.middleware.delete_:

bc. config.middleware.delete ::Rack::Sendfile


Keep in mind that removing these features may remove support for certain features in _ActionController_.

### Choosing Controller Modules

An api application (using _ActionController::API_) comes with the following controller modules by default:

* *ActionController::UrlFor_: Makes _url&#95;for* and friends available
* *ActionController::Redirecting_: Support for _redirect&#95;to*
* _ActionController::Rendering_: Basic support for rendering
* *ActionController::Renderers::All_: Support for _render :json* and friends
* *ActionController::ConditionalGet_: Support for _stale?*
* *ActionController::ForceSSL_: Support for _force&#95;ssl*
* *ActionController::RackDelegation_: Support for the _request* and *response* methods returning *ActionDispatch::Request* and *ActionDispatch::Response* objects.
* *ActionController::DataStreaming_: Support for _send&#95;file* and *send&#95;data*
* *AbstractController::Callbacks_: Support for _before&#95;filter* and friends
* *ActionController::Instrumentation_: Support for the instrumentation hooks defined by _ActionController* (see [the source](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/instrumentation.rb) for more).
* _ActionController::Rescue_: Support for _rescue&#95;from_.

Other plugins may add additional modules. You can get a list of all modules included into *ActionController::API* in the rails console:

bc. ActionController::API.ancestors - ActionController::Metal.ancestors


#### Adding Other Modules

All Action Controller modules know about their dependent modules, so you can feel free to include any modules into your controllers, and all dependencies will be included and set up as well.

Some common modules you might want to add:

* *AbstractController::Translation_: Support for the _l* and *t_ localization and translation methods. These delegate to _I18n.translate* and _I18n.localize_.
* *ActionController::HTTPAuthentication::Basic* (or *Digest* or _Token_): Support for basic, digest or token HTTP authentication.
* _AbstractController::Layouts_: Support for layouts when rendering.
* _ActionController::MimeResponds_: Support for content negotiation (_respond&#95;to_, _respond&#95;with_).
* _ActionController::Cookies_: Support for _cookies_, which includes support for signed and encrypted cookies. This requires the cookie middleware.

The best place to add a module is in your _ApplicationController_. You can also add modules to individual controllers.

### How can I help?

Go to the project url [https://github.com/spastorino/rails-api](https://github.com/spastorino/rails-api) and report issues, test it in real apps and provide bug fixes. We have been measuring the plugin against some applications and we will post more about the results later. Meanwhile, if you can test it and share the improvements you found in your apps, would be awesome. To be able to add this functionality to core we need the plugin to show significant performance improvements for real API applications, so it's important to let us know about your results.

&lt;3 &lt;3 &lt;3 Find me at RailsConf. Tenderlove and I are giving out hugs for free!
