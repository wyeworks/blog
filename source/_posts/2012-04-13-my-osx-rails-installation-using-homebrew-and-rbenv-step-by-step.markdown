---
layout: post
title: My OS X Rails installation using Homebrew and rbenv, step by step
hero_image: /blog/images/heros/post-high.jpg
comments: true
author:
  name: Sebastián Martínez
  email: sebastian@wyeworks.com
  twitter_handle: smartinez87
  github_handle:  smartinez87
  image:  /images/team/sebastian-martinez.jpg
  description: VP of Engineering at WyeWorks. Ruby on Rails hacker. ExceptionNotification maintainer. Coffee & bacon lover.
published: true
---
In this opportunity I'll explain (as the title suggests) how to go from a brand new mac os x to running Rails tests.

<!--more-->

<b>Step 0</b>, is to make sure that <code>locale</code> returns {% codeblock %}LANG="en_US.UTF-8"
LC_COLLATE="en_US.UTF-8"
LC_CTYPE="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_ALL=
{% endcodeblock %}

(you'll get some unexpected errors later on if not). To do so, you can either set the Language to one that Mac OS X sets UTF-8 by default, like United States from the System Preferences panel. 
<b>Or</b>, you can run
{% codeblock %}$ export LC_ALL=en_US.UTF-8
$ export LANG=en_US.UTF-8
{% endcodeblock %}
to achieve that.

<b>Step 1</b>, install Xcode.

<b>Step 2</b>, install osx-gcc-installer from <code>https://github.com/kennethreitz/osx-gcc-installer</code>

<b>Step 3</b>, So now you're ready to install Homebrew, by doing:

{% codeblock %}$ /usr/bin/ruby -e "$(/usr/bin/curl -fksSL https://raw.github.com/mxcl/homebrew/go)"
{% endcodeblock %}

Now this is how to install some common libraries

<b>Step 4</b>, We need to first have git in order run the brew doctor, so
{% codeblock %}$ brew install git{% endcodeblock %} 

You can make sure that everything is ok by running {% codeblock %}$ brew doctor{% endcodeblock %} at any time. It should return '<code>Your system is raring to brew</code>' when in optimal conditions.

<b>Step 5</b>, now to install the rest of the libraries

{% codeblock %}$ brew install memcached mysql postgresql{% endcodeblock %}

<b>Step 6</b>, initializing the mysql and postgres databases must be done by doing
{% codeblock %}$ initdb /usr/local/var/postgres
$ mysql_install_db --verbose --user=`whoami` --basedir="$(brew
--prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp
{% endcodeblock %}

<b>Step 7</b>, I like having some aliases to load/unload mysql, postgres and memcached. To do so, you should add the following lines to your ~/.zshrc
{% codeblock %}alias memcached_load="launchctl load -w /usr/local/Cellar/memcached/1.4.13/homebrew.mxcl.memcached.plist"
alias memcached_unload="launchctl unload -w /usr/local/Cellar/memcached/1.4.13/homebrew.mxcl.memcached.plist"
alias mysql_load="launchctl load -w /usr/local/Cellar/mysql/5.5.20/homebrew.mxcl.mysql.plist"
alias mysql_unload="launchctl unload -w /usr/local/Cellar/mysql/5.5.20/homebrew.mxcl.mysql.plist"
alias postgres_load="launchctl load -w /usr/local/Cellar/postgresql/9.1.3/homebrew.mxcl.postgresql.plist"
alias postgres_unload="launchctl unload -w /usr/local/Cellar/postgresql/9.1.3/homebrew.mxcl.postgresql.plist"
{% endcodeblock %}

<b>Step 8</b>, Now you're good to go. Next we'll install rbenv to easily switch between multiple versions of Ruby. You can also choose to use RVM or roll your own.
{% codeblock %}$ brew install rbenv ruby-build{% endcodeblock %}

<b>Step 9</b>, Add 
{% codeblock %}export PATH=$HOME/.rbenv/bin:$PATH
eval "$(rbenv init -)"
{% endcodeblock %}
to your <code>~/.zshrc</code>.

<b>Step 10</b>, now do the following to install ruby {% codeblock %}$ rbenv install 1.9.3-p125{% endcodeblock %}

<b>Step 11</b>, you need to {% codeblock %}$ rbenv global 1.9.3-p125
$ rbenv rehash{% endcodeblock %}

<b>Step 12</b>, Cool, so now we are good to go and setup Rails.

{% codeblock %}$ git clone https://github.com/rails/rails.git
$ gem install bundler
$ rbenv rehash
$ cd rails
$ bundle
{% endcodeblock %}

<b>Step 13</b>, now, from the Contributing to Rails Guide, you should 
{% codeblock %}$ mysql_load
$ postgres_load
$ mysql -u root
mysql> GRANT ALL PRIVILEGES ON activerecord_unittest.* to 'rails'@'localhost';
mysql> GRANT ALL PRIVILEGES ON activerecord_unittest2.* to 'rails'@'localhost';
exit
$ cd activerecord
$ rake mysql:build_databases
$ rake postgresql:build_databases
{% endcodeblock %}

And that's it!, we have <b>Ruby, MySQL, PostgreSQL, Memcached</b>, and everything needed to do some Rails development.

<b>Step 14</b>, we need to load Memcached for its needed for some tests by doing
{% codeblock %}$ memcached_load {% endcodeblock %}

<b>Step 15</b>, and lastly, you can run Rails tests by doing
{% codeblock %}$ rake{% endcodeblock %}
at the top of the rails directory.

Everything should work just fine, or at least you should get the same results as the [Rails CI.](http://travis-ci.org/#!/rails/rails)

<b>Congratulations! </b>
