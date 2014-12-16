---
layout: post
title: Rails delegate method
category: Rails
author:
  name: Sebastián Martínez
  email: sebastian@wyeworks.com
  twitter_handle: smartinez87
  github_handle:  smartinez87
  image:  /images/team/sebastian.jpg
published: true
---
Delegation is a feature Rails introduced in it's 2.2 version, and in my opinion are quite useful and somehow something we don't see too much around.
The concept of delegation is to take some methods and send them off to another object to be processed.

Let me explain this with a brief example:

Suppose you have a User class for anyone registered on your site, and a Customer class for those who have actually placed orders:

<pre>
<code class="ruby">class User < ActiveRecord::Base  
   belongs_to :customer  
end  
  
class Customer < ActiveRecord::Base  
   has_one :user  
end</code>
</pre>

As for now, if you are in a Customer instance, you can get their User information doing *@customer.user.name*, or *@customer.user.email*.
Delegation allows you to simplify this:

<pre>
<code class="ruby">class User < ActiveRecord::Base  
   belongs_to :customer  
end  
   
class Customer < ActiveRecord::Base  
   has_one :user  
   delegate :name, :name=, :email, :email=, :to => :user  
end</code>
</pre>

Now you can refer to **@customer.name** and **@customer.email** to retrieve and set values for those attributes directly. Pretty nice, huh?

We are now working on some code to make possible to inherit behaviour, along with polymorphic associations, so when you create a Cutomer, the User gets created as well with the data you provided when creating the customer, and so on.

So keep posted, for there will be more to come...
