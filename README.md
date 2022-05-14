# Cam Jam

# Description

Jam with your friends with just a cam! Using AI, ML and webcams CamJam allows you and your friends to jam together over the internet with no instruments at all.

You can share a room link with up to 4 people and then you all can join, select an instrument and create music together. 

# Inspiration

The idea for this project took me the longest. I went through a lot of ideas before coming this. After working with music for so long, I was hesitant to work on music again and I decided to veer towards art more. I looked into making 3D art using three.js but then I wanted it to be generative (based on the user's actions). I started looking into ML5.js and after some time I came across <a href="https://youtu.be/yRE7N-njtnA"> this video </a> with 400 or something views on YouTube.

<img src="https://i.imgur.com/ivLQRip.png">

After coming across this video, I realized it was time for me to come back to music. I wanted to explore this concept of playing instruments using webcam more and hence I wanted to look into all 4 instruments in a band - piano, drums, guitar and bass. 

# Concept

I usually start sketching out UI and experimenting on Figma but I realized the conceptual problems here didn't lie in the UI exactly, they lied in how do you play instruments like these over the webcam. This involved a lot of user testing after getting the initial <a href="https://ml5js.org/"> ml5.js </a> models going. 

## Piano 

I initally planned on splitting the screen into parts and bringing your hand down to play notes. Adina while testing out that model started bringing her fingers down to play the piano and that's where I found the idea. 

<img src="https://github.com/AakSin/aaksin-public/blob/main/camjam/b65f157f0372bc4f5f68f41e459935d2.gif">

## Drums

I looked into various versions of the drums. The first was mapping it to the hands like the guy whose video I have linked. Then I wanted to split it into 4 corners. I then came onto the final version which involves people bringing their hands down in certain sections of screen. 

<img src="https://github.com/AakSin/aaksin-public/blob/main/camjam/drums.gif">

## Guitar

Guitar was the hardest. It has gone through so many versions. The initial was simply just copying the piano. Then my friend suggested to add head-nodding to it. I tested the head nodding and a lot of people found it to be unintuitive or not enjoyable to do. I then let a couple of people in the IM lab try it out and I realized a lot of people were doing a strumming animation i.e. bringing their hands from up to down. That's where the current version came from. 

<img src="https://github.com/AakSin/aaksin-public/blob/main/camjam/guitar.gif">

## Bass

The bass was the simplest. I liked the idea of slapping a bass. Hence, I implemented a simple slapping mechaninc for the bass. 

<img src="https://github.com/AakSin/aaksin-public/blob/main/camjam/bass.gif">

## Layout

I was very confused about how I wanted to lay out the webcam, options etc. I did some sketches on Figma and on my I-Pad. I planned on adding some visualizers too as I thought the project looked a bit bare bones at the moment.

<img src="https://i.imgur.com/BFwXHVK.png">

Then my professor recommended trying out a DVD screensvaer kind of layout where the DVD logo bounces around. I implemented that and did some user testing. Poeple found it very hard to play the instruments on some thing that constantly kept moving. 

<img src="https://github.com/AakSin/aaksin-public/blob/main/camjam/bouncing.gif">

I finally settled on a clean simple 4 person layout

<img src="https://github.com/AakSin/aaksin-public/blob/main/camjam/4view.gif">

## Coding/Implementation

## ML5.js

### Piano

The piano works on <a href="https://learn.ml5js.org/#/reference/handpose"> handpose </a>. Handpose basically gives you the co-ordinate of each major bone on your fingers. I used that to check if the top most bone was below the middle one (i.e. finger being bent), if it was then play the note mapped to that finger

https://github.com/AakSin/connectionsLab/blob/e6d40cbe8dc11d9b34b99be526b3db670511c0de/finalProject/camJam/public/jamground/classes/pianistCam.js#L53-L97

### Drums

The drums works by dividing the screen into 4 parts. Then whenever the y-axis of either of the wrists crosses a certain threshold (100 pixels) the playSound function is passed in the x-coordinate of the ending position of the wrist. This x-coordinate is checked where it lies in the 4 divisions of the screen and that sound is played. 

https://github.com/AakSin/connectionsLab/blob/e6d40cbe8dc11d9b34b99be526b3db670511c0de/finalProject/camJam/public/jamground/classes/drummerCam.js#L40-L70

### Guitar

The guitar combines elements of both piano and drums. The left hand runs handpose and keeps track of which fingers are down. When it detects that the y-coordinate of the right wrist has crossed a certain threshold, the strum event is triggered, hence playing the chords for whom the finger is down.

https://github.com/AakSin/connectionsLab/blob/e6d40cbe8dc11d9b34b99be526b3db670511c0de/finalProject/camJam/public/jamground/classes/guitaristCam.js#L46-L72

### Bass

The bass basically involves rotating the drum setup by 90 degrees. If the x-coordinate of either of the hands crosses a certain threshold, then the play event is triggered for whichever y-coordinate the hand finishes on.

https://github.com/AakSin/connectionsLab/blob/e6d40cbe8dc11d9b34b99be526b3db670511c0de/finalProject/camJam/public/jamground/classes/bassistCam.js#L40-L70


## Sockets/P5LM

I edited the p5lm file made by NYU's ITP and hijacked their socket connection to send in my data as well. This is because the p5lm code opens it's own socket connection and hence my socket connection wasn't working (expanded more in challenges). I use p5lm's getData method to do real time data communication between the clients, and depending on the information received that note is played. 

https://github.com/AakSin/connectionsLab/blob/07ea8a5112b5c91a4a85fa0d50ac2eddecc7c2af/finalProject/camJam/public/jamground/index.js#L268-L338

# Challenges

## Two socket connections 

The first major tech hiccup I had in this project was finding out that p5 live media opened up it's own socket connection. So my socket connection couldn't co-exist with it unless I forced it. I didn't want to force it for stability reasons as well I wanted to learn how p5 live media worked and editing it's internal code seemed like an interesting challenge. This was a complicated challenge that involved - 

- Downloading p5lm's code and editing it for my purpose
https://github.com/AakSin/connectionsLab/blob/07ea8a5112b5c91a4a85fa0d50ac2eddecc7c2af/finalProject/camJam/public/jamground/p5livemedia.js#L111

- Passing down the p5lm to all my instrument classes as soon as this object would be initiliazed 
https://github.com/AakSin/connectionsLab/blob/07ea8a5112b5c91a4a85fa0d50ac2eddecc7c2af/finalProject/camJam/public/jamground/index.js#L206-L213

- Figuring out how to use it's socket's methods from inside of my p5 file as well because I couldn't edit the p5lm file all the time
https://github.com/AakSin/connectionsLab/blob/07ea8a5112b5c91a4a85fa0d50ac2eddecc7c2af/finalProject/camJam/public/jamground/index.js#L143-L162

## Program slowing down upon switching between instruments too much

The program's frame rate would drop significantly when I switched between instruments too much. I did two things for this -

- Upon the first time a new instrument class is initiliazed I decided to store it in a variable so the next time it is called we just assign this old object and there is no need to train the model again

https://github.com/AakSin/connectionsLab/blob/07ea8a5112b5c91a4a85fa0d50ac2eddecc7c2af/finalProject/camJam/public/jamground/index.js#L27-L69

- The professor recommended I switch away from frame count for deciding between when to play the next sound (my initial code worked like this) to using millis(timestamps).  This is because millis would work the same even when the frame rate of the program slowed down.

https://github.com/AakSin/connectionsLab/blob/07ea8a5112b5c91a4a85fa0d50ac2eddecc7c2af/finalProject/camJam/public/jamground/classes/pianistCam.js#L33-L37


# Future Steps

- The UI needs some work as suggested by the judges. I need to figure out a better way to explain how to play the instruments because even now with the instructions written out, people chose to ignore it and try going with the intuition. On this note, the instruments can be worked on to be more intuitive as well as reading instructions is fun for no one.
- The drums are a bit clunky right now because if you bring your hand down from high up enough you will cross the threshold twice hence playing the drum twice. A friend recommended that depending on what distance you cross, play the drum that loud. So if you bring your hand down from a great distance make it louder. 
- Similarly for the piano, upon holding the finger down the note is just repeated. The same friend suggested that upon holding the finger, the note should become longer in duration.
- The guitar even after all this work is still a bit non-intuitive. I will try figuring out the most intuitive way to play guitar over a webcame
- Add more sound modes so people can play jazz, metal or whatever genre they like
- Add a music visualizer to use some whitespace
- Add a virtual band that responds to facial expressions since I am already running ml5.js and accessing people's web cam. <a href="https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html"> Example </a>
- Use AI/ML like <a href="https://magenta.tensorflow.org/js-announce"> magenta.js </a> to make better music with AI/ML

# Credits

Thank you to Joanna for recording the guitar

Thank you to Saiki for recording the lead piano and bass

Thank you to Hugo for helping me out with the music theory

Thank you to Pauline and Sophie for bearing with me while I made them try out the product

Thank you to everyone who user-tested this
