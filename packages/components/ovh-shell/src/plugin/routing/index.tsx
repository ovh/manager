import React from 'react';
import Router, { hashChangeEvent } from './router';

export function initRouting(iframe: HTMLIFrameElement) {
  const router = <Router iframe={iframe} />;
  return {
    router,
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
  };
}

export default { initRouting };
