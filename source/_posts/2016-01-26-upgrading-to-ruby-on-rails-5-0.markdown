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

**Edit: In this post we're upgrading an application to Rails 5.0.0.beta1.1 and [Rails 5.0.0.beta2 is now already released](https://rubygems.org/gems/rails/versions/5.0.0.beta2).
Throughout this post we show some patches we needed to apply to Rails to get our application working. Those patches are now included as part of Rails 5.0.0.beta2.
We still consider this post worth reading to get an interesting view of how to upgrade your applications to newer versions of Rails and betas in particular.**

In this post, we’re going to upgrade a Rails 4.2.5 application to Rails 5.0.0.beta1.1. If we didn’t already have that version, we would have to first upgrade to Rails 4.2.5 and clean up the possible warnings generated before continuing. A good test suite is recommended - our application has them - but if we didn’t have them, it would be good to have the ability to add a few automated tests that lend us some confidence before jumping into the new Rails 5. Not doing so would confront us with too many risks.

What's the first thing one does when upgrading a Rails application? Personally, the first thing I try to do is become well-informed regarding the changes the new application includes. To do this, I generally look at the Rails upgrade guide - in our case [Upgrading from Rails 4.2 to Rails 5.0](http://edgeguides.rubyonrails.org/upgrading_ruby_on_rails.html#upgrading-from-rails-4-2-to-rails-5-0) - and I take a look at the CHANGELOG.md file for each one of Rails’ different frameworks. In my case, given that I form part of the Rails core team, I follow its development rather closely, which makes it a bit easier for me to stay on top of everything. At any rate, following the upgrade guide and taking a look at the CHANGELOGs should be sufficient, although if you’re interested in seeing what’s currently happening, you can follow the [day-to-day changes](https://github.com/rails/rails/commits) that are introduced in Rails.

<!-- more -->

From the upgrade guide (still somewhat incomplete), we learn that some of the changes in Rails 5 are:

- Requiring that we use at least Ruby 2.2.2 or newer
- The models inherit from ApplicationRecord (although not required)
- The jobs inherit from ApplicationJob (although not required)
- Using throw(:abort) instead of returning false for callback halting

After familiarizing ourselves a bit with the above (in the article we skip the look through the CHANGELOGs part), we can move on to upgrading an application. We’ll show you how we ourselves upgrade a small application that we’re developing, obviously keeping in mind that every application is going to present its own challenges and peculiarities.


## First naive attempt to upgrade

Given that our application already worked with Ruby 2.2.2, we didn’t have to do anything in this respect.

The first step we took was to modify the Gemfile by changing the Rails version from 4.2.5 to 5.0.0.beta1.1. The Gemfile needs to have a line with `gem 'rails', '5.0.0.beta1.1'`.

The next step is to execute `bundle update rails` and we get:

```
    devise was resolved to 3.5.2, which depends on
      railties (< 5, >= 3.2.6)
```

It was highly probable that some gems were still not compatible with Rails 5. In the case of devise, the master version does indeed support Rails 5 and we therefore change the devise line in the `Gemfile` to `gem 'devise', github: 'plataformatec/devise'`.

We again execute `bundle update rails` and we get:

```
    minitest-rails was resolved to 2.2.0, which depends on
      railties (~> 4.1)
```

For this gem, there’s no version that fixes the problem as of yet. Still, the first thing I asked myself was, what things were we using from that gem. The gem sets up the minitest spec DSL and adds some generators, but we weren’t using the DSL, nor the generators, so we simply erase this Gemfile entry.

We execute `bundle update rails` again and we get:

```
    minitest-rails-capybara was resolved to 2.1.1, which depends on
      minitest-rails (~> 2.1) was resolved to 2.2.0, which depends on
        railties (~> 4.1)
```

We are using minitest-rails-capybara, dependent on minitest-rails, which we’ve just removed from the Gemfile, but owing to this dependency, minitest-rails continues trying to install. We follow the same procedure from the previous case, asking ourselves, “What do we need minitest-rails-capybara for?” The reality is that we don’t need it either, we’ll simply use minitest-capybara, which is one of its dependencies.

Therefore:

- We substitute the minitest-capybara for the minitest-rails-capybara entry
- In place of `minitest/rails/capybara` in the `test_helper.rb`, we require `capybara/rails`
- We make sure that the integration tests inherit from `ActionDispatch::IntegrationTest` instead of from `Capybara::Rails::TestCase` (a class of minitest-rails-capybara).
- And lastly we add the following to `test_helper.rb`:

```
class ActionDispatch::IntegrationTest
  include Capybara::DSL
  include Capybara::Assertions

  ...
end
```

We execute `bundle update rails` again and now it installs everything correctly.

Now we can run the tests.
Hence, we execute `bin/rails test` (this is the new way to run tests in Rails 5!) and we have various tests failing.


## Problem 1 - the tests fail and we don’t have any further information

From this point forward, the Rails guides give us no further information and we still have various tests failing. In particular, there are some failing tests with the following form:

```
ActionController::RoutingError: No route matches [POST] "/accounts/1/transactions/1"
```

The next thing we can do is force our application to use [Rails master](https://github.com/rails/rails) in order to see if some of the test failures are due to problems already resolved.
So, we substitute the Rails Gemfile entry with `gem 'rails', github: 'rails/rails'` and once again execute `bundle update rails`.

We return to running the tests with `bin/rails test` and the tests that failed with RoutingError disappear.
There are, however, other tests that continue failing.
And now, we have no choice but to begin investigating the errors one by one.


## Problem 2 - expected Array (got String) for param xxx

One of the errors that `bin/rails test` gives us is:

```
E

ActionController::BadRequest: Invalid request parameters: expected Array (got String) for param `kind'

bin/rails test test/features/entries/create_entry_test.rb:38
```

The feature test tries to create an Entry using the corresponding form. An Entry in our system is a movement of money that, among other attributes, has a kind attribute with a possible value of expense, income or transfer. The kind field is an enum in the model and is represented by a radio button in the form. The error indicates that for some reason Rails is expecting an Array when it should be expecting a String.

The first thing that to me seemed reasonable to review was, what is being sent to the server and how. The HTML generated for this form contains the following:

```
<input value="income" name="entry[kind]" id="entry_kind" type="radio">
```

which is correct, but it also includes:

```
<input name="entry[kind][]" value="" type="hidden">
```

The hidden field is to force an empty value to be sent to the server even when the user isn’t clicking one of the options that the radio buttons present.
This is fine, but the [] that appears at the end of the input’s name, causes the data to arrive to the server as an Array when it should arrive as a String - this is what’s incorrect.

Researching the changes in Rails, we find ourselves with a regression inserted in [this commit](https://github.com/rails/rails/commit/491013e06d0ad4a296cc23be6c4a48bb0a98106f). This regression isn’t occurring because of the hidden field having been inserted via the radio buttons; rather, it appears because the code used by the checkboxes (which need to send an Array of elements and not a String) is being reused.
In [this line](https://github.com/rails/rails/commit/491013e06d0ad4a296cc23be6c4a48bb0a98106f#diff-ad5a6748d86270f717368d13026b475bL44) specifically, note the [] at the end of the String – having these only makes sense for the checkboxes. That code was moved [here](https://github.com/rails/rails/commit/491013e06d0ad4a296cc23be6c4a48bb0a98106f#diff-f881ed71156b4aa73c4604ca14b074d9R104) and that method is now utilized by both the radio buttons and the checkboxes. That’s where the error is – the radio buttons shouldn’t have the [] at the end.

It was necessary to fix the problem in Rails and push to master :). [Here's the fix](https://github.com/rails/rails/commit/7e583b73c4e7ddad2241b2ca05b3c16a5fdf0cc6).
With that fix in master, we update the master reference that we’re using in our application simply by executing `bundle update rails`, running the tests and problem solved.

One less problem, but there are still more.


## Problem 3 - Model enum attribute not saved

`bin/rails test` gives us:

```
Expected to find text "Expense" in "Groceries Edit Delete".
```

In this test, the Category model, which has a name (in the test the value is `Groceries`) and a kind with the possible values `income`, `expense` and `any`, comes into play.

The error suggests that the Category is not able to persist the kind value. We quickly try to save a Category with kind `expense` from the console:

```
irb(main):001:0> Category.create!(name: 'Groceries', kind: 'expense')
=> #<Category id: 1, name: "Groceries", kind: nil, created_at: "2016-01-20 19:29:35", updated_at: "2016-01-20 19:29:35">
```

That’s where the error comes from, the value for kind won’t save.

In our case, kind is an enum in the Category model and is represented as a PostgreSQL enum. In order for this combination to work correctly, we need to “hack” the mapping that Active Record creates by default for the enums since, by default, it maps to integers and we would need strings for PostgreSQL. Hence, the enums declaration must be something like:

```
enum kind: { expense: 'expense', income: 'income', any: 'any' }
```

With that declaration, the enums stop using the default mapping to integers and each declared key is mapped to the String that we put in the Hash. This syntax functions correctly in Rails 4.2 but, for some reason, not in Rails 5.

Debugging, I find out that in Rails 5 the deserialization method of the enums (the one that, given a value, returns the enum key), defines `mapping.key(value.to_i)`. This is valid when we don’t customize the mapping. In our case, value is a String and there’s no reason to include `to_i`. Why, then, don't we leave the original value? And [that was precisely what we did](https://github.com/rails/rails/commit/e991c7b8cd69d7ba5e221a19e5f386e3ba02eb9d).

Yet one problem less, but some failing tests remain.


## Problem 4 - Capybara::ElementNotFound: Unable to find button "Create Xxx"

`bin/rails test` gives us:

```
Capybara::ElementNotFound: Unable to find button "Create Category"
```

The error indicates that, for some reason, it can’t find the submit button with the name `Create Category`. A simple look at the page where this button is found shows us that right now the button has the name `Create category`, category in all lowercase.

Looking for changes in the Rails code related to that, I find [this commit](https://github.com/rails/rails/commit/c74f9cc0e8b68697e0d1917b876ffdf404ade3fc). The new form seems fine to me but it’s breaking these kinds of tests.

We change the tests in our application so that they look for the `Create category` button, then do the same for the rest of the equivalent cases that have failed and voila, the tests pass.

With this last change, all of our application’s tests pass. Next, it’s a good idea to test the application by hand and, sure enough, we come across the following problem.


## Problem 5 - render partial of .html files escapes the content

One case that our tests don’t cover: The header and footer show escaped content on the screen (that’s to say, we see these templates’ source code directly in the browser!).

Our header and footer are partials with the extension .html, not .html.erb. After debugging, I notice that the [Raw handler](https://github.com/rails/rails/blob/v5.0.0.beta1.1/actionview/lib/action_view/template/handlers/raw.rb) is being used to manage those partials and the Raw handler, as seen in the code, returns a String. The render partial is therefore returning a String instead of an OutputBuffer to the renderization process of the application layout. However, the application layout assembles the HTML to be rendered as an OutputBuffer upon concatenating the String received from the render partial. Since a String is not HTML safe, all that partial’s content is left escaped, thus generating the problem in question.

This began happening after [this commit](https://github.com/rails/rails/commit/4be859f0fdf7b3059a28d03c279f03f5938efc80). Previously, the ERB handler processed an .html file and returned an OutputBuffer. As the default handler is now the Raw handler, the Raw handler processes it and returns a String. This doesn’t mean that the change is at all incorrect, it simply means that changing the default handler presents this issue that must be addressed.

Not only were the .html files being processed by the ERB handler, but [also the .js files](https://github.com/rails/rails/issues/2394), among others. Naturally, it makes little sense to use the ERB handler in plain JavaScript files and it’s for these cases that [the Raw handler was incorporated](https://github.com/rails/rails/commit/8bea607265a2c9bb9bb2188b0a79089ca373b814) in the first place.

The issue is that the render of an .html file should always return an OutputBuffer, since by definition the content is HTML safe. It’s because of that that [we introduced a new HTML handler](https://github.com/rails/rails/commit/8a998b0fa7523c2c8eb6d0cf56e40408bf6e9b2e).

With this commit, after a `bundle update rails`, the footer appears in the correct way and the header “improves”, but now it shows the ERB code on the page instead of interpreting it. The problem is that the header contains ERB code but the name of the file is  `_header.html`. In Rails 4.2.5, this worked well because the ERB Handler processed it by default. In Rails 5, prior to our change, the Raw handler processed it but now after our change the HTML handler processes it because the file ends in .html. However, in this case we need the ERB handler to process it. To make that happen, we need to change the filename, `_header.html`, to what it should have always been, `_header.html.erb`. We rename the file and the header is rendered in the correct manner.

And with this, we have passing tests and a properly functioning application.


## To wrap up, we synchronize our files the Rails 5 way

We have passing tests and the application is functioning. This is a good time to polish some of the details, fix warnings and adapt our code a bit more to the new version of Rails.

For this, one of the first things that can be done is to run `bin/rails rails:update`. The process will ask us file by file if we want to overwrite them with the new versions. We can see the diff at that moment and, after this, decide or we can make the decision to modify them by hand afterwards. I prefer to start up a new application in another directory, generate a scaffold and go file by file comparing and choosing the new one and/or the one that interests me.

Like usual, a few initializers are added, there are a few changes in config/environments/, an app/models/application_record.rb is added and the models now inherit from ApplicationRecord. We can apply these changes.

Within the new initializers, config/initializers/active_record_belongs_to_required_by_default.rb is added, which makes it so that the belongs_to cannot be nil. In our case, we need some to be nil, so we have to add the option `optional: true` to the relations. For example, `belongs_to :category, optional: true`.

Also, config/initializers/callback_terminator.rb is added, which makes it so that the callbacks do not halt more when a false is returned. The way to halt now is with `throw(:abort)`. In our application, this was irrelevant and had no effect.

After incorporating all the changes, we return to running the tests and testing the application by hand, and everything functions wonderfully.


## Conclusion

In general, it’s not as easy as it might seem to upgrade to a Rails beta. We have to be ready to deal with some external problems, debug third-party code, etc.

Not all the gems we use are ready to work with Rails 5. In the case that they don’t work, we could check if the development versions of those gems function or if there’s a branch with Rails 5 support, or something of that nature. Otherwise, we must resort to another solution or adapt the gem to Rails 5.

Considering all these difficulties, we may ask ourselves why we should upgrade our application to a beta version of Rails and not wait for the final version (or at least the release candidate). There are a few good reasons for this. First, it’s a good way to anticipate the problems that our new application might have with the new version of Rails. Moreover, besides being able to report possible problems and thus assure ourselves that the new version of Rails is going to work correctly with our application, we can also verify the state of the gems that our project utilizes. Additionally, it’s an excellent way to contribute to the development of Rails, given that the testing of the beta version depends on the community. And, it serves as a learning experience and contributes to Rails, even if we’re just reporting the problems that arise during the migration.

It’s quite probable that if you upgrade your applications, you will come across some issues that aren’t covered in this article. My recommendation is to follow a process similar to the one we laid out in this article and to be ready to fix the problems that come up in Rails itself or in one of the gems that you use.

The beta2 or rc1 is going to be released on the 1st of February and is going to include fixes for the problems described in the article. However, as mentioned throughout this article if in the future you upgrade to a beta version of Rails and hit issues, you can try master to see if it fixes them.

What procedure do you follow when upgrading? Please leave your comments regarding your experiences, and if this article motivates you to upgrade or follow this procedure when upgrading one of your applications, please let us know how the process went for you.
