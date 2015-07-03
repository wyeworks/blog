---
layout: post
title: Creating your own generators on Rails 2.3
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
Time has come for me to write a Rails generator, and as you're guessing right now, my first step was taking a look at the [Guides](http://guides.rubyonrails.org/generators.html).
They give you a pretty good idea on what you can do (despite of being for Rails 3.0), but as my friend Santiago always say, there's no better documentation than the source code itself. So, my second step was to dive into the [code](http://github.com/rails/rails/tree/2-3-stable/railties/lib/rails_generator/). You should definitely read the code, great stuff there.

<!--more-->

After some time reading, I decided it was time for me to start playing around with that, so here it comes:

First thing you should know, is that all Rails generators are derived from a class called “Rails::Generator::Base.” But, if we derive our generator class from NamedBase instead of Base, then we’ll get the ability to take a name parameter from the script/generate command line. With that in mind, you can start writing the generator *skeleton*:

{% codeblock lang:ruby %}class WidgetGenerator < Rails::Generator::NamedBase
  def manifest
    record do |m|
      # Do something
    end
  end
end{% endcodeblock %}

In order to make the generator work on your Rails 2.3 application, you should place this file under **'lib/generators/widget/widget_generator.rb'**

Is on the manifest method where the magic occurs. Depending on what exactly we want our generator to do, is what we're going to code inside it.
In my case, I wanted to behave very similar to the scaffold, so I wanted a controller class, a model, views, migration, etc... You can look at the templates of the scaffold generator, they will give you a very clear idea on how to use them. Then, you should place your templates under **'lib/generators/widget/templates/'**

In most cases, you will want your generator to receive several arguments. Best way is to have an initialize method to take care of that, just like this:

{% codeblock lang:ruby %}
class WidgetGenerator < Rails::Generator::NamedBase
  attr_reader   :controller_class_name,
                :class_name
  attr_accessor :attributes
  
def initialize(runtime_args, runtime_options = {})
    super
    @name = runtime_args.first
    @controller_class_name = @name.pluralize.capitalize
    @attributes = []

    runtime_args[1..-1].each do |arg|
      if arg.include? ':'
        @attributes << Rails::Generator::GeneratedAttribute.new(*arg.split(":"))
      end
    end
  end

  def manifest
    record do |m|
      # Do something
    end
  end
end{% endcodeblock %}

Until now, we're just initializing the generator, but it's not doing anything yet. Let's add some action on our manifest method:

{% codeblock lang:ruby %}def manifest
    record do |m|
      m.template('controller.rb', "app/controllers/#{name.pluralize}_controller.rb")
      m.template('model.rb', "app/models/#{name}.rb")
      m.migration_template("migration.rb", "db/migrate", :migration_file_name => "create_#{name.underscore.pluralize.camelize}")

      m.directory(File.join('app/views', name.pluralize))
      for action in %w[ new edit show ]
        m.template(
          "view_#{action}.html.erb",
          File.join('app/views', controller_file_name, "#{action}.html.erb")
        )
      end
    end
  end{% endcodeblock %}

Cool, now we are generating a controller from our template, a model, a migration, among others...Nice!

You can also add a protected banner method, to display the usage of the generator right on the console:

{% codeblock lang:ruby %}protected
    def banner
      "Usage: #{$0} widget WidgetName [field:type, field:type]"
    end{% endcodeblock %}

And that's all !! You can now generate all the widgets you want.
The command to run this would be:

{% codeblock %}$ ./script/generate widget MyWidget title:string viewing:integer{% endcodeblock %}

Have fun generating!! 
