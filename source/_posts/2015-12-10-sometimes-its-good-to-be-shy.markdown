---
layout: post
title: "Sometimes, it's good to be shy"
category:
comments: true
author:
  name: Rodrigo Ponce de León
  email: rodrigo@wyeworks.com
  twitter_handle: rponce_89
  github_handle: rodrigopdl
  image: /images/team/rodrigo-pdl.jpg
  description: Ruby on Rails developer at WyeWorks. Beatlemaniac. Guitar freak.
---

> Life doesn't stand still.

> Neither can the code that we write. In order to keep up with today's
> near-frantic pace of change, we need to make every effort to write code
> that's as loose--as flexible--as possible. Otherwise we may find our
> code quickly becoming outdated, or too brittle to fix, and may
> ultimately be left behind in the mad dash toward the future.

This quote, taken from the highly regarded *"[The Pragmatic Programmer](https://pragprog.com/book/tpp/the-pragmatic-programmer)"* book,
depicts beautifully an ongoing, everyday challenge software developers
face: writing flexible enough code which smoothlessly adapts to change.

What [Andy Hunt](https://twitter.com/PragmaticAndy) and [Dave Thomas](https://twitter.com/pragdave) are telling us is that
software we develop, just as much as the world we live in, resides in a
constant state of evolution. Despite our best efforts, requirements *will*
change, and we'll be better off if our solution is prepared for it.

<!--more-->

In our quest to write flexible code, three concepts arise which I think
help tremendously in achieving our ultimate goal, or at least they clear
the path towards the consummation of this never ending struggle.

## DRY.. DRY... DRY...

> [Every piece of knowledge must have a single, unambiguous,
> authoritative representation within a system.](https://pragprog.com/book/tpp/the-pragmatic-programmer)

The acronym *DRY* stands for *"Don't Repeat Yourself"*, that is,
not doing what I did on this section's title. When crafting software
solutions, this translates to *ACD*: *"Avoid Code Duplication!"*.

Code repetition aggravates the maintainability nightmare software
developers are generally used to. Incoming changes affecting a duplicated piece
of knowledge in our application would need to be taken care of in more than one
place of our codebase. On complex systems, making these changes effectively
constitutes a daunting task, which may lead to unexpected and hard to find
bugs.

This is why keeping your code *DRY* can help tremendously in creating flexible
systems. When a shift in requirements occurs, or a bug is reported in
production, there will only be *one place* where to make the change.

*DRY* up in face of the inevitable. As Sam Cook said, [a change is gonna come.](https://en.wikipedia.org/wiki/A_Change_Is_Gonna_Come)

At this point, you might be asking yourself:

> Not so shy reader:

> Alright! But, what does being shy have to do with all of this?

Well, what I meant is that, while being shy in life might
sometimes be seen as a disadvantage, writing *shy code* might be in your best
interest.

> Not so shy reader:

> Right... So what is shy code?

As with shy persons, we can think of shy code as code which keeps to itself,
sharing little information about its responsibilities to others, as well as not
poking its nose into others' affairs. Real life examples tend to make
things clearer, so let's go that way.

## Tell, don't ask!

When pizza boy arrives, after handing you that delicious pizza, he will proceed
to charge you for it. First, he will reach into your pockets and get hold of
your wallet, then he'll grab the first credit card he finds in it, and finally,
he will make the desired payment:

{% codeblock lang:ruby %}
  customer.belongings.wallet.creditcards.first.make_payment
{% endcodeblock %}

> Not so shy reader:

> Mmmm... is it supposed to go that way?

Of course...

Well, it's not.

Most often, delivery guy will simply *tell* you to pay for the pizza:

{% codeblock lang:ruby %}
  customer.make_payment
{% endcodeblock %}

It makes no sense for pizza man to keep asking questions about your concerns,
poking nose into your own affairs. By simply telling the customer to make the payment, he
leaves us with the responsibility of doing it, and abstracts himself of
unnecessary details.

Following this same rule, we can build software modules which depend upon
interfaces that abstract nasty implementation details from the outside world.
This means that -- from a modules point of view -- changes which might occur in other
modules will be less likely to break something in this one, as well as
changes to this module not propagating bugs to the whole system.

Back to our real life example. The *asking* snippet presents the problem that,
if tomorrow I decide to keep my credit cards in a drawer instead of my wallet,
`PizzaBoy` module would break. *Tell* snippet on the other hand, ensures
that this modification to `Customer` internals is transparent to `PizzaBoy`.

> Not so shy reader:

> This is kinda' cool, but we, software developers sometimes need
> some kind of rule which helps us in spotting those places in our codebase where
> we are becoming more of the *asking* guy rather than the *telling* one...

I thought you would say that. Turns out there is a *law* for this...

## Demeter to the rescue

> [Only talk to your immediate friends](http://www.ccs.neu.edu/research/demeter/demeter-method/LawOfDemeter/general-formulation.html)

In 1987, fruit of the work done on [The Demeter Project](http://www.ccs.neu.edu/research/demeter/), Ian Holland proposed a
style rule for designing object-oriented systems. It was named "*[The Law of Demeter](http://www.ccs.neu.edu/home/lieber/LoD.html)*".
What this rule defines, is a set of guidelines which restrict the amount
of objects to which you may send messages to.

I like [Brad Appleton's](http://www.bradapp.com/docs/demeter-intro.html) phrasing of the [style guideline](http://c2.com/cgi/wiki?LawOfDemeter):

> A method "M" of an object "O" should invoke only the methods of the following kinds of objects:

> 1. itself
> 2. its parameters
> 3. any objects it creates/instantiates
> 4. its direct component objects

Let's make it clearer with an example:

> Choo choo! Here comes the train wreck!

{% codeblock lang:ruby %}
  def make_garden_pretty(gardener)
    gardener.tools.garden_scissors.cut
  end
{% endcodeblock %}

This small snippet, presents a method which violates Demeter's law. On
the quest to make our garden beautiful, we are taking our chain of calls
one step too far. Can you hear the train wreck coming?

Demeter states on it's second rule that a method can invoke functions of the kind of object it
receives as a parameter. However, upon the advent of a new object type, call
chaining should stop. Our gardening example shows we're calling a method
defined on the `Gardener` class, `tools`, which corresponds to the received
parameter's type. However, chaining continues by invoking the `garden_scissors` method
of the `Tool` module. Additionally, we're chaining the `cut` call, belonging to
the `Task` module. Can you notice the problems this could lead to?

Besides being kind of rude, this presents a bigger headache, very similar
to the one depicted on the `PizzaBoy` examples. We are coupling
ourselves to the outside world's concerns, creating a dependency which
could ruin things for us in the future. Let me clarify this. Say some
time from now, our gardener decides to stop using scissors in his daily
work, and start using a lawn mower, because he determines that is the most
effective way to make your garden shine. A change in his set of tools
has developed. Scissors no longer exist in the gardener's toolbox.

Knowing too much about how to make your garden look pretty lead to you
breaking in response to a change in the `Gardener`'s implementation.
In contrast to our `PizzaBoy` solution, we're not being shy here. In fact, we're
not being shy **_at all_**.

Picture this: Mr. gardener knocks on your door, you open it and
he kindly salutes you. Immediately afterwards, as a result of wanting to
make your garden prettier, you proceed to ask the gardener to hand you
his set of tools, from which you grab a pair of scissors, and top it off
by cutting your own grass. You might be asking yourself... Why did we call the
gardener in the first place?

Let's try a different approach:

{% codeblock lang:ruby %}
  def make_garden_pretty(gardener)
    gardener.do_your_thing
  end
{% endcodeblock %}

This slight modification, abstracts this module from gardening details,
which means that, if in the near future our gardener decides to buy a
lawn mower, he can change the way in which he *does his thing* without
affecting us.

On to the latter. Did you notice that we are now *telling* the
gardener what we want him to do, and not making him questions about his
responsibilities? We are now adhering to the *"Tell, don't ask"* principle,
creating a shield around us, isolating ourselves from the outside world,
not revealing much about our business, only dependent upon abstractions we
actually care about. As a result, we're also obeying Demeter, by limiting the
different kind of objects our method interacts with.

In other words, we are being **_shy_**, **_law abiders_**.

## The Law?

Let's remember the [two basic characteristics all Pragmatic Programmers share](https://pragprog.com/the-pragmatic-programmer/extracts/preface):

* Care About Your Craft
* Think! About Your Work

When crafting our solutions, we should be constantly thinking about the
decisions we make, weighing the possible consequences of each change we
apply, and how different techniques or approaches might affect the
future course of our project.

If we consider ourselves Pragmatic Programmers, then we shouldn't
embrace something as the ultimate law, and obey it invariably in our
development journey. We should assemble a fat and diverse toolbox from
which to grab the most adequate tool for the problem we're facing at any
given moment.

All systems are different, and deserve special treatment according
to their reality, user requirements and present design. A balance has to be made--that's what
being pragmatic means. However, incorporating this style of coding to
your toolbox might give you the means to ease your maintenance
nightmares and develop more flexible systems, narrowing the gap to meet
our ultimate goal: writing flexible enough code which smoothlessly adapts to change.

And remember: **_Sometimes, it's good to be shy._**

#### Further reading:

* [Keep it Dry, Shy, and Tell the Other Guy - Andy Hunt and Dave Thomas](https://media.pragprog.com/articles/may_04_oo1.pdf)
* [Demeter: It’s not just a good idea. It’s the law - Avdi Grimm](http://devblog.avdi.org/2011/07/05/demeter-its-not-just-a-good-idea-its-the-law/)
