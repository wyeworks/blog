---
layout: post
title: "Using git hooks to improve your day-to-day workflow"
category: git
comments: true
author:
  name: Federico Kauffman
  email: federico@wyeworks.com
  twitter_handle: fedekauffman
  github_handle: fedekau
  image: /images/team/federico-kauffman.jpg
  description: Software Engineer at WyeWorks. Currently working with Javascript and Ruby. Learnaholic.
---

If you have been developing software for some time you have probably noticed that there are lots of things that can go wrong, no matter how hard you try there is always something you might forget because after all, we are only humans doing an extremely difficult task: Telling a computer what to do.

In this post I will expose some of the **git-hooks** we use in some projects here at WyeWorks to make developers life easier by preventing bad commits to even leave their computers. I will cover *linting*, *tests* and *commit formating* use cases.

<!--more-->

## What are git-hooks?

> Like many other Version Control Systems, Git has a way to fire off custom scripts when certain important actions occur. There are two groups of these hooks: *client-side* and *server-side*. Client-side hooks are triggered by operations such as committing and merging, while server-side hooks run on network operations such as receiving pushed commits. You can use these hooks for all sorts of reasons.

## Installing a Hook

> The hooks are all stored in the hooks subdirectory of the Git directory. In most projects, that’s `.git/hooks`. When you initialize a new repository by running `git init`, Git populates the hooks directory with a bunch of example scripts, many of which are useful by themselves; but they also document the input values of each script. All the examples are written as shell scripts, with some Perl thrown in, but any properly named executable scripts will work fine – you can write them in Ruby or Python or whatever language you are familiar with. If you want to use the bundled hook scripts, you’ll have to rename them; their file names all end with `.sample`.

> To enable a hook script, put a file in the hooks subdirectory of your `.git` directory that is named appropriately (without any extension) and is executable. From that point forward, it should be called.

In this post we will only be using some *client-side* hooks to execute custom scripts. Next are the hooks and use cases I like the most:

### PRE-COMMIT

> The `pre-commit` hook is run first, before you even type in a commit message. It’s used to inspect the snapshot that’s about to be committed, to see if you’ve forgotten something, to make sure tests run, or to examine whatever you need to inspect in the code. Exiting non-zero from this hook aborts the commit, although you can bypass it with `git commit --no-verify`. You can do things like check for code style (run lint or something equivalent), check for trailing whitespace, or check for appropriate documentation on new methods.

{% codeblock lang:bash %}
#!/usr/bin/env bash

if ! bundle exec rubocop -D -E -S -c .rubocop.yml; then
  echo "Offences were found. Your commit will not pass the CI."
  echo "The commit was aborted, but if you really want to commit anyway run: git commit --no-verify -m 'Commit message'"
  exit 1
fi
{% endcodeblock %}

In this example we use [Rubocop](https://github.com/bbatsov/rubocop) (a linting gem for Ruby) to detect if the code has any issues, if so we let the user know and exit with status code one to prevent the code from being commited.

### COMMIT-MSG

> The `commit-msg` hook takes one parameter, which is the path to a temporary file that contains the commit message written by the developer. If this script exits non-zero, Git aborts the commit process, so you can use it to validate your project state or commit message before allowing a commit to go through. You can use it to check that your commit message is conformant to a required pattern or to modify your commit in some useful way.

{% codeblock lang:bash %}
#!/usr/bin/env bash

if grep -q -i -e "WIP" -e "work in progress" $1; then
    read -p "You're about to add a WIP commit, do you want to run the CI? [y|n] " -n 1 -r < /dev/tty
    echo
    if echo $REPLY | grep -E '^[Nn]$' > /dev/null; then
        echo "[skip ci]" >> $1
    fi
fi
{% endcodeblock %}

This example searches the commit message entered by the developer for a certain pattern, if the pattern is found it assumes that the commit is a work in progress code and asks the developer to confirm if he wants to run this code in the CI, if the user says *no* then the hook modifies the commit to add a *[skip ci]* label. This label indicates a continuous integration service like CircleCI, TravisCI, etc. that we don't want to run the test suite for this commit.

### PRE-PUSH

> The `pre-push` hook runs during git push, after the remote refs have been updated but before any objects have been transferred. It receives the name and location of the remote as parameters, and a list of to-be-updated refs through stdin. You can use it to validate a set of ref updates before a push occurs, or to abort a push to a particular branch, a non-zero exit code will abort the push.

{% codeblock lang:bash %}
#!/usr/bin/env bash

protected_branch='master'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ $protected_branch = $current_branch ]; then
    read -p "You're about to push master, is that what you intended? [y|n] " -n 1 -r < /dev/tty
    echo
    if echo $REPLY | grep -E '^[Yy]$' > /dev/null; then
        exit 0 # push will execute
    fi
    exit 1 # push will not execute
else
    exit 0 # push will execute
fi
{% endcodeblock %}

This script will ask for confirmation if the developer tries to push to an important branch like *master*, if the developer confirms then the push will happen as usual, otherwise it will prevent the branch from being pushed.

## Setting up hooks in a project

Since the `.git` folder itself is not under version control the hooks are only available to the developers that install them, which for some hooks might be good enough, but not for others.

For example, if you want to protect a branch for all developers it would be great that this could be under version control and when developers checkout the code they have that available. Well, this can easily be done!

If you have a setup script for you project you can just add `git config core.hooksPath <path-to-hooks-folder>` and this will make you repository look for hooks in that folder which you can have in the repository under version control. After this, when a developer installs the project, the hooks will be in place and working.


## Conclusion

With these three hooks you can ensure that developers don't push code that will fail or is unnecessary to run in your CI of choice, you can run linting software and avoid unwanted pushes to protected branches.

It will also save resources by avoiding CI runs that will fail, and will speed up your feedback loop since all the checks will run immediately in you local machine.

This will leave your mind free to think in more important stuff and avoid other errors instead of focusing on this simple things that can easily be automated.

## Credits

The quoted explanations and definitions of the **git-hooks** were extracted from the [Official documentation of git-hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks). See their documentation for more available hooks.
