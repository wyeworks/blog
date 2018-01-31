---
layout: post
title: "Infrastructure as Code: A beginner's perspective"
category: infrastructure
comments: true
author:
  name: Federico Kauffman
  email: federico@wyeworks.com
  twitter_handle: fedekauffman
  github_handle: fedekau
  image: /images/team/federico-kauffman.jpg
  description: Software Engineer at WyeWorks. Currently working with Javascript and Ruby. Learnaholic.
---

A couple of months ago I came to realize that DevOps might be something that I like. I was not sure what to do, so I talked to the VP of Engineering at WyeWorks. After that, we found a way for me to experiment and work in a DevOps position for several months.

I left the project I was working on at that moment and I was given a month to learn some basic stuff to be somewhat useful in a DevOps job. That is exactly what I did, since January 2nd I have been reading and doing DevOps stuff 5 days a week 7 hours a day.

In this post I will talk about my perspective about IAC (Infrastructure as Code), what problems it solves, how you can do it, and I will share some resources for you to learn about it. I will also briefly present Terrafrom, as an IAC tool.

<!--more-->

## What does Infrastructure as Code mean?

As the name might suggest you, IAC is basically writing code that describes your infrastructure, just as if you were writing a program in a high level language. This allows you to automate de process of provisioning infrastructure using tools proven to work.

## How does it help you?

This allows you to automate, test and reuse the code for the infrastructure you are working on. You can also have versioning of your infrastructure code and check it in version control alongside with the code it will be serving. You can do code reviews on it as well, testing, and all the good practices you follow with your codebase.

**You might be thinking:** *Ok, that seems like good things to have, but can you please give me a concrete use case?*

I will give you two 😁

### Case 1 - Simple web app_1, app_2, app_3, ..., app_n

Imagine you are working for a company that builds basic web apps for their clients, so, what does a basic web app need?

Probably a web server and a database (I am oversimplifying), so every time you have a new client for a web app you go to AWS (or whatever cloud provider you use) and with some clicking around you get 2 VMs, one for running your app, and another one for the database.

Oh wait, I forgot, you need two copies (at least) of this infrastructure, one for production and one for staging.

Now you have two copies of the same infrastructure. You can start deploying your code for that client.

Two months go by and you have another client that needs the same infrastructure, and there you go again, you click around in AWS and get that working.

With IAC you can have a module that does all the heavy lifting for you, you run that code and in a couple of minutes you are good to go. You need to update all the infrastructure of your clients? No problem just update the module, run it and you are good to go!

If you have been doing this by hand in AWS, then you are probably already seeing the benefits of having IAC. But if you don't believe me yet, just read the next case.

### Case 2 - Going crazy with a complex app

You came up with a great idea, a really cool web app, it started off simple, but now you have a lot of clients that rely on that app. In this case one web server and one database are not going to be enough.

You start by adding one load balancer and another web server, you write the process down in a document. Some time goes by and you need to add another server, you follow the process in the document and you are done.

Next month you realize that only one database server it not enough and you add a replica.

Next you have to move some workload out of the main servers, you need a message queue and a server to run workers. You do it by hand, but at this point you forget to update the documents.

Some months go by and you need to add more queues and workers, but since you forgot to add that into a document it is not easy to do it the exact same way. You do it, it works, but now the queues and workers have slightly different configurations, this is called *Configuration drift*.

You decide to add some levels of caching in your app, you need Redis/Memcached, so you need to add more servers for those services. You also need to configure S3 to have your static files, a CDN to serve those worldwide, you need Route53 to configure your routes.

By this time the company has grown, you need to create IAM roles and users for the new developers and give them the correct access rights.

You need more reliability, so you need to create more servers in different datacenters. At this point you go nuts and close the company.

The end of this last example was a bit catastrophic, but imagine yourself maintaining that amount of servers by hand, that does not scale up well.

## Should you be doing IAC?

As everything in tech, it depends. I personally can't imagine a project that would not be better by using IAC. So, in my opinion, if you have the chance to use it, give it a try and find out by yourself!

Maybe if you are using Heroku for really simple apps it is too much overhead to have a tool like this, but if your Heroku project grows beyond a certain size you might benefit from this kind of tools as well. Take a look at [Terraform: Heroku Provider](https://www.terraform.io/docs/providers/heroku/index.html) for an example.

# Terraform

Terraform is a IAC tool from Hashicorp that solves the problems presented in the previous cases and more, and as they say in their site:

> Terraform enables you to safely and predictably create, change, and improve infrastructure. It is an open source tool that codifies APIs into declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned.

For example, with this simple code you have a load balancer and 5 VMs attached to it, and every time you run that code you will get to that same state, that is awesome! Imagine how many clicks you would have needed to do all that by hand, definitely a lot!

{% codeblock lang:ruby %}
resource "aws_elb" "frontend" {
  name = "frontend-load-balancer"
  listener {
    instance_port     = 8000
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }

  instances = ["${aws_instance.app.*.id}"]
}

resource "aws_instance" "app" {
  count         = 5
  ami           = "ami-408c7f28"
  instance_type = "t1.micro"
}
{% endcodeblock %}

With code similar to this I was able to recreate the second case I presented in only a week, pretty amazing! I am sure it would have taken me at least double that time to do it manually.

# Conclusion

Your infrastructure is as important as the code it runs, so my recommendation is to treat it like it deserves, you should have reviews, versioning, tests, etc.

Managing infrastructure by hand is hard, even if you are disciplined and document everything, you are a human, you might forget something one day, and that day you will regret you were not using IAC tools.

You can start by only managing something simple in your app with a IAC tool and gradually migrate other things.

If you have the opportunity to use Terraform or any other IAC tool, consider it as a great way to improve how you manage your infrastructure, it can enable you to do great things and really fast!

If you have questions or opinions, please, let me know in the comments!

# Resources

- *Infrastructure as Code: Managing Servers in the Cloud* by Kief Morris. [Link](https://books.google.com/books?id=4IdRDAAAQBAJ&dq=inauthor:%22Kief+Morris%22&hl=en&redir_esc=y)
- *Terraform: Up & Running* By Yevgeniy Brikman. [Link](https://www.terraformupandrunning.com/)

