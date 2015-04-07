---
layout: post
title: Setting up Passenger in Linux
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
Clearly one of the problems with Rails as a major platform right now is it’s hosting situation. Currently a good solution is to proxy HTTP requests from Apache or Nginx to a cluster of mongrels, which is tricky to set up and somewhat tedious. I wanted to easily have our rails applications deployed (in our development environment), and have them running without having to manually start each server. Messing around I found [Passenger(Passenger)](https://www.phusionpassenger.com/), a module for Apache that hosts Rails applications. Note this was tested in Ubuntu, but it's very similar for other Linux distributions.

<!--more-->

To install the module simply run:
{% codeblock %}$ sudo gem install passenger{% endcodeblock %}

Then, you need to do
{% codeblock %}$ passenger-install-apache2-module{% endcodeblock %}

and just follow the instructions. The installer is very easy to follow, and in my case it detected some software not installed, so i had to run 

{% codeblock %}$ sudo apt-get install apache2-prefork-dev{% endcodeblock %}

Once the installation was successfully completed, it asked to add the following lines to the apache configuration file, /etc/apache2/apache2.conf

{% codeblock %}"LoadModule passenger_module /usr/lib/ruby/gems/1.8/gems/passenger-2.0.2/ext/apache2/mod_passenger.so
PassengerRoot /usr/lib/ruby/gems/1.8/gems/passenger-2.0.2
PassengerRuby /usr/bin/ruby1.8"
{% endcodeblock %}

At this point, Passenger is properly configured, and the only thing left is to configure our applications to work with Apache.
So, let's do it: make your 'httpd.conf' file to look like this:

{% codeblock %}NameVirtualHost localhost:80
<VirtualHost localhost:80>
      ServerName app1.local
      DocumentRoot /app1_path/public
</VirtualHost>

<VirtualHost localhost:80>
      ServerName app2.local
      DocumentRoot /app2_path/public
</VirtualHost>
{% endcodeblock %}
...and so on for more applications.

Also, modify the '/etc/hosts' file to have your applications go to localhost. It should look similar to this:
{% codeblock %}127.0.0.1       localhost app1.local app2.local{% endcodeblock %}

There are some considerations to make here. First and most important, the rails environment. Passenger sets it to production as default, but if you want it to be some other, just need to add the following line into the configuration file:

{% codeblock %}RailsEnv environment{% endcodeblock %}

Now if you just type into your browser app1.local you should see your application alive!
Without the images and style? Yes, simply to solve.

Delete the following file and restart apache.
{% codeblock %}$ rm -f /your_app_path/public/.htaccess{% endcodeblock %} 

Bingo!

That was all the strictly necessary to have your application deployed with Passenger...but we have some tricks to share ;)

Suppose you want your Ruby on Rails application to be accessible from the URL http://localhost/app.
To do this, make a symlink from your Ruby on Rails application's public folder to a directory in the document root. For example:

Type

{% codeblock %}$ ln -s /your_app_path/public /var/www/app1{% endcodeblock %}

in a terminal.

Next, add a RailsBaseURI option to the virtual host configuration:

{% codeblock %}
<VirtualHost localhost:80>
    ServerName app1.local
    DocumentRoot /app1_path/public
    RailsBaseURI /app1                # This line has been added.
</VirtualHost>
{% endcodeblock %}

Now, according to Passenger's documentation, this should be it, but I've found some problems with Rails 2.2.2. Going to http://localhost/app1 now may give you a HTTP 404 error. To solve this, you need to add this line to environment.rb of your application:

{% codeblock %}config.action_controller.relative_url_root = "/app1"{% endcodeblock %}

Another sweet thing is restarting a Rails app hosted by Passenger - simply touch a file called tmp/restart.txt within the Rails application root:

{% codeblock %}$ touch tmp/restart.txt{% endcodeblock %}

And that's it. Enjoy this beauty.
Note that this configuration is intended to be for development environment only. Passenger provides other parameters for production, which we will tackle in the near future, and public our opinions. So, don't forget to keep visiting us. Seeya in the next post!
