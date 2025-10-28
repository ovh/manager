import { createContext } from 'react';

export type PreloaderContextType = {
  setIframe: (iframe: HTMLIFrameElement | null) => void;
  show: boolean;
};

const PreloaderContext = createContext<PreloaderContextType | null>(null);

export default PreloaderContext;
