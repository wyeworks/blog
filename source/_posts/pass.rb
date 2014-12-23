#!/usr/bin/env ruby

file_names = %x[ls].split("\n").reject{ |path| path =~ /pass.rb/}
p file_names

file_names.each do |file_name|
  text = File.read(file_name)
  new_contents = text.gsub(/<pre><code>/, "{% codeblock %}").gsub(/<\/code><\/pre>/, "{% endcodeblock %}")

  # To merely print the contents of the file, use:
  # puts new_contents

  # To write changes to the file, use:
  File.open(file_name, "w") {|file| file.puts new_contents }
end
