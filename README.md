# Mars Photos App

Project brief: https://github.com/chingu-voyages/soloproject-tier3-mars-photos

Mars Photo API: https://github.com/corincerami/mars-photo-api

Usage flow to implement:

- User selects a rover
- App will fetch the rover manifest
- App will update the sol min/max based on manifest
- User selects a sol number
- App will check the rover manifest and update the available camera options
- User selects a camera
- App will fetch the photos and display results in paginated form
- User clicks on photo, photo will enlarge
- User clicks on next page, app will fetch next results of next page and display

Notes:

- Some days with no photos, i.e. spirit sol 0
- Some camera types not on mars api page, i.e. spirit sol 1 camera ENTRY
- Camera names not on manifest, only code, names on photo[i].camera.full_name
