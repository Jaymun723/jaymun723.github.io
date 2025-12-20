---
title: How this blog has been built
date: "2025-12-20T18:00:00"
description: "The story of how I built this blog using tools like GatsbyJS and most importantly Gemini."
tags: ["gatsbyjs", "gemini", "vibe coding"]
featuredImage: ./preview.png
---

Throught my relentless scrolling of social medias I have heard of vibe codders. As I consider myself a coder I wanted to see if I could become also a vibe codder.

Previoulsy I used _Claude Code_ in a 24h hackathon to quickly prototype a simple project. I was impressed by its power but since then I always worked on code where llms struggle to produce accurate code.

Everything changed when I got a free one year trial of Gemini Pro, I wanted to test how llms evolved since then and I thought that creating a blog was a great way of using this tool. Thus here we are !

# The building with Gemini

My first attemp was to prompt to build a blog that read markdown files and produce a clean website using javascript. Gemini chose [next.js](https://nextjs.org) but nothing worked and Gemini just kept messing with `npm`.

> One `rm -rf` later

Off the bad start, I cleanned everything and reprompted him to use [gatsby.js](https://www.gatsbyjs.com/) and specified to use the starter blog template, and ... it worked !

I then incremently added features to obtain this website ! It was pretty pleasant to just prompt Gemini and the real time changes happens !

# Why Gatsby.js ?

It was a long time since I did not code website thus I used a tool that I used long ago, but it seems it was no longer really active. Nonetheless it works great !

I was able to add supports for code blocks, equations, images and even have a comment section using [cusdis](https://cusdis.com/) !

# Aftertoughts & Conclusion

Building with Gemini was fun but also a bit creepy because now I have no idea of what part of the code does what.

Also javascript framework fatigue is real. I start doing physics (thus stop javascript) for 2 to 3 years and your favorite framework is now considered old !