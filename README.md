# Mars Photos App

## Overview

An app that shows the photos taken by NASA's Mars rover using the [Mars Photo API](https://github.com/corincerami/mars-photo-api). Idea from [chingu's solo project](https://github.com/chingu-voyages/soloproject-tier3-mars-photos)

Live version: https://api.nasa.gov/index.html

## Features

- Users can select a rover to see the available sol (Mars solar day) and camera options.
- Users can select a sol number on a dropdown which also shows the corresponding Earth date.
- Users can select a camera to view the pictures from, or choose all cameras.
- Users can click 'Get Photos' to fetch a list of photos for the respective rover, sol, and camera.
- Users can choose the number of photos to display per page and navigate between pages.
- Users can click on any photo to view in fullscreen mode, clicking on the photo again or pressing the 'Esc' key to exit fullscreen mode.

### Todo

- [ ] Pick a better color scheme, currently slate
- [ ] Design a better responsive layout
- [ ] Optimize fullscreen by eliminating the need to refetch image?
- [ ] Currently images are assumed to be square, to handle images of different aspect ratios
- [ ] Currently using route handlers (serverless), need a db to handle user login and saving/favorite images (to consider)

Note:

- Perseverance LCAM (Lander Vision System Camera) on sol 0 not available from upstream api

## How to run locally

To run locally:

1. Fork or clone the repo
2. Copy and rename `.env.example` to `.env`
3. Run `npm i` to install the required packages
4. Run `npm run dev` to run the development server
5. Open `localhost:3000` in your browser

To use your own API key, change `NASA_API_KEY` in `.env` to your own. API keys can be obtained from https://api.nasa.gov/index.html

## How to contribute

Todo: Guide to raising issues/PR, CONTRIBUTING.md
Todo: Add license
