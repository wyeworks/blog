---
layout: post
title: Modifying Recurring Billing Transactions
category: Merchant
hero_image: /images/heros/post-high.jpg
author:
  name: Sebastián Martínez
  email: sebastian@wyeworks.com
  twitter_handle: smartinez87
  github_handle:  smartinez87
  image:  /images/team/sebastian.jpg
  description: VP of Engineering at WyeWorks. Ruby on Rails hacker. ExceptionNotification maintainer. Coffee & bacon lover.
published: true
---
Ok, it's been some time we don't post something in the blog, past weeks have been crazy at the office but now everything is back to normal, hopefully.

In this post I just want to tell that we added an extra ability to the recurring billing for BeanStream Gateway: **Modify an existing transaction.**

<!--more-->

It's pretty easy, you just need to do something like this:

<pre><code>  response = gateway.update_recurring(new_amount ,  new_options) </code></pre>

Remember, same for canceling, as BeanStream uses another API for managing these kind of transactions, we need to use the account_id for identifying the same, so you must include it on the options.
Then all same options can be passed.

Check it out here: [http://github.com/wyeworks/active_merchant](http://github.com/wyeworks/active_merchant.)

That's all, don't forget to comment!
