---
layout: post
title: bundle exec rails … executes Bundler.setup 3 times
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
*TL;DR*: don't run *bundle exec* before *rails* command, rails already checks the presence of *Bundler* through the *Gemfile* and sets up everything according to it without the overhead of *bundle exec_. _rails* command is the only exception to the rule. Additionally I've added a [patch](https://github.com/carlhuda/bundler/commit/2c838255ccadadeab5298b7c2bbc39035e59f248) to *Bundler* that avoids calling Bundler.setup which adds unnecessary overhead.

<!--more-->

I was researching on a huge *Bundler 1.1* performance regression, [@masterkain](http://twitter.com/masterkain) was hitting when running *bundle exec rails runner ''* (you shouldn't run bundle exec before the *rails* command, but keep reading for now). I started to profile it using *ruby-prof* and one of the things I realized was that *Bundler.setup* (which is a considerable slow method because it calls [Bundler::Runtime#setup](https://github.com/carlhuda/bundler/blob/2a38a24a295b6e978f0c982d454a3a9f11399abc/lib/bundler/runtime.rb#L7-42)) was ran 3 times. My first reaction was WTF?? 3 times??. I will write about my other findings in another blog post.

After analyzing the code, I found out that the first call to *Bundle.setup* is in [Bundler::CLI#exec](https://github.com/carlhuda/bundler/blob/2a38a24a295b6e978f0c982d454a3a9f11399abc/lib/bundler/cli.rb#L398) right before shelling out to run _rails runner ''_.
The second call is on [boot.rb](https://github.com/rails/rails/blob/d2abe28ed342443f8c374a6e02977ccb0c3b3f95/railties/lib/rails/generators/rails/app/templates/config/boot.rb#L6) as part of the boot process (well actually it's required from *bundle exec* through [this rubyopt](https://github.com/carlhuda/bundler/blob/2a38a24a295b6e978f0c982d454a3a9f11399abc/lib/bundler/runtime.rb#L227) and on boot.rb the require returns false because it's already required).
And the last call starts on [config/application.rb](https://github.com/rails/rails/blob/d2abe28ed342443f8c374a6e02977ccb0c3b3f95/railties/lib/rails/generators/rails/app/templates/config/application.rb#L17)
which ends up calling [Bundler.require](https://github.com/carlhuda/bundler/blob/2a38a24a295b6e978f0c982d454a3a9f11399abc/lib/bundler.rb#L120-122) to finally call *Bundler.setup* for the third time. 
The second and third calls are run on the same process so *Bundler.setup* caches the result in [@setup](https://github.com/carlhuda/bundler/blob/2a38a24a295b6e978f0c982d454a3a9f11399abc/lib/bundler.rb#L105) so there's no slow down between those 2 calls.
But the command passed to *bundle exec* runs in a different process (remember I said before that we were shelling out to run *rails runner ''_) so the resulting execution of the first _Bundler.setup* won't be available to the [rails runner process" and doesn't make any sense. All that *bundle exec* needs to do is to "setup the rubyopts](https://github.com/carlhuda/bundler/blob/2a38a24a295b6e978f0c982d454a3a9f11399abc/lib/bundler/runtime.rb#L209-231) needed to run the command you are passing to *bundle exec_. I've [patched](https://github.com/carlhuda/bundler/commit/2c838255ccadadeab5298b7c2bbc39035e59f248) _Bundler* to do the right thing.

So don't run *bundle exec* before *rails* command, this command is already aware of *Bundler* and sets up everything according to what you have on your _Gemfile_.
If you prepend *bundle exec* before *rails* command all you will be adding is overhead of opening another process from *Bundler* and executing useless code since *rails* already does the right thing.

You probably already know about that, but I've seen a lot of proficient Rails developers doing it.

Read more about the topic in [Yehuda's blog](http://yehudakatz.com/2011/05/30/gem-versioning-and-bundler-doing-it-right/)
