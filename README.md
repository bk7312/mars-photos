# Mars Photos App

Project brief: https://github.com/chingu-voyages/soloproject-tier3-mars-photos

Mars Photo API: https://github.com/corincerami/mars-photo-api

User workflow:

- User selects a rover
- App will show loading state while fetching manifest
- If error fetching manifest, show error.
- If no errors, app will update the sol min/max based on manifest

- User selects a sol number
- App will check the manifest and update the available camera options
- User selects a camera and clicks the get photos button
- App will show loading state while fetching photos
- If error fetching photos, show error
- If no errors, display the photo results component

- App will show placeholder image or loading state while fetching the individual images
- If error fetching image, show placeholder error image with retry or report button?
- If no errors, display image

- User clicks on image
- App will show image on fullscreen (currently done by refetch the same image to show a new Image component on fullscreen, to optimize by enlarging the current Image component?), clicking anywhere or pressing escape will exit fullscreen
- User clicks on next page or update the photos per page, app will update the layout and fetch the new images

Todo:

- Choose a color scheme, currently slate
- Design a responsive layout
- Handle fail to fetch manifest and photos error

- Optimize fullscreen by eliminating need to refetch image
- Currently images are assumed to be square, to handle images of different aspect ratios

- Currently using route handlers (serverless), to use a BaaS to cache frequently requested manifest/photos data in BE? BE would be required to handle user login and saving/favorite images (to consider)

Note:

- Perseverance LCAM (Lander Vision System Camera) on sol 0 not available from upstream api
