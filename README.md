# Mars Photos App

## Overview

An app that shows the photos taken by NASA's Mars rover using the [Mars Photo API](https://github.com/corincerami/mars-photo-api). Idea from [chingu's solo project](https://github.com/chingu-voyages/soloproject-tier3-mars-photos)

Live version: https://mars-photos-five.vercel.app/

## Features

- Users can select a rover to see the available sol (Mars solar day) and camera options.
- Users can select a sol number on a dropdown which also shows the corresponding Earth date.
- Users can select a camera to view the pictures from, or choose all cameras.
- Users can click 'Get Photos' to fetch a list of photos for the respective rover, sol, and camera.
- Users can choose the number of photos to display per page and navigate between pages.
- Users can click on any photo to view in fullscreen mode, clicking on the photo again or pressing the 'Esc' key to exit fullscreen mode.

### Todo

- [ ] Improve UI/color scheme and responsive layout
- [ ] Currently images are assumed to be square, to handle images of different aspect ratios (opportunity sol 1, horizontal and vertical image)
- [ ] Currently using route handlers (serverless), need a db to handle user login and saving/favorite images (to consider)

_Structure_

- [x] Header containing the application title
- [x] Search panel containing with subcomponents which allow the user to select the Sol and Camera defining the group of photos to be displayed
- [x] The search panel **must** contain a search button the user clicks to
      display the photos
- [x] Main section where the photos matching the search criteria will be displayed
- [x] Footer section with your developer information

_Style_

- [x] You may choose your own style for this app, but make sure your style choices follow UI/UX best practices and are consistent throughout the app.
- [ ] Make your design fully responsive (small/large/portrait/landscape, etc.)

_Functionality_

- [x] A web frontend that accepts and validates search requests, obtains results through an API implemented in the application backend, and displays them to the user.
- [x] An application backend that implements an API with a single endpoint responsible for implementing the photo search by using the [Mars Rover Photos API](https://api.nasa.gov/api.html#SSC).
- [x] Search for photos taken by the Curiosity rover based on the mission Sol (the mission day) and the rover camera that took the photo.
- [x] When searching both the Sol and Camera must be specified by the user.
- [x] Results are displayed when the user clicks the 'Find Photos' button.
- [x] Developers may implement any style they wish.
- [x] The search feature should be fully functional and display matching photos

_Other_

- [x] Your repo needs to have a robust README.md
- [ ] Make sure that there are no errors in the developer console before submitting
- [x] Your API key **should not** be exposed in your frontend application orin your public GitHub repo. Note that there are ways to protect application secrets without exposing them to the public.
- [x] Handle edge cases like page loading and error messages from the API, not allowing API calls when query is empty, putting a timeout on a API call and providing user feedback if it expires, and ensuring that user input is valid.

**Extras (Not Required)**

- [ ] Implement a reset button to clear the search criteria and photo display area
- [ ] Implement the light/dark mode toggle buttons
- [ ] Implement the change display icon so you can flip between a grid layout and a list layout for the photos
- [ ] User creation and authentication: Add a login button to the page allowing registered users to login, or prompts new users to register. Once a user is authenticated, display that they are logged in in the heading.
- [ ] Add a favorites feature with back-end persistence: one example of this would be to use cookies to point to the user's favorite list in your database. You'll need to add a "see favorites" button somewhere to toggle between the view of the user's favorite photos and the searches that retrieved them.

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
