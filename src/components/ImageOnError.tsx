// import React from 'react';
// import fallback from '/img-not-found.png';
// import Image from 'next/image';

// type ImageOnErrorType = {
//   src: string;
//   alt: string;
//   sizes: string;
//   errorImageUrl: string;
//   className?: string;
//   [key: string]: any;
// };

// export default function ImageOnError({
//   src,
//   alt,
//   sizes,
//   errorImageUrl,
//   className = '',
//   ...delegated
// }: ImageOnErrorType) {
//   const [source, setSource] = React.useState<string>(src);

//   return (
//     <Image
//       {...delegated}
//       src={source}
//       alt={alt}
//       title={alt}
//       onError={() => setSource(fallback)}
//       className={className}
//     />
//   );
// }
