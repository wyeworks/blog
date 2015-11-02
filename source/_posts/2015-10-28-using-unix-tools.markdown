---
layout: post
title: "Using UNIX tools"
category: 
date: 2015-10-28 16:15:37 -0300
comments: true
author:
  name: Santiago Ferreira
  email: santiago.ferreira@wyeworks.com
  twitter_handle: san650
  github_handle: san650
  image: /images/team/santiago-ferreira.jpg
  description: 
---

When I began studying Ruby, one of the things that most caught my attention was
the length of time between having an idea and being able to validate the first
step; if this were an article about TDD, I would refer to this as the speed
with which we receive feedback. The _feedback loop_ is very short.

<!--more-->

Why? My first years as an IT professional I worked as a programmer using mainly
Microsoft Windows and, more specifically, .NET technologies.

In that environment, the _distance_ (of time) between an idea and obtaining the
first feedback requires many steps. Open Visual Studio, create a console
project  (or Windows Forms or web project), then open the file that contains
the `main` method declaration (the entry point to all Windows programs) in
order to enter the code that I want to test.

This is followed by compiling, fixing the errors at compile time, and
recompiling until finally seeing a window that opens and closes automatically
(in less than one second) in order to go to the console within Visual Studio
and finally see the much-awaited feedback.

When I began using Ruby, the first thing I did was create a text file, write
the first "Hello World" and run `ruby hello_world.rb`, and voilà, feedback! In
that moment I fell in love with Ruby as a language and a platform.

For software developers, it is essential to receive immediate feedback from the
tests we are running, which in turn leads us to the solution for a given
problem. Ruby is wonderful at this given that the length of time between the
idea and the feedback is minimal which creates a great environment for
experimentation.

## Not everything is that simple...

While working on a project, we encountered a problem. In reality, it was not so
much a problem as a desire. In the console, we wanted to generate a list of all
the defined routes in a specific web application. The project was fairly large
and had been active for many years, and therefore the existing solutions didn’t
work for us either because the version of the `sinatra` web framework was very
old or because the project was not very standardized.

One day when I had a bit of free time I thought about testing some solutions in
order to generate a list of routes. After giving some thought to the solution,
I said to myself...

> The only thing I have to do is redefine the methods `get`, `post`, `put` and
> `delete`, generate a new proxy class, save the route definition and call the
> original implementation, then…

There I realized I had again fallen into a trap. The _cognitive distance_
between the problem I wanted to solve and the means of reaching a solution via
Ruby was quite long, especially as there was no immediate feedback.

I took a step back and returned to thinking about the problem.

> I have a list of files that can be found in the `app/routes/` folder. From
> these files I want all the lines that begin with `get "…" do` or `post "…"
> do`, etc.

When I began working with Ruby, I also began working quite a bit with UNIX.
Some of the UNIX features I fell in love with include that all the system’s
resources are exposed as files; that the commands or utilities perform a task
and perform it well; and lastly, that all the utilities can be combined to
resolve more complex problems.

This permits us to obtain immediate feedback when working with UNIX utilities.

## On to UNIX

The following is a step-by-step example of how to solve a problem utilizing a
few UNIX tools. Additionally, we will see how we can achieve good results while
obtaining almost instantaneous feedback by taking small steps and building on
previous tests.

The problem presented here is as follows: We want to generate a list in the
console of all the defined routes in a `sinatra` application. The code for the
routes has the following format:

```sh
$ cat app/routes/schedules.rb

get "/schedules" do
  # … route code …
end

post "/schedules/new" do
  # … route code …
end

put "/schedules/:id" do
  # … route code …
end

delete '/schedules/:id' do
  # … route code …
end
```

The first thing to know is that for the problem at hand, we’re not interested
in 100% effectiveness; we'll settle for a sufficiently well-functioning
solution. Hence, we can take some shortcuts while testing the code.

The first test is to obtain a list of all the lines that begin with `get`,
`post`, `put` or `delete`. For this we can use the `grep` utility.

```sh
$ grep --line-number --extended-regexp '^\s*(get|post|put|delete) ' app/routes/*.rb
```

Note: Moving forward the short versions of the utility options will be used in
the examples to make them more concise.

The first utility we use is `grep` (*g*lobal *r*egular *e*xpression *p*rint)
which looks for patterns within text files and, by default, prints the results.
It receives a regular expression as a parameter and a list of files to search.
In this case, it searches within all route files for lines that begin with the
text `get`, `post`, `put` or `delete` (ignoring the spaces at the beginning of
each line).

The search result is:

```
app/routes/schedules.rb:5 get "/schedules" do
app/routes/schedules.rb:25 post "/schedules/new" do
app/routes/schedules.rb:55 put "/schedules/:id" do
app/routes/schedules.rb:60 delete '/schedules/:id' do
app/routes/jobs.rb:2    get '/jobs' do
app/routes/dummy:25 post %r{/post\d+} do
...
```

Success! With a simple command we have already come a long way; we have a list
of routes and for each one the file and line number where the route is defined.

The strategy we will utilize to achieve what we want is very similar to that
which Business Intelligence analysts use, in the sense that what we want is to
create a three-step process referred to as ETL:

1. Extract data
2. Transform data
3. Load data

The first thing we want to do is extract the information (what we just did),
then transform this information into a more manageable format and finally load
the information somewhere (in our case we simply want to display it on the
screen).

The second step, then, is to _adjust_ the format of the output to make it
uniform. For this we use a command called `sed` (*s*tream *ed*itor). The
idea behind this command is to, given a text file, transform one line at a time
and return the result of the transformation. It's ideal for "cleaning" and
filtering the output of other utilities.

In our case we would like to:

* Standardize the use of quotation marks
* Eliminate multiple spaces
* Eliminate the text that appears after the route path (the string "… do")
* Eliminate the use of the character `:` separating the name of the file from
  the line number

To achieve the first bullet point we simply have to redirect the output of the
previous command to `sed` and apply a transformation.

```sh
$ grep -n -E '^\s*(get|post|put|delete) ' app/routes/*.rb \
  | sed "s/'/\"/g"
```

Two side notes about the command described above: In the first line we use a
backslash to indicate that the command continues on the next line, and later,
in the second line, we use the "pipe" character `|` to indicate that the output
of the first command is the input of the second command. This allows us to
combine commands in a very simple way.

Here we are _telling_ `sed` to replace (command `s/.../.../`) that which is
caught by the regular expression `/'/` (single quotation marks), with double
quotation marks (`/"/`). We use the `g` modifier to substitute for all
occurrences, not just the first.

The output of the combination of these commands is as follows:

```
app/routes/schedules.rb:5 get "/schedules" do
app/routes/schedules.rb:25 post "/schedules/new" do
app/routes/schedules.rb:55 put "/schedules/:id" do
app/routes/schedules.rb:60 delete "/schedules/:id" do
app/routes/jobs.rb:2    get "/jobs" do
app/routes/dummy:25 post %r{/post\d+} do
...
```

Now there are no single quotation marks! `sed` allows us to specify more than
one transformation at a time, separated by semicolons. Continuing with the
example, the transformations we want to apply are:

* `s/'/"/g` Standardize the use of quotation marks
* `s/  */ /g` Eliminate multiple spaces
* `s/ do//` Eliminate the text that appears after the route path (the string
  `… do`)
* `s/:/ /` Eliminate the use of the character `:` separating the name of the
  file from the line number

All together it would be:

```sh
$ grep -n -E '^\s*(get|post|put|delete) ' app/routes/*.rb \
  | sed "s/'/\"/g; s/  *//g; s/ do//; s/:/ /"
```

Executing the command we obtain:

```
app/routes/schedules.rb 5 get "/schedules"
app/routes/schedules.rb 25 post "/schedules/new"
app/routes/schedules.rb 55 put "/schedules/:id"
app/routes/schedules.rb 60 delete "/schedules/:id"
app/routes/jobs.rb 2 get "/jobs"
app/routes/dummy 25 post %r{/post\d+}
```

With this we conclude the second stage of our process to standardize the
results. Now we start preparing the print format we want. The aim is to achieve
a list like the following:

```
  post %r{/post\d+}     app/routes/dummy:25
   get "/jobs"          app/routes/jobs.rb:2
   put "/schedules/:id" app/routes/schedules.rb:55
delete "/schedules/:id" app/routes/schedules.rb:60
  post "/schedules/new" app/routes/schedules.rb:25
   get "/schedules"     app/routes/schedules.rb:5
```

That is to say, we want to print the HTTP verb in the first column with
right-alignment, followed by the route path and lastly the route file with the
line number. We must also note that we want the list ordered by the route path
(second column).

To achieve this we first rearrange the fields of each line in the desired
order. For this we will utilize another UNIX utility called `awk`.

`awk` is a scanning and text-processing language. It is extremely useful when
we want to treat each line as a sequence of fields separated by a space (or
another separator).

To reorder the fields in each line we simply have to:

```sh
$ grep -n -E '^\s*(get|post|put|delete) ' app/routes/*.rb \
  | sed "s/'/\"/g;  s/  *//g;  s/ do//; s/:/ /" \
  | awk '{ print $3, $4, $1, $2 }'
```

Each field is identified by its position starting from 1, hence the sequence we
are left with is 3,4,1 and lastly 2. The combination of these commands results
in the following:

```
get "/schedules" app/routes/schedules.rb 5
post "/schedules/new" app/routes/schedules.rb 25
put "/schedules/:id" app/routes/schedules.rb 55
delete "/schedules/:id" app/routes/schedules.rb 60
get "/jobs" app/routes/jobs.rb 2
post %r{/post\d+} app/routes/dummy 25
```

It’s almost what we want, but first a few touch ups. To begin with, we have to
right-align the HTTP verbs. If we take a closer look, the verb with the most
characters is `delete` with 6. `awk` has another command similar to `print`
called `printf`, which allows for the addition of some formatting information.

```sh
$ grep -n -E '^\s*(get|post|put|delete) ' app/routes/*.rb \
  | sed "s/'/\"/g;  s/  *//g;  s/ do//; s/://" \
  | awk '{ printf("%6s %s %s %s\n", $3, $4, $1, $2) }'

   get "/schedules" app/routes/schedules.rb 5
  post "/schedules/new" app/routes/schedules.rb 25
   put "/schedules/:id" app/routes/schedules.rb 55
delete "/schedules/:id" app/routes/schedules.rb 60
   get "/jobs" app/routes/jobs.rb 2
  post %r{/post\d+} app/routes/dummy 25
```

Next, we want to sort the list by the route path. To do this we will use
another command called `sort`. This utility sorts the lines in alphabetical
order by default, but it has a parameter that allows us to indicate which field
from each line should be used for the comparison. Thus, indicating that we want
to sort by the second field, the command looks like:

```sh
$ grep -n -E '^\s*(get|post|put|delete) ' app/routes/*.rb \
  | sed "s/'/\"/g;  s/  *//g;  s/ do//; s/://" \
  | awk '{ printf("%6s %s %s %s\n", $3, $4, $1, $2) }' \
  | sort --key=2

   get "/jobs" app/routes/jobs.rb 2
   get "/schedules" app/routes/schedules.rb 5
   put "/schedules/:id" app/routes/schedules.rb 55
delete "/schedules/:id" app/routes/schedules.rb 60
  post "/schedules/new" app/routes/schedules.rb 25
  post %r{/post\d+} app/routes/dummy 25
```

Finally and to conclude, we will use the `column` utility, which allows us to
separate another command's output into columns. For example, if we utilize the
command with the `-t` option, it prints the following:

```sh
$ grep -n -E '^\s*(get|post|put|delete) ' app/routes/*.rb \
  | sed "s/'/\"/g;  s/  *//g;  s/ do//; s/://" \
  | awk '{ printf("%6s %s %s %s\n", $3, $4, $1, $2) }' \
  | sort --key=2 \
  | column -t

get     "/jobs"           app/routes/jobs.rb       2
get     "/schedules"      app/routes/schedules.rb  5
put     "/schedules/:id"  app/routes/schedules.rb  55
delete  "/schedules/:id"  app/routes/schedules.rb  60
post    "/schedules/new"  app/routes/schedules.rb  25
post    %r{/post\d+}      app/routes/dummy         25
```

This is very similar to what we want, but in reality we want to split the
output into two columns only, the verb plus the route path on one side and the
file name together with the line number on the other. Making a few small
changes to the `awk` line and the `column` line, we can add an arbitrary and
temporary marker `~` to mark the place where we want to separate the columns.
In addition, we adjust the format to re-incorporate the colon before the line
number (we repeat this in the `awk` line).

```sh
$ grep -n -E '^\s*(get|post|put|delete) ' app/routes/*.rb \
  | sed "s/'/\"/g;  s/  *//g;  s/ do//; s/://" \
  | awk '{ printf("%6s %s~%s:%s\n", $3, $4, $1, $2) }' \
  | sort --key=2 \
  | column -t -s~

   get "/jobs"           app/routes/jobs.rb:2
   get "/schedules"      app/routes/schedules.rb:5
   put "/schedules/:id"  app/routes/schedules.rb:55
delete "/schedules/:id"  app/routes/schedules.rb:60
  post "/schedules/new"  app/routes/schedules.rb:25
  post %r{/post\d+}      app/routes/dummy:25
```

In this way we've built the desired format through a series of small steps.

## Conclusions

Unix includes a bunch of tools that, when combined, lead to great solutions.
The key to learning to use these commands is using them habitually to resolve
small problems. Over time we will improve and deepen our understanding of each
command's options and how to combine the commands themselves. Their ease of use
and swift feedback make these options perfect for testing quick solutions to
complex problems.

## Resources

All of the commands we’ve seen come with manuals that can be accessed using the
`man` command. For example:

```sh
$ man sed
```

In addition, here is a list of resources to further deepen your understanding
of a few of them:

* `grep` http://www.grymoire.com/Unix/Grep.html
* `sed` http://www.grymoire.com/unix/Sed.html
* `awk`  http://www.grymoire.com/unix/Awk.html

## Appendix

Many of the commands we reviewed have the same roots. In fact, learning one of
them leads to learning many concepts applicable to the rest.

```text
            +-----+
  +-----+ ed  +-----+
  |     +--+--+     |
  |        |        |
  |        |        |
  |        |        |
+-v--+   +-v--+  +--v--+
|sed |   |grep|  | awk |
+----+   +-+--+  +-----+
           |
           |
         +-v---+
         |egrep|
         +-----+
```

`sed` and other tools originated from another tool called `ed`, a command-based
text editor. Here is a sample of `ed` in action:

![ed](https://cloud.githubusercontent.com/assets/1234607/9471389/6e615906-4b26-11e5-8b90-7fe814444389.gif)
