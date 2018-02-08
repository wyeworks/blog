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

A couple of months ago, I came to realize I might actually like DevOps. I wasn’t sure what to do, so I talked to the VP of Engineering at WyeWorks. Following that conversation, we found a way for me to work in a DevOps position for several months and try it out.

I left the project I was working on at that time and was given a month to learn some basic stuff so that I would be somewhat useful in a DevOps job. And that’s exactly what I did. Beginning January 2nd of this year, I’ve been reading up on and doing DevOps work 5 days a week, 7 hours a day.

In this post, I’m going to discuss my perspective on IAC (Infrastructure as Code), what problems it solves, and how it can be implemented. I will also share some resources for  further learning, as well as briefly present Terraform, an IAC tool.

<!--more-->

## What does Infrastructure as Code mean?

As the name might suggest, IAC is about writing code that describes your infrastructure, similar to writing a program in a high level language. It allows you to automate the process of provisioning infrastructure using tools that are proven to work.

## How does it help you?

IAC allows you to automate, test, and reuse code pertaining to the infrastructure you are working on. You  also have the option to version control your infrastructure code and check it alongside the code that will be managed. You can likewise review and test code, and generally-speaking follow all the good practices you would normally with your codebase.

**You might be thinking:** *Ok, that all sounds great, but can you please give me a concrete use case?*

I can give you two. 😁

### Case 1 - Simple web app_1, app_2, app_3, ..., app_n

Imagine you are working for a company that builds basic web apps for its clients. So, what does a basic web app require? A web server and a database (I am oversimplifying) should come in handy. Every time you gain a new client for a web app, you visit AWS (or whatever cloud provider you use) and, after clicking around some, you end up with 2 VMs: one for running your app, and another for the associated database.

Oh wait, I forgot, you’ll want at least two copies of this infrastructure: one for production and one for staging.

Now that you have two copies of the same infrastructure, you can start deploying the code for that client.

Two months go by and you have another client that needs the same infrastructure, so there you go again, clicking around in AWS to get that up and running.

Instead, utilizing IAC, you can have a module that does all the heavy lifting for you. When it’s time, you run that bit of code and in a couple of minutes you are good to go. Need to update all client infrastructure at once? No problem, just update the module, run it, and you’re all set!

If you have been doing this by hand in AWS, then you can probably already see the benefits of having IAC. But if you don't believe me just yet, read the next use case.

### Case 2 - Going crazy with a complex app

You came up with a great idea - a really cool web app - and it all started off simply enough, but now you have a lot of clients that rely on that app. In this case, one web server and a single database won’t be enough.

You begin by adding a load balancer and another web server, and you document the process. Some time goes by and you need to add another server, so you follow the process in the document and you're done.

The following month, you realize that running only one database server is not enough and you add a replica.

Then, you need to move some of the workload off the main servers, which means you need a message queue and a server to run workers. You do it all by hand but forget to update the documents.

Some months go by and you get to a point where you need to add more queues and workers, but since you forgot to update the document the last time around, it’s not so easy to do it in the same way. You get it done, and it works, but now the queues and workers have slightly different configurations. This is known as *configuration drift*.

Later, you decide to add some caching levels to your app, and since you require Redis/Memcached, you’ll have to add more servers for those services. You’ll also need to configure S3 for your static files, a CDN to serve those worldwide, and Route53 for your routes.

By this time, the company has grown and it’s time to create IAM roles and users for the new developers, then give them the correct access rights.

You also want increased reliability, so you look to allocate more servers in different datacenters. Finally, you go nuts and close the company.

The conclusion of this last example is admittedly a bit catastrophic, but imagine trying to maintain that number of servers manually. That would not scale well.

## Should you be utilizing IAC?

As with everything in tech, the answer to this question is it depends. I personally can't imagine a project that would not be bettered through the use of IAC. In my opinion, if you have a chance to incorporate it, you should give it a try and find out for yourself!

Perhaps if you are already using something like Heroku for really simple apps, implementing IAC would create too much overhead. However, if your Heroku project grows beyond a certain size, you may benefit from this kind of tool as well. Take a look at [Terraform: Heroku Provider](https://www.terraform.io/docs/providers/heroku/index.html), as an example.

# Terraform

Terraform is an IAC tool from Hashicorp that solves problems presented by the previous cases and more. As they say on their site,

> Terraform enables you to safely and predictably create, change, and improve infrastructure. It is an open source tool that codifies APIs into declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned.

For example, you have a load balancer with 5 VMs attached to it. Run the following simple code to return to that same state every time.

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

That’s awesome! Imagine how many times you would have had to click to do all that by hand. Definitely quite a few!

Utilizing code similar to this, I was able to recreate the second case I presented earlier in just one week, which is pretty amazing! I’m sure it would have taken me at least twice as long to do it manually.


# Conclusion

Your infrastructure is as important as the code it runs, so I recommend that you treat it the way it deserves to be treated; you should complete reviews, versioning, tests, and so on.

Managing infrastructure by hand is difficult, even if you are disciplined and document everything. After all, you are only human - you could forget something someday, and that day you will regret  not using IAC tools.

You can get started by managing something simple in your app with an IAC tool, then gradually migrate other things over.

If you have the opportunity to use Terraform or any other IAC tool, consider it a great way to improve how you manage your infrastructure. It can enable you to do great things quickly!

If you have questions or comments, please post them below!

# Resources

- *Infrastructure as Code: Managing Servers in the Cloud* by Kief Morris. [Link](https://books.google.com/books?id=4IdRDAAAQBAJ&dq=inauthor:%22Kief+Morris%22&hl=en&redir_esc=y)
- *Terraform: Up & Running* By Yevgeniy Brikman. [Link](https://www.terraformupandrunning.com/)
