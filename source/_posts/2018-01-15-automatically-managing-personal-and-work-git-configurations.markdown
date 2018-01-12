---
layout: post
title: "Automatically managing personal and work git configurations"
category:
comments: true
author:
  name: Federico Kauffman
  email: federico@wyeworks.com
  twitter_handle: fedekauffman
  github_handle: fedekau
  image: /images/team/federico-kauffman.jpg
  description: Software Engineer at WyeWorks. Currently working with Javascript and Ruby. Learnaholic.
---

There was a time when I found myself constantly switching between my personal and work computers, and it was really annoying. After some time switching back and forth, I decided to use just one computer.

After settling on the single computer approach, what irritated me most was having to remember to switch my Git username, email, and SSH keys when moving from a work repository to a personal repository and vice versa. I would frequently forget to do that and, every now and then, I would find work commits tagged with my personal email or the other way around.

At work, most of the repositories are private, but at home most of my work is public, which means that my work email became public, and I didn't like that. Hence, in this post I will share one way you can go about forgetting to switch back and forth and let the computer do it automatically for you.

<!--more-->

## Step 1: Configure your SSH keys

If you are utilizing SSH to interact with your Git server (probably GitHub), continue on, dear reader. Otherwise, skip this step. (Or, even better: **Start using SSH!**)

Let's say you have two SSH key-pairs, one for `user@work.com` and one for `user@personal.com`. You’ll want to use your corresponding SSH key-pair when pushing, cloning, or otherwise interacting with a work or personal repository, respectively. And that's easy enough to accomplish - just create or modify an existing `~/.ssh/config` file that looks similar to this:

{% codeblock lang:bash %}
#personal
Host github.com-personal
  HostName github.com
  User personal
  IdentityFile ~/.ssh/id_rsa_personal
  PreferredAuthentications publickey

#work
Host github.com-work
  HostName github.com
  User work
  IdentityFile ~/.ssh/id_rsa_work
  PreferredAuthentications publickey
{% endcodeblock %}

Replace `personal` with your personal Git username and `work` with your work-related one, and we’re done with this step.

## Step 2: Add user details to work and personal folders

For this step, I am assuming you have all of your work stuff contained in a `~/work` folder and all of your personal stuff contained in a `~/personal` folder. If not, then you will either have to move some things around on your computer or adapt this step to your individual needs.

In each folder, add a file named `.gitconfig`. You’ll end up with one `~/work/.gitconfig` file and one `~/personal/.gitconfig` file. In each file, you should fill in your information accordingly. For example:

{% codeblock lang:bash %}
[user]
  email = user@work.com
  name = John Doe
{% endcodeblock %}

{% codeblock lang:bash %}
[user]
  email = user@personal.com
  name = John Doe
{% endcodeblock %}

Step two, done! Now let's move on to the final step where we slap everything together.

## Final step: Overriding git configuration based on current folder

In this, our final step, we are going to tell Git to use different configurations depending on what you’re working on. First, you need to create or modify the `~/.gitconfig` file (if one already exists) and change it to look something like this:

{% codeblock lang:bash %}
[includeIf "gitdir:~/work/"]
    path = ~/work/.gitconfig

[includeIf "gitdir:~/personal/"]
    path = ~/personal/.gitconfig
{% endcodeblock %}

This tells Git to load the `~/work/.gitconfig` file when you are in any folder under `~/work`, and the other configuration when you are under `~/personal`.

## Conclusion

Now you have configured Git such that it will automatically select which user, email, and key-pair to utilize based on what you are working on. You can forget about accidentally mixing up usernames and you’ll no longer have to worry about disclosing your personal email at work, or, even worse, disclosing your work email to the public.

You can further customize each file’s configuration and end up customizing Git for each environment. For example, you can configure your repositories to execute some hooks, as I explained in my previous post, [Using git hooks to improve your day-to-day workflow](https://wyeworks.com/blog/2018/1/3/using-git-hooks-to-improve-your-day-to-day-workflow/).

Hopefully this info proved useful. One way or another, let me know by leaving a comment!
