---
layout: post
title: Dumb script to reassemble HTML + SSI pages
hero_image: /blog/images/heros/post-high.jpg
comments: true
author:
  name: José Costa
  email: jose@wyeworks.com
  twitter_handle: joseicosta
  github_handle:  joseicosta
  image:  /images/team/jose-ignacio-costa.jpg
  description: Cofounder & CEO at WyeWorks. Fitness aficionado. Home Barista wannabe.
published: true
---
While working on our [website(WyeWorks website)](http://wyeworks.com), we wanted to serve some dynamic content but it just didn't justify having some "big" dynamic technology behind to achieve this. Also as programmers, we like our code (even our static website content) to be nicely separated so we can keep things in order, better maintenance, blah blah blah. Seriously, we really like those things :)

<!--more-->

So that's when we came across the [Apache Server Side Includes (Apache SSI)](http://httpd.apache.org/docs/1.3/howto/ssi.html) (a much more interesting topic than the addressed here).  So, then we divided our static pages to separate the header, menu, content, footer, and we placed a bunch of page includes.
 
**One drawback:** checking the content and styles as a whole is now a little bit difficult if you don't have your Apache SSI capable on handy to reassemble all back together. So this tiny dumb script library (plus some bunch of code not shown here) did that for us.

{% codeblock lang:ruby %}require 'fileutils'

module SSI

  def self.generate(source, dest)
    file = File.new(source)
    lines = file.readlines
    file.close
    lines.each do |line|
      if line =~ /<!--\s*#include\s*virtual\s*=\s*('|")(.+)('|")\s*-->/
        path_to_included_file = $2
        unless path_to_included_file[0..0] == "/"
          path_to_included_file = File.join(File.dirname(source),path_to_included_file)
        end
        partial = File.new(path_to_included_file)
        lines_to_include = partial.readlines
        partial.close
        line.gsub!(/<!--\s*#include\s*virtual\s*=\s*('|")(.+)('|")\s*-->/, lines_to_include.join(""))
      end
    end
    if File.directory?(dest)
      dest = File.join(dest, File.basename(source))
    end
    file = File.new(dest, "w")
    lines.each do |line|
      file.write(line)
    end
    file.close
  end
    
end{% endcodeblock %}

It behaves pretty much like any standard copy command, adding the replacement of the included files for their real content. Note there is no error checking whatsoever.

{% codeblock %}SSI.generate(source_file, dest_file_or_directory){% endcodeblock %}

Hopefully it will save a minute or two to someone somewhere.
