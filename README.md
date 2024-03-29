# Mars Photos App

## Overview

An app that shows the photos taken by NASA's Mars rover using the [Mars Photo API](https://github.com/corincerami/mars-photo-api).

Live version: https://mars-photos-five.vercel.app/

## Features

- Users can select a rover to see the available sol (Mars solar day) and camera options.
- Users can select a sol number on a dropdown which also shows the corresponding Earth date.
- Users can select a camera to view the pictures from, or choose all cameras.
- Users can click 'Get Photos' to fetch a list of photos for the respective rover, sol, and camera.
- Users can choose the number of photos to display per page and navigate between pages using the left/right arrow keys.
- Users can click on any photo to view in fullscreen mode, clicking on the photo again or pressing the 'Esc' key to exit fullscreen mode.
- Users can click the question mark icon to get a help message.
- Users can login using Google/Github and save/favorite the photos they like.
- Users can add their own notes to their saved/favorited photos.

TODO - Add screenshots for illustration?

## How to run locally

To run locally:

1. Fork or clone the repo
2. Copy and rename `.env.example` to `.env`
3. Run `npm i` to install the required packages
4. Run `npm run dev` to run the development server
5. Open `localhost:3000` in your browser

To use your own API key, change `NASA_API_KEY` in `.env` to your own. API keys can be obtained from https://api.nasa.gov/index.html

## How to contribute

If you would like to contribute to this project, feel free to:

1. Raise an issue - Let me know if there's any bugs or feature request and I'll see what I can do.
2. Create a pull request - If you want to get your hands dirty and fix some bugs or add a few features yourself, feel free to fork this repo and create a PR.
