// 'use client';
// import React from 'react';

// function useFullscreen(init: boolean = false) {
//   const [fullscreen, setFullscreen] = React.useState<boolean>(init);

//   const exitFullscreen = React.useCallback(() => setFullscreen(false), []);

//   React.useEffect(() => {
//     function handleEsc(e: KeyboardEvent) {
//       if (e.code === 'Escape') {
//         exitFullscreen();
//       }
//     }
//     document.addEventListener('keydown', handleEsc);
//     return () => document.removeEventListener('keydown', handleEsc);
//   }, [exitFullscreen]);

//   return {
//     fullscreen,
//     exitFullscreen,
//   };
// }

// export default useFullscreen;
