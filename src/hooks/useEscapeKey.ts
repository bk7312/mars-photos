'use client';
import React from 'react';

function useEscapeKey(callback: (e: KeyboardEvent) => void) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback(e);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [callback]);
}

export default useEscapeKey;
