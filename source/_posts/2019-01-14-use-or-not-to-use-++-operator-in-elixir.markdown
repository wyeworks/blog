---
layout: post
title: "Use or not to use ++ operator in Elixir"
category: elixir
comments: true
author:
  name: Jorge Bejar
  email: jorge@wyeworks.com
  twitter_handle: jmbejar
  github_handle: jmbejar
  image: /images/team/jorge-bejar.jpg
  description: Love to explore and write about Elixir, Ruby, Javascript, full-stack development and technology in general.
---

If you're familiar with *Elixir* you may have been warned about the risks of using `++` operator to concatenate lists. In fact, a piece of advice is found directly on the [official documentation for this method](https://hexdocs.pm/elixir/Kernel.html#++/2):

> The complexity of `a ++ b` is proportional to `length(a)`, so avoid repeatedly appending to lists of arbitrary length, e.g. `list ++ [item]`. Instead, consider prepending via `[item | rest]` and then reversing.

In the rest of this article we are going to discuss an example and try to explain what could be problematic using `++` but also checking if we can make an improvement refactoring as suggested on the documentation. Spoiler: life is not so easy 😅

<!--more-->

## The problem

Let's say we need to implement a function that receives a list of integers and returns a list including those numbers repeated several times, as it is showed in the following examples:

`my_func([1]) # it returns [1]`
`my_func([1,2]) # it returns [1,2,2]`
`my_func([1,3,2]) # it returns [1,3,3,3,2,2]`

The idea is to generate a list including each number *n times* where *n* is the actual value. We also expect that the original ordering of these numbers is preserved in the resulting list.

## Our first naive implementation

We could say that a very simple solution to this problem could be an approach where we use `Enum.reduce/3` and repeat each number, concatenating the list of repeated values to the accumulated list.

```ex
def number_dups_list(numbers) do
  Enum.reduce(numbers, [], fn n, acc ->
    acc ++ List.duplicate(n, n)
  end)
end
```

Let's see how it performs by running this function with a quite large list of integers. Here is our first test (using `:timer.tc` to quickly measure the time elapsed to run the code):

```ex
iex> :timer.tc(fn -> number_dups_list(List.duplicate(1,100_000)) end)
{30785140, .... }
```

After running it a few times to have some to obtain a few samples, I noted that it is taking around 3 secs (in my machine). That's pretty slow, so there might be room for improvement.

## Let's follow the documentation advice

If we carefully look at the execution of our previous example, where the input was a list containing a lot of `1`s, we see that our implementation is using `++` repeatedly. In fact, the crucial factor here is the list at the left side of the operator which is getting larger and larger in each step of the iteration. At the same time, the list at the right always is `[1]` . As the documentation says, the overall performance depends on the length of the list at the left of this operator.

So, let's see what happens if we just revert the order (and use `Enum.reverse` to fix the ordering).

```ex
def number_dups_list(numbers) do
  Enum.reduce(numbers, [], fn n, acc ->
    List.duplicate(n, n) ++ acc
  end)
  |> Enum.reverse
end
```

Let's run again and see if we gain some performance:

```ex
iex> :timer.tc(fn -> number_dups_list(List.duplicate(1,100_000)) end)
{11570, .... }
```

In my machine this is running **in approximately 11ms**! It is a huge difference, and this is proportional to the length of the list we are testing.

All good so far, but... are we sure that this is going to perform better in all cases? Well, we're not in a safe place yet. Let's run again our function using a different input.

```ex
iex()> :timer.tc(fn -> number_dups_list([10_000_000, 20_000_000]) end)
{2638101, .... }
```

You may already noticed the problem! We're now using a very short list but the numbers are very big numbers. So, in this case we're again in the position where the list at the left of the `++` operator is always a very large list, ending up in a slower execution of the function (around 2 secs).

What it is funny here is that our former implementation works a bit better for this list (under 1.5 secs). It is only in the very first step of the iteration where the list at the left of the `++` operation is a short list (an empty list). These results suggests that reversing is making a difference here, where the previous implementation (where reversing is not needed) wins for this type of input.

At this point, it is better to start measuring the performance in a more robust way. We are going to use [Benchee](https://github.com/PragTob/benchee) to handle all the benchmarking work for us. See our function to run the benchmark (assume this function is included in the same module and note we are now using different function names for each implementation):

```ex
def run_benchmarks do
  inputs = %{
    "long list with low values" => List.duplicate(1,100_000),
    "short list with high values" => [10_000_000, 20_000_000]
  }

  Benchee.run %{
    "Using ++" =>
      fn(list) -> number_dups_list1(list) end,
    "Using ++ and reverse"  =>
      fn(list) -> number_dups_list2(list) end,
  }, time: 20, warmup: 5, inputs: inputs
end
```

Running this code in my computer gives me the following output:

```
##### With input long list with low values #####
Name                           ips        average  deviation         median         99th %
Using ++ and reverse        123.53      0.00810 s    ±18.33%      0.00824 s       0.0127 s
Using ++                    0.0366        27.35 s     ±0.00%        27.35 s        27.35 s

Comparison:
Using ++ and reverse        123.53
Using ++                    0.0366 - 3378.87x slower

##### With input short list with high values #####
Name                           ips        average  deviation         median         99th %
Using ++                      0.93         1.07 s    ±41.40%         1.00 s         2.38 s
Using ++ and reverse          0.50         2.01 s    ±29.48%         2.01 s         3.48 s

Comparison:
Using ++                      0.93
Using ++ and reverse          0.50 - 1.88x slower
```

This is confirming what we saw before, specially the fact that our first implementation is faster for short list with very high numbers. As we mentioned, what makes the difference is the `Enum.reverse` invoked over a very long list (you can easily verify it by commenting this part and checking that the benchmarks results are now very similar, but the functions will be not producing exactly the same results).

## What is the problem with the left-side lists?

A further explanation of this issue would require a blog post in its own :)
Let's just mention that the Erlang VM is forced to make a full copy of the list at the left of `++` when calculating the result of the operation, while this is not necessary for the list at the right. The allocated memory of the second list can be reused by the resulting list, but the left-side original list needs to be copied on memory. Therefore, the larger it is the lelf-side list, the costly it is the overall append operation. 

You can find more information [here](http://erlang.org/doc/efficiency_guide/listHandling.html).


## Attempt to reimplement without using `++`

The official docs suggests to refactor our code relying on `++` to use  `[item|rest]` . Why don't give it a try? One thing that is not explicitly stated here is the need to use, probably, `Enum.reduce/3` to iterate over the elements of the list at the left of the `++` operator, in order to achieve the same result.

```ex
def number_dups_list3(numbers) do
  Enum.reduce(numbers, [], fn n, acc ->
    Enum.reduce(List.duplicate(n, n), acc, fn n2, acc2 ->
      [ n2 | acc2 ]
    end)
  end)
end
```

Time to run this new implementation and see what happens...

```ex
iex> fn -> number_dups_list3(List.duplicate(1,100_000)) end |> :timer.tc
{16279, .... }

iex> fn -> number_dups_list3([10_000_000, 20_000_000]) end |> :timer.tc
{2515518, .... }
```

We found that the first case, where the values in the list are low values, it runs very well. However, it seems that there is no much difference with our second implementation relying on `++` (the one that growths the resulting list prepending short lists).

Additionally, the case for the input list `[10_000_000, 20_000_000]` is performing quite slow, but let's see the complete report after running the 3 functions with the assistance of Benchee:

```
##### With input long list with low values #####
Name                                       ips        average  deviation         median         99th %
Using ++ and reverse                    119.85        8.34 ms    ±24.50%        8.22 ms       15.47 ms
Without ++ ([h | t] and reverse)         70.75       14.13 ms    ±21.33%       13.07 ms       26.79 ms
Using ++                                0.0300    33361.65 ms     ±0.00%    33361.65 ms    33361.65 ms

Comparison:
Using ++ and reverse                    119.85
Without ++ ([h | t] and reverse)         70.75 - 1.69x slower
Using ++                                0.0300 - 3998.44x slower

##### With input short list with high values #####
Name                                       ips        average  deviation         median         99th %
Using ++                                  0.92         1.08 s    ±45.19%         1.01 s         2.51 s
Using ++ and reverse                      0.41         2.45 s    ±27.75%         2.29 s         3.72 s
Without ++ ([h | t] and reverse)          0.35         2.85 s    ±39.46%         2.39 s         4.82 s

Comparison:
Using ++                                  0.92
Using ++ and reverse                      0.41 - 2.26x slower
Without ++ ([h | t] and reverse)          0.35 - 2.64x slower
``` 

We were not able to beat our former implementations relying on `++` for any of our test cases, so the option suggested by the documentation was not the best fit for us in any of our two situations.

## Another implementation idea?

We can think more and come up with more ideas to implement a solution to our problem. If we stop thinking a little bit about the performance, we can just try to find additional ways to reimplement the code, maybe ending up with a more elegant solution in code.

For example, if we combine `Enum.map/2`  and `Enum.flatten/1` we have the following implementation.

```ex
def  number_dups_list4(numbers) do
  Enum.map(numbers, &(List.duplicate(&1, &1)))
  |>  List.flatten
end
```

It is actually quite simple to follow. We're now creating a list including of the intermediate lists with the duplicated items. At the end, everything in flattened in the final list.

How it could perform? If we try to guess what is going to happen, I would say that will be a fight between the need to keep the intermediate lists in memory across all the iteration and the fact that it does not need to revert the resulting list (as others solutions has to do).

The final answer is known after running our benchmarks:

```
##### With input long list with low values #####
Name                                       ips        average  deviation         median         99th %
Using ++ and reverse                    120.03        8.33 ms    ±25.82%        8.11 ms       16.30 ms
map / flatten                           113.00        8.85 ms    ±21.77%        8.17 ms       17.72 ms
Without ++ ([h | t] and reverse)         76.24       13.12 ms     ±9.12%       12.93 ms       17.96 ms
Using ++                                0.0324    30821.21 ms     ±0.00%    30821.21 ms    30821.21 ms

Comparison:
Using ++ and reverse                    120.03
map / flatten                           113.00 - 1.06x slower
Without ++ ([h | t] and reverse)         76.24 - 1.57x slower
Using ++                                0.0324 - 3699.55x slower


##### With input short list with high values #####
Name                                       ips        average  deviation         median         99th %
Using ++                                  0.93         1.08 s    ±39.43%         1.03 s         2.38 s
map / flatten                             0.61         1.63 s    ±46.49%         1.53 s         3.90 s
Using ++ and reverse                      0.53         1.89 s    ±34.73%         1.84 s         3.61 s
Without ++ ([h | t] and reverse)          0.37         2.70 s    ±33.23%         2.37 s         4.16 s

Comparison:
Using ++                                  0.93
map / flatten                             0.61 - 1.51x slower
Using ++ and reverse                      0.53 - 1.75x slower
Without ++ ([h | t] and reverse)          0.37 - 2.50x slower
```

We can see that this solution ranks quite well, **taking the second place in both situations**. It wouldn't be a bad choice to use this implementation if we expect to have both types of inputs (specially if we just discard our very first attempt because of the very bad results in the case where the accumulated list is always used at the left of the `++` operator).

However, we would need to test more cases to make a more informed decision. After all, we are testing with two very different and, maybe, extreme cases. For instance, we can test our implementations with the list `Enum.to_list(1..1000)`, or whatever that could be considered as an average case. I tested with this new input and I found it runs faster with the second implementation, the one with `++` and `reverse` (while the `map` and `flatten` version performs as the `[item | rest]` version does).

## Conclusions

Here is my list of thoughts to share about working with the `++` operation in Elixir, specially in situations where the expected load is high and performance impact could be an issue to deal with.

* It is important to know the risks of using `++` to append lists, specially when the list of the left of the operation can have a large number of elements.

* If you're in the situation described above, you may consider using `Enum.reduce` and `[item | rest]` but you should validate if this refactor actually improved the situation. Although I think the advice in the documentation is a good _rule of thumb_, you shouldn't blindly follow it. In fact, I would try to use `++` but inverting the order of the appended lists (and reverting the result later).
Moreover, you can also test different implementations using different language tools, as we did when we tried `Enum.map` and `Enum.flatten` and see how it compares with the previous attempts.

* Reflect on the shape and the size of your expected inputs. Think also in the number of created lists and their length in the intermediate steps of the calculation. What it is the best performant implementation will depend on the usage patterns.

* Keep in mind that it is usually hard to predict what will be the final performance... unless you are really an expert on Elixir/Erlang internals 😀. For the rest of us mortals, it is crucial to run benchmarks with different cases and make decisions based on that. Every situation is unique!

Lastly, you may want to take a look at the chapter of [Erlang Efficiency Guide](http://erlang.org/doc/efficiency_guide/introduction.html) dedicated to [lists](http://erlang.org/doc/efficiency_guide/listHandling.html). It includes some good insights about list operations, including `++`, `flatten`, etc. Elixir is mostly relying on those Erlang functions.

And because I know you are curious, here is [the complete code](https://gist.github.com/jmbejar/3761e0fd2905f7aaa0aedbbfda598624) and results of the benchmarks mentioned in this post.
