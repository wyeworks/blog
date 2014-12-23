---
layout: post
title: Active Merchant Recurring Billing
category: Merchant
hero_image: /images/heros/post-high.jpg
comments: true
author:
  name: Sebastián Martínez
  email: sebastian@wyeworks.com
  twitter_handle: smartinez87
  github_handle:  smartinez87
  image:  /images/team/sebastian.jpg
  description: VP of Engineering at WyeWorks. Ruby on Rails hacker. ExceptionNotification maintainer. Coffee & bacon lover.
published: true
---
Working on a payment system we had to sort some difficulties when making recurring payments using active merchant. Why? Because we needed to use BeanStream gateway and active merchant does not support recurring billing for this gateway yet.
So I just added the functionality to it.

<!--more-->

You can check out my fork of Active Merchant that supports recurring billing for this merchant on [http://github.com/wyeworks/active_merchant](http://github.com/wyeworks/active_merchant.)

Here I leave you an example on how to use it:

<pre><code>
require 'rubygems'
require 'active_merchant'

 ActiveMerchant::Billing::Base.mode = :test

  # ActiveMerchant accepts all amounts as Integer values in cents
  # $10.00
  amount = 1000

  # The card verification value is also known as CVV2, CVC2, or CID
  credit_card = ActiveMerchant::Billing::CreditCard.new(
                  :first_name         => 'Bob',
                  :last_name          => 'Bobsen',
                  :number             => '4242424242424242',
                  :month              => '8',
                  :year               => '2012',
                  :verification_value => '123'
                )

  # Validating the card automatically detects the card type
  if credit_card.valid?

    # Create a gateway object for the BeansTream service
    gateway = ActiveMerchant::Billing::BeanstreamGateway.new(
                :login => 'TestMerchant',
                :password => 'password',
                :pass_code => 'pass_code'
              )

    # Make recurring payment for the amount
    response = gateway.recurring(amount, credit_card, {
      :recurring_billing => {
         :end_of_month => '1',
         :tax1 => 0,
         :interval => {
            :unit => :months,
            :length => '1'
          },
          :duration => {
            :start_date => Date.today,
            :occurrences => 5
          }
        })

    if response.success?
      puts "Successfully charged $#{sprintf("%.2f", amount / 100)} to the credit card #{credit_card.display_number}. The Account number is #{response.params['rbAccountId']}"
    else
      raise StandardError, response.message
    end
  end

</code></pre>

And that's it, you have now created a recurring billing payment.

Now, what if you want to cancel the same?
Heres is how to do that:

<pre><code>
 gateway.cancel_recurring({ :account_id => account_id })
</code></pre>

Pretty easy...the account_id is the number the gateway responses with when making a recurrent payment, and the passcode is the way of authenticating  in order to make this kind of transactions, and you can find it at the beanstream administrative console.

So try it out and have fun!
