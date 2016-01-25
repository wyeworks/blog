---
layout: post
title: "Upgrading to Ruby on Rails 5.0"
category:
comments: true
author:
  name: Santiago Pastorino
  email: santiago@wyeworks.com
  twitter_handle: spastorino
  github_handle: spastorino
  image: /images/team/santiago-pastorino.jpg
  description:
---

In this post, we’re going to update the Rails 4.2.5 application to Rails 5.0.0.beta1. If we didn’t already have that version, we would have to first update to Rails 4.2.5 and clean up the possible warnings generated. A good test suite is recommended - our application has them - but if we didn’t have them, it would be good to be able to add a few automated tests that lend us some confidence before jumping into the new Rails 5.0. Not doing so would confront us with too many risks. 

What's the first thing one does when updating a Rails application? Personally, the first thing I try to do is become well-informed regarding the changes the new application includes. To do this, I generally look at the Rails upgrade guide - in our case [Upgrading from Rails 4.2 to Rails 5.0](http://edgeguides.rubyonrails.org/upgrading_ruby_on_rails.html#upgrading-from-rails-4-2-to-rails-5-0) - and I take a look at the CHANGELOG.md file for each one of the frameworks. In my case, given that I form part of the Rails core team, I follow its development rather closely, which makes it a bit easier for me to stay on top of everything. At any rate, following the upgrade guide and taking a look at the CHANGELOGs should be sufficient, although if you’re interested in seeing what’s currently happening, you can follow the day-to-day changes that are introduced in Rails. 

From the upgrade guide (still very inadequate), we learn that some of the changes in Rails 5.0 are:

- Requiring that we use at least Ruby 2.2.2 or newer
- The models inherit from ApplicationRecord 
- The jobs inherit from ApplicationJob (although inheriting from Application* isn’t required)
- Using throw(:abort) instead of returning false for callback halting.

After familiarizing ourselves a bit (in the article we skip the topic of CHANGELOGs), we can move on to updating the application. We’ll show you how we ourselves update a small application that we’re developing, obviously keeping in mind that every application is going to present its own challenges and peculiarities.


## First naive attempt to upgrade

Given that our application already worked with Ruby 2.2.2, we didn’t have to do anything in this respect.

The first step we took was to modify the Gemfile by changing the Rails version from 4.2.5 to 5.0.0.beta1. The Gemfile needs to have a line with `gem 'rails', '5.0.0.beta1'`.

The following step is to execute `bundle update rails` and ...

```
    devise was resolved to 3.5.2, which depends on
      railties (< 5, >= 3.2.6)
```

It was a very likely possibility that some gems were still not compatible with Rails 5. In the case of devise, the master version does indeed support Rails 5 and we therefore change the devise line in the `Gemfile` to `gem 'devise', github: 'plataformatec/devise'`.

We again execute `bundle update rails` and ...

```
    minitest-rails was resolved to 2.2.0, which depends on
      railties (~> 4.1)
```

For this gem, there’s no version that will fix the problem. Still, the first thing I asked myself was, what things were we using from that gem. The gem sets up the minitest spec DSL and adds some generators, but we weren’t using the DSL, nor the generators, so we simply erase this Gemfile entry. 

We execute `bundle update rails` again ...

```
    minitest-rails-capybara was resolved to 2.1.1, which depends on
      minitest-rails (~> 2.1) was resolved to 2.2.0, which depends on
        railties (~> 4.1)
```

We are using minitest-rails-capybara, which depends on minitest-rails. We just erased the Gemfile, but owing to this dependency, minitest-rails continues trying to install. We follow the same procedure from the previous case, asking ourselves, “What do we need minitest-rails-capybara for?” The reality is that we don’t need it either, we’ll simply use minitest-capybara, which is one of its dependencies.

Therefore:

- We substitute the minitest-capybara for the minitest-rails-capybara entry
- We call a require of `capybara/rails` in place of `minitest/rails/capybara` in the `test_helper.rb`.
- We make sure that the integration tests inherit from `ActionDispatch::IntegrationTest` instead of from `Capybara::Rails::TestCase` (a class of minitest-rails-capybara).
- And lastly we add the following to `test_helper.rb` ...

```
class ActionDispatch::IntegrationTest
  include Capybara::DSL
  include Capybara::Assertions

  ...
end
```

We execute `bundle update rails` again and now it installs everything correctly.

Now we can run the tests, for example.
Hence, we execute `bin/rails test` (this is the new way to run tests in Rails 5!) and we have various tests failing.


## Problem 1 - the tests fail and we don’t have any further information

From this point forward, the Rails guides give us no further information and we still have various tests failing. In particular, failing is a series of tests of the following form ...

```
ActionController::RoutingError: No route matches [POST] "/accounts/1/transactions/1"
```

The next thing we can do is force our application to use [Rails master](https://github.com/rails/rails) in order to see if some of the test failures are due to problems already solved.
So, we substitute the Gemfile Rails entry with `gem 'rails', github: 'rails/rails'` and once again execute `bundle update rails`.

We return to running the tests with `bin/rails test` and the tests that fail with RoutingError disappear.
There are, however, other tests that continue failing.
And now, we have no choice but to begin investigating the errors one by one. 


## Problem 2 - expected Array (got String) for param xxx

One of the errors that `bin/rails test` gives us is ...

```
E

ActionController::BadRequest: Invalid request parameters: expected Array (got String) for param `kind'

bin/rails test test/features/entries/create_entry_test.rb:38
```

The feature test tries to create an Entry from the form. An Entry in our system is a movement of money that, among other attributes, has a kind attribute with a value of expense, income or transfer. The kind field is an enum in the model and is represented by a radio button in the form. The error indicates that for some reason Rails is expecting an Array when it should be expecting a String.

The first thing that to me seemed reasonable to review was, what is being sent to the server and how. The HTML generated for this form is as follows ...

```
<input value="income" name="entry[kind]" id="entry_kind" type="radio">
```

which is correct, but this also appears ...

```
<input name="entry[kind][]" value="" type="hidden">
```

The hidden is for forcing an empty value to be sent to the server even when the user isn’t clicking one of the options that the radio buttons present.
This is fine, but [] appear at the end of the input’s name, which causes the data to arrive to the server as an Array when it should arrive as a String - this is what’s incorrect. 

Researching the changes in Rails a bit, we find ourselves with a regression inserted in [this commit](https://github.com/rails/rails/commit/491013e06d0ad4a296cc23be6c4a48bb0a98106f). This regression isn’t occurring because of the hidden field having been inserted via the radio buttons, but rather it appears because we are reusing all of the code used by the checkboxes, which need to send an Array of elements and not a String.
In [this line](https://github.com/rails/rails/commit/491013e06d0ad4a296cc23be6c4a48bb0a98106f#diff-ad5a6748d86270f717368d13026b475bL44) specifically, note the [] at the end of the String – they were there and this only makes sense for the checkboxes. That code was moved [here](https://github.com/rails/rails/commit/491013e06d0ad4a296cc23be6c4a48bb0a98106f#diff-f881ed71156b4aa73c4604ca14b074d9R104) and that method is now utilized by both the radio buttons and the checkboxes. That’s where the error is – the radio buttons shouldn’t have [] at the end.

It was necessary to fix the problem in Rails and upload it to the master :). [Here's the fix](https://github.com/rails/rails/commit/7e583b73c4e7ddad2241b2ca05b3c16a5fdf0cc6).
With that fix in the master, we update the master reference that we’re using in our application simply by executing `bundle update rails`, running the tests and problem solved.

One less problem, but there are still more.


## Problem 3 - Model enum attribute not saved

`bin/rails test` gives us ...

```
Expected to find text "Expense" in "Groceries Edit Delete".
```

In this test, the Category model, which has a name (in the test the value is Groceries) and a kind with the possible values `income`, `expense` and `any`, comes into play.

The error suggests that the Category is not able to persist the kind value. We quickly try to save a Category with kind expense from the console ...

```
irb(main):001:0> Category.create!(name: 'Groceries', kind: 'expense')
=> #<Category id: 1, name: "Groceries", kind: nil, created_at: "2016-01-20 19:29:35", updated_at: "2016-01-20 19:29:35">
```

There’s where the error comes from, kind isn't saving.

In our case, kind is an enum in the Category model and is represented as a PostgreSQL enum. In order for this combination to work correctly, we need to “hack” the mapping that Active Record creates by default for the enums since, by default, they are returned as integers and we would need Strings for PostgreSQL. Hence, the enums declaration must be something like ... `enum kind: { expense: 'expense', income: 'income', any: 'any' }`. With that declaration, the enums stop using the default mapping to integers and each declared key is mapped to the String that we put in the Hash. This syntax functions correctly in Rails 4.2 but, for some reason, we are not able to save the enums in Rails 5.0.

Debugging, I find out that in Rails 5.0 the deserialization method of the enums (the one that, given a value, returns the enum key), defines `mapping.key(value.to_i)`. This is valid when we don’t customize the mapping. In our case, value is a String and there’s no reason to include `to_i`. Why, then, don't we leave the original value? And [that was precisely the fix](https://github.com/rails/rails/commit/e991c7b8cd69d7ba5e221a19e5f386e3ba02eb9d).

Yet one problem less, but some failing tests remain. 


## Problem 4 - Capybara::ElementNotFound: Unable to find button "Create Xxx"

`bin/rails test` gives us ...

```
Capybara::ElementNotFound: Unable to find button "Create Category"
```

The error indicates that, for some reason, it can’t find the submit button with the name `Create Category`. A simple look at the page where this button is found shows us that right now the button has the name `Create category`, category in all lowercase.

Looking for changes in the Rails code related to that, I find [this commit](https://github.com/rails/rails/commit/c74f9cc0e8b68697e0d1917b876ffdf404ade3fc). The new form seems fine to me but it’s breaking this type of test. 

We change the tests in our application so that they look through `Create category` then do the same for the rest of the equivalent cases that fail and voila, the tests pass.

With this last change, all of our application’s tests pass. After that, it’s a good idea to test the application by hand and there the following presents itself ...


## Problem 5 - render partial of .html files escapes the content

One case that our tests don’t cover: The header and footer show escaped on the screen (that’s to say, we see these templates’ source code directly in the browser!).

Our header and footer are partials with the extension .html, not .html.erb. After debugging, I notice that the [Raw handler](https://github.com/rails/rails/blob/v5.0.0.beta1/actionview/lib/action_view/template/handlers/raw.rb) is being used to manage those partials and the Raw handler, as seen in the code, returns a String. The render partial is therefore returning a String instead of an OutputBuffer to the process of renderization of the application layout. However, the application layout assembles the HTML to be rendered as an OutputBuffer upon concatenating the String received from the render partial. Since a String is not HTML safe, all that partial’s content is left escaped, thus generating the problem in question.

This began happening after [this commit](https://github.com/rails/rails/commit/4be859f0fdf7b3059a28d03c279f03f5938efc80). Previously, the ERB handler processed an .html file and returned an OutputBuffer. As the default handler is now the Raw handler, the Raw handler processes it and returns a String. This doesn’t mean that the change is completely incorrect, it simply means that changing the default handler presents this detail that must be fixed. 

Not only were the .html files being processed by the ERB handler, but [also the .js files](https://github.com/rails/rails/issues/2394), among others. Naturally, it makes little sense to use the ERB handler in flat JavaScript files and it’s for these cases that [the Raw handler was incorporated](https://github.com/rails/rails/commit/8bea607265a2c9bb9bb2188b0a79089ca373b814).

The issue is that the render of an .html file should always return an OutputBuffer, since by definition the content is HTML safe. Regardless of the context, be it render template, partial, or whatever, it’s because of that that [we introduced a new HTML handler](https://github.com/rails/rails/commit/8a998b0fa7523c2c8eb6d0cf56e40408bf6e9b2e).

With this commit, after a `bundle update rails`, the footer appears in the correct way and the header “improves”, but now it shows the ERB code on the page instead of interpreting it. The problem is that the header contains ERB code but the name of the file is  `_header.html`. In Rails 4.2.5, this worked well because by default the ERB Handler processed it. In Rails 5.0, prior to our change, the Raw handler processed it and now the HTML handler processes it because the file ends in .html and the latter is the correct behavior. In our case, the incorrect thing is that the name of the file is `_header.html` and it contains ERB code. The name should have always been `_header.html.erb`. We rename the file and the header begins to be rendered in the correct manner.

And with this, we have passing tests and a properly functioning application.


## To wrap up, we synchronize our files the Rails 5 way

We have passing tests and the application is functioning. This is a good time to polish some of the details, fix warnings and adapt our code a bit more to the new version of Rails.

For this, one of the first things that can be done is to run `bin/rails rails:update`. The process will ask us file by file if we want to overwrite them with the new versions. We can see the diff at that moment and, after this, decide or we can make the decision to modify them by hand afterwards. I prefer to start up a new application in another directory, generate a scaffold and go file by file comparing and choosing the new one and/or the one that interests me.

Like usual, a few initializers are added, there are a few changes in config/environments/, an app/models/application_record.rb is added and the models now inherit from ApplicationRecord. We can influence these changes.

Within the new initializers, `config/initializers/active_record_belongs_to_required_by_default.rb` is added, which makes it so that the belongs_to cannot be nil. In our case, we need some to be nil, so we have to add the option `optional: true` to the relations. For example, `belongs_to :category, optional: true`.

Also, config/initializers/callback_terminator.rb is added, which makes it so that the callbacks do not halt more when a false is returned. The way to halt now is with `throw(:abort)`. In our application, this was irrelevant.

After incorporating all the changes, we return to running the tests and testing the application by hand, and everything functions wonderfully.


## Conclusion

In general, it’s not as easy as it might seem to update to a Rails beta. We have to be ready to deal with some external problems, debug third-party code, etc.

Not all the gems we use are ready to work with Rails 5.0.0.beta1. In the case that they don’t work, we could check if the development versions of those gems function or if there’s a branch of Rails 5, or something of that nature. Otherwise, we must resort to another solution or adapt the gem to Rails 5.

Considering all these difficulties, we may ask ourselves why we should update our application to a beta version of Rails and not wait for the final version (or at least the release candidate). There are a few good reasons for this: It’s a good way to anticipate the problems that our new application can have with the new version of Rails, and besides being able to report possible problems and thus assure ourselves that the new version of Rails is going to work correctly with our application, we can also verify the state of the gems that our project utilizes. It’s also an excellent way to contribute to the development of Rails, given that the testing of the beta version depends on the community. And, it serves as a learning experience and contributes to Rails – even if it’s just reporting the problems that arise during the migration.

It’s quite probable that if you update your applications, you will come across some issue that is not covered in this article. My recommendation is to follow a process similar to the one we followed in this article and to be ready to fix the problems that come up in Rails itself or in one of the gems that we use.

The beta2 or rc1 is going to be released on the 1st of February and is already going to resolve all of these problems. However, as mentioned throughout the article, if the released or “stable” version doesn’t work for us, we should try with the master directly.

What procedure do you follow when updating? Please leave comments regarding your experiences, and if this article motivates you to update or follow this procedure when updating one of your applications, please let us know how the process went for you.
