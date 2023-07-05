# Mandelbrot Set / Julia Set Exploration

When I watched [that Veritasium video about the logistic equation](https://youtu.be/ovJcsL7vyrk), I was really intrigued by the
connection between the bifurcation diagram and the Mandelbrot set. Also, in <em>Chaos</em> by James
Gleick, I found Benoit Mandelbrot’s story fascinating -- and the images of the Mandelbrot set
included in the book were breathtaking. Wanting to recreate the beautiful complexity of the
Mandelbrot set, I set out to write some code.

## Learning How To Make The Mandelbrot Set

First, I needed to figure out how the Mandelbrot set is generated so that I could do it myself. It
turned out to be quite simple. In <em>Chaos</em>, Gleick provides a really helpful overview of how one
can generate the Mandelbrot set:

<img width="574" alt="Screen Shot 2023-07-05 at 5 13 41 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/14603c07-ba86-467d-b168-1029c35f4133">

From my understanding, this “arithmetical rule” is the recursive sequence $z_{n+1} = (z_n)^2 + c$, where
$z_0 = 0$, and we can plug in any complex number for $c$. To determine if $c$ is either in the
Mandelbrot set or out of the set, we need to ask our program the following question:

### Does the sequence diverge to infinity?

If the answer is yes, $c$ is <em>in</em> the Mandelbrot set. If the answer is no, $c$ is <em>out</em> of the Mandelbrot set.

Feeling like I had a good conceptual grasp on how to draw the set, I wanted to do a quick
refresher on the addition and multiplication of complex numbers before I wrote my program. I
found Gleick's explanations of computations with complex numbers to be very helpful.
To add two complex numbers, we add the real part to the real part, and the imaginary part to the
imaginary part. For example, we can solve (2 + 6i) + (7 - 2i) like so:

<img width="168" alt="Screen Shot 2023-07-05 at 5 15 56 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/507ae8c2-f59b-45d8-82eb-800413cc9b02">

Using this knowledge, I wrote a function in my program to add 2 complex numbers, called
complexAdd():

<img width="361" alt="Screen Shot 2023-07-05 at 5 16 14 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/5a857f9f-4c5b-4d92-a5e6-fe84e74086f9">

The function takes 4 arguments: the real and imaginary part of one complex number (r1 and i1,
respectively) and the real and imaginary part of another complex number (r2 and i2,
respectively). It outputs the complex numbers’ sum as 2 values: the real part (r1 + r2) followed
by the imaginary part (i1 + i2)

Multiplying two complex numbers isn’t as intuitive, since the product of two imaginary numbers
is a real number (i * i = -1). To deal with this, I prefer to treat the problem as a binomial
expansion (using FOIL, better known as the “Crab Claws” method).
For example, here is how we solve (3 + 4i)(3 + 4i):

<img width="228" alt="Screen Shot 2023-07-05 at 5 16 45 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/8f73d723-5d78-4e5c-ac70-85c8f1b383bb">

Thinking algorithmically, like a computer, we can work backwards from this process to come up
with formulae for the real part and imaginary part of the product of 2 complex numbers in terms
of the real parts (r1 and r2) and imaginary parts (i1 and i2) of the 2 complex numbers. Since a
computer doesn’t know how to deal with imaginary numbers, we just pretend that every number
is real, and when we multiply 2 “imaginary numbers” we multiply the product by -1 (since i * i
evaluates to -1):

<img width="304" alt="Screen Shot 2023-07-05 at 5 17 04 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/12ce796f-24b3-4b09-ba53-f5b885362f9c">

Now that I had the real and imaginary parts of the product of 2 complex numbers in terms of the
real parts (r1 and r2) and imaginary parts (i1 and i2) of the 2 complex numbers, I simply copied
the format of the complexAdd() function, but inputted the appropriate expressions for the real and
imaginary parts.

<img width="427" alt="Screen Shot 2023-07-05 at 5 17 22 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/c6fc808f-8d2c-4077-a85a-51337f3ca8f0">

## mandelbrot()

Now that I could easily perform computations with complex numbers, I was ready to generate
the Mandelbrot set! I just needed a way to plug in different complex numbers, $c$, to the recursive
sequence $z_{n+1} = (z_n)^2 + c$, and determine whether or not the sequence diverges to infinity. This
information would tell me whether or not $c$ is in the Mandelbrot set.

To accomplish this, I wrote a recursive function called mandelbrot() that runs the sequence $z_{n+1} = (z_n)^2 + c$ and outputs “true” if $c$ is in the Mandelbrot set and “false” if it isn’t. It takes 5
arguments:
<ul>
  <li>n, the current number of iterations into the sequence (always starts at 0)</li>
  <li>Zr and Zi, the real and imaginary parts of $z_n$ (always starts at 0)</li>
  <li>Cr and Ci, the real and imaginary parts of c (the value being tested)</li>
</ul>

The function contains three parts: two base cases and one recursive step.
<ol>
  <li>
    (Base Case) We check if the sequence will head off to infinity. According to James
Gleick, if the real or imaginary part of $z_n$ (Zr or Zi) is either greater than 2 or less than -2,
the sequence will diverge to infinity (we can imagine this range as a 4x4 square centered
at the origin of the complex number plane). If this is the case, that means that c is not in
the Mandelbrot set, and we can exit the function by outputting “false”:
  </li>
    <img width="502" alt="Screen Shot 2023-07-05 at 5 20 42 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/388123ad-414b-4563-bb23-b5e81a287555">
  <li>
    (Base Case 2) We check if the sequence will not head off to infinity. Gleick claims that if
the sequence iterates at least hundred times without $z_n$ exiting the range [-2,2], c is most
likely* in the Mandelbrot set. For our program, this means that if n -- the number of
iterations -- reaches 100, then c is in the Mandelbrot set and we can exit the function by
outputting “true”:
  </li>
  <img width="152" alt="Screen Shot 2023-07-05 at 5 22 37 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/cbf39753-13b5-4aeb-a670-c22e2aabd00b">
<em>
  
  *I write “most likely” because we can actually never be certain, for some values of c, if c is in
the Mandelbrot set. Who’s to say that $z_n$ won’t diverge to infinity after googol iterations? 100
iterations is safe, but if we want to zoom in a lot, we should check more than that.</em>
<li>
  (Recursive Step) If this last part of the function is reached, this means that the program
has yet to decide whether or not $z_n$ will diverge to infinity. So, we calculate the next term
in the sequence, and feed that value right back into the mandelbrot() function.
  <ul>
    <li>
    First, we find the $(z_n)^2$ part of the equation using the complexMultiply() function:
    </li>
    <img width="460" alt="Screen Shot 2023-07-05 at 5 26 34 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/25a29933-419b-4e2e-9dfe-0b7f94464548">
    <li>
      Next, we add c to $(z_n)^22$ using the complexAdd() function:
    </li>
    <img width="555" alt="Screen Shot 2023-07-05 at 5 27 19 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/f0224d14-b2ce-41aa-bde3-5accb9249e70">
    <li>
      Lastly, we input the next term of the sequence, sum, into mandelbrot(), increasing n by 1 (++n) to reflect that there has been 1 more iteration.
    </li>
    <img width="486" alt="Screen Shot 2023-07-05 at 5 27 54 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/b121d9f2-d57f-43b1-bb6b-32b99f0aa5d8">

  </ul>
</li>
</ol>

## Generating the set

Now that I had a way to check if any complex number c is in the Mandelbrot Set, I could
actually draw the set! I iterated through a grid of points on the complex number plane, inputting
each point into mandelbrot() to determine if the point lies in the Mandelbrot Set. If so, I plotted a
black dot at that value’s location on the complex number plane.

I felt such a rush of happiness when my program first outputted this:

<img width="615" alt="Screen Shot 2023-07-05 at 5 28 43 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/389dd4aa-9f8f-4006-85ae-31aa70eeb459">

I was so excited because I immediately recognized what my program had created: the
Mandelbrot set! This feeling was bittersweet, though, because for some reason it was ...
sideways? I soon realized that I made the silly mistake of switching the x- and y-coordinates
when I plotted the points, which resulted in the rotation!
When I fixed that bug, I got this:

<img width="615" alt="Screen Shot 2023-07-05 at 5 29 03 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/cd2a706e-ddaa-4453-b54c-a15e179a3cc9">

By checking many more complex numbers (i.e. making smaller increments between points), I
created a much more refined Mandelbrot Set:

<img width="611" alt="Screen Shot 2023-07-05 at 5 29 24 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/945b76ad-4fad-4809-b456-96e71b2d9daa">

## Colors

Although I was pretty happy with what I had generated, I wanted to make it more aesthetically
pleasing. Having played around with [Google's interactive Mandelbrot set viewer](https://www.google.com/search?q=Benoit+Mandelbrot&oi=ddle&ct=146439466), I knew I could
play around with colors a bit to make it more pretty. I did some research and learned that I could
color each point outside of the set based on the number of iterations it takes for that c-value’s
sequence to exit the range [-2, 2] in either its real or imaginary part. That is, c-values with
sequences that exit the range faster (it takes fewer iterations) are darker, whereas c-values with
sequences that exit the range slower (it takes more iterations) are brighter.

For example, when we plug in -0.56 + 0.66i for c, the sequence takes 21 iterations to exit the
range [-2,2]. If we set 40 iterations as the “maximum iterations,”* and then map (using p5’s built
in map() function) this number of iterations (10) from the range [0,40] to the range [0,255] (the
“red”** component of the RGB scale -- each of the 3 colors has a range of [0,255]), we get an
RGB code of (133.875, 0, 0) which looks like this: <img width="20" alt="Screen Shot 2023-07-05 at 5 30 40 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/c4c5f8dc-8198-45f6-a44c-81e8615b7b8d">.
Numbers further from the Mandelbrot
Set break off after fewer iterations which results in darker shades of red. For example, the
c-value -0.9 - 0.5i breaks off after 15 iterations, which results in an RGB code of (95.625,0,0),
which is a darker shade of red: <img width="21" alt="Screen Shot 2023-07-05 at 5 31 12 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/a8603fc6-8d4e-4497-8955-e42f13cab8db">

*For higher magnification, the “maximum iterations” should be higher than 40 because points
closer to the Mandelbrot Set take many more iterations than 40 to break out of the range [-2,2]

**I could’ve chosen red, green, or blue (or even a combo of them), but I chose red because I
thought it looked cool.

When I implemented this color scheme into my [code](https://github.com/johnbloch/Mandelbrot/tree/52bd6352edd439ac90028897bd7c9680cbbd8d1e/Mandelbrot_2023_07_05_21_06_19), I got a really cool result:

<img width="609" alt="Screen Shot 2023-07-05 at 5 33 54 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/0a61b7c2-71a4-4275-aa35-2b7dbe45ab37">

Not only is this just awesome to look at, but it’s also interesting to see how the c-values closest to
the Mandelbrot Set are colored the brightest, meaning it takes them longer to diverge to infinity. I
remember in <em>Chaos</em>, Gleick had a cool analogy for this: it’s almost as if the c-values surrounding
the Mandelbrot set are being pulled into the set, like a magnet. Points closest to the set are the
most attracted to the set, which is why it takes so long for them to diverge to infinity.

## Zooming in

What I find really weird is that the designs created by this color scheme appear to have fractal
attributes! We can see this fractality by zooming in more (note that as I zoom in, I also need to
increase the “maximum iterations” when scaling the coloring so as not to lose any details)

<img width="497" alt="Screen Shot 2023-07-05 at 5 35 02 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/6662b2ae-ef10-4ae0-8412-7e9d71ebebc6">

<img width="613" alt="Screen Shot 2023-07-05 at 5 35 15 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/49f4ba3e-0906-410e-9e11-988b1b15e3bc">

And the Mandelbrot set appears to be a fractal in addition to the color patterns outside the set
because I’m finding tiny “Mandelbrot set islands” around the main Mandelbrot set.

<img width="611" alt="Screen Shot 2023-07-05 at 5 35 33 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/7f8bc2ab-b14e-4a5b-974e-907e41872a7c">

!

<img width="614" alt="Screen Shot 2023-07-05 at 5 35 50 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/e8ee8a3a-5c77-4bec-9f11-8074d8e91d43">

I was shocked when I zoomed in here. I was expecting for that little “bulb” off of the island* to
look exactly like the Mandelbrot set I had been seeing on all of the previous scales I had zoomed
in on, except it’s different. Although the same general structure of the shape is maintained, it’s
clearly a different, and arguably more beautiful and intricate shape. My mom said it looks kind
of like a coral reef. I was planning on stopping here, but I wanted to keep zooming...I was
especially intrigued by this weird-looking structure in the bottom right:

<em>*Although I am calling them “islands,” I learned in Chaos that the Mandelbrot set is actually
completely contiguous. I just think the parts that connect the “islands” are so tiny that my
program skips over them and doesn’t even check those values.</em>

<img width="609" alt="Screen Shot 2023-07-05 at 5 36 41 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/41dd2906-74aa-4933-a192-af834860f9b3">

<img width="609" alt="Screen Shot 2023-07-05 at 5 36 53 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/429d1327-c826-4bda-bea6-f4a63ee16077">

This scale is my favorite -- there’s just so much going on. Considering that I found newer and
newer structures on smaller and smaller scales, I wonder if there are any new structures on even
smaller scales. I think people often call the Mandelbrot set a fractal, but I’m wondering if that’s
actually accurate? From what I’ve seen so far, it doesn’t appear to be self-similar on very small
scales... isn’t that a necessity for something to be called a fractal?

## Connection to Bifurcation Diagrams

In addition to zooming in really far, I also wanted to explore the connection to the logistic map.
In the Veritasium video, I learned that different “bulbs” correspond to different periods -- that is,
a c-value in the “main” bulb yields a sequence with a period of 1, whereas other bulbs yield
different periods.

I wanted to see these different periods, so, inspired by this [Numberphile video](https://www.youtube.com/watch?v=FFftmWSzgmk), I added in a
[feature](https://github.com/johnbloch/Mandelbrot/tree/52bd6352edd439ac90028897bd7c9680cbbd8d1e/VisualizeOrbits_2023_07_05_21_08_47) to my code that allows me to see the long term behavior of each point on the Mandelbrot
set. Wherever my mouse goes, my program calculates the first 500 terms of the sequence for the
c-value corresponding to my mouse’s location on the complex number plane. Then, it deletes the
first 400 terms, and plots the 400-500th terms as white dots on the complex plane. This way, I
can see, for any given c-value that we plug into the sequence, the long term behavior of that
sequence.

For example, here’s the long term behavior when c is in the “main” bulb (The location of the
letter “C” represents the value for c and the white dot(s) represent(s) the long term behavior):

<img width="333" alt="Screen Shot 2023-07-05 at 5 38 32 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/0c971b3f-8344-4e16-a61d-c0fcd09e3efb">
The sequence settles to a single value. Thus, it has a period of 1

Here’s the behavior when c is in the bulb to the left:

<img width="343" alt="Screen Shot 2023-07-05 at 5 39 04 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/854f049d-5e1a-425f-a784-c4111efc286a">
The period <em>doubles</em> to 2

What if we move c to the next bulb to the left?

<img width="337" alt="Screen Shot 2023-07-05 at 5 39 32 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/ffc00115-ab7c-4cea-95e0-5e43ff135db5">
The period <em>doubles</em> again to 4

Just like the logistic equation’s long term behavior’s period doubled as we increased r, the period
of the long term behavior of the sequence we use for the Mandelbrot set also doubles when we
change the value of c!

It’s also interesting to see how the relationship between the distances between the points are
exactly the same as the logistic map in the period 4 region:

<img width="604" alt="Screen Shot 2023-07-05 at 5 40 26 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/ec7c0d45-dcaa-47a8-a7f4-81db564e1198">

## Feigenbaum's Constant

Now that I had seen period doubling, I was wondering if I could find Feigenbaum’s Constant.
So, I measured the length of some of the bulbs:

<img width="753" alt="Screen Shot 2023-07-05 at 5 41 20 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/e3f5fa11-a0c7-4de5-ba99-76dc89097fa4">

I got pretty close to 4.699. If I were to keep going I think I’d get pretty much exactly the
Feigenbaum Constant (but only to a certain point because of rounding)
It’s very tedious to take these measurements, so I decided not to measure another set of bulbs to
get the constant elsewhere in the Mandelbrot set, however I think it should work as long as I
follow one line of bulbs (meaning that when we go from one bulb to the next, the period doubles
each time).

## Period Lengths

In the logistic map, we only have period doubling. But, in the Mandelbrot set, there’s also period
<em>tripling, quadrupling, quintupling</em>, and so on...

For example, check out the period of the sequence when c is in this bulb off of the main bulb:

<img width="357" alt="Screen Shot 2023-07-05 at 5 43 06 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/aede6913-f73c-4c9f-bca1-c52d217bde72">

If we move c to a different bulb, our period is 5:

<img width="339" alt="Screen Shot 2023-07-05 at 5 43 23 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/01305fbb-20f6-429d-bce1-0e480802d33b">

I also thought it was so cool that this little piece of the set (which is actually just a tiny
Mandelbrot set!!!)

<img width="663" alt="Screen Shot 2023-07-05 at 5 44 11 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/bd48c023-ccbe-4f4e-8886-46b09a1cfd82">

It’s just so weird that this region ALSO has a period of 3.

Here’s a diagram of a bunch of different periods of different bulbs I was able to find:

<img width="661" alt="Screen Shot 2023-07-05 at 5 44 52 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/524a7829-0a0a-4e6e-abe1-17a65ea2c9ff">

<ol>
  <li>
    In general, it seems that smaller bulbs have larger periods, and vice versa.
  </li>
  <li>
    Another thing I noticed is that there are patterns between which bulbs result in period
doubling, which bulbs result in tripling, and so on. Let’s start by examining this bulb
which has a period of 3:
  </li>
  <img width="215" alt="Screen Shot 2023-07-05 at 5 45 41 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/ce7a4df5-ef77-4f85-b60f-2087f33456c1">

</ol>

It has certain bulbs which branch off of it that have larger periods:

<img width="231" alt="Screen Shot 2023-07-05 at 5 46 02 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/b211cb39-50b0-4b4c-88b4-ea6db0cd964b">

And note that when we go from the period 3 bulb to the bulb on the very end, the period <em>doubles</em>
(from 3 to 6), whereas if we go to one of the side bulbs, the period <em>triples</em> (from 3 to 9).

Now, let’s select a different bulb off of the main bulb with a different period:

<img width="217" alt="Screen Shot 2023-07-05 at 5 46 43 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/03c115cf-03d4-440d-b625-bea53a1154b7">

We see very similar pattern with its own bulbs:

<img width="344" alt="Screen Shot 2023-07-05 at 5 47 00 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/3c274aa0-1fa3-44b1-a2e5-0baf49e991a7">

Just like the period 3 bulb, the bulb at the end of this period 5 bulb makes the period <em>double</em>
(from 5 to 10), and the 2 bulbs on either side make the period <em>triple</em> (from 5 to 15)

So- not only is the Mandelbrot set self similar in terms of its shape (well, sort of) it is also seems
self similar in terms of the way that the periods change from any given bulb to its “branch bulbs”
(the smaller bulbs that connect to a bulb)

## Julia Sets

I also watched this Numberphile video about Julia Sets. They are very similar to the Mandelbrot
set in that they are both based off of the sequence $z_{n+1} = (z_n)^2 + c$.

However, there is an important distinction:
<ul>
  <li>
    For the Mandelbrot set, we ALWAYS keep $z_0$ at 0 (that is, the sequence always begins at
0) and we include any given number in the set if, and only if, when we plug that number
into the sequence for c, the sequence stays bounded.
  </li>
  <li>
    For any given Julia Set, we always keep c at a certain value (it can be any value-- which
is why there are Julia Set<em>s</em> plural), and we include any given number in the set if, and only
if, when we plug that number into the sequence for $z_0$, the sequence stays bounded.
  </li>
</ul>

Because the distinction is so simple, making my [program](https://github.com/johnbloch/Mandelbrot/tree/52bd6352edd439ac90028897bd7c9680cbbd8d1e/JULIA_2023_07_05_21_09_52) generate Julia Sets only involved
changing a couple lines of code.

Here are some cool Julia Sets I was able to generate:

<img width="547" alt="Screen Shot 2023-07-05 at 5 49 41 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/baf48bb9-22d5-49f1-bb5a-8f1ad77bdefb">

<img width="311" alt="Screen Shot 2023-07-05 at 5 49 52 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/f326f3a9-6188-4e2d-a18c-9b1ea05b76ba">

<img width="623" alt="Screen Shot 2023-07-05 at 5 50 05 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/0752606f-0b45-401e-b8f9-1660f6fe3223">

<img width="377" alt="Screen Shot 2023-07-05 at 5 50 19 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/0acf8b4f-7d5a-40d8-8099-b410a5170daa">

## More Mandelbrot

I’m starting to wonder if there will always be new structures to discover in this shape. It’s really
not a conventional fractal.

<img width="300" alt="Screen Shot 2023-07-05 at 5 50 50 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/f77134f2-0a1f-4416-8cc4-f5d9843fec10">


<img width="562" alt="Screen Shot 2023-07-05 at 5 51 01 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/480067e9-6fa8-4a0d-bfb4-29814107d064">


<img width="614" alt="Screen Shot 2023-07-05 at 5 51 12 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/5378c88d-809e-4651-bc4d-644123dc6c3e">


<img width="610" alt="Screen Shot 2023-07-05 at 5 51 23 PM" src="https://github.com/johnbloch/Mandelbrot/assets/8367698/dc1b7c30-c856-45e4-8cc8-a9f23671cdbb">

