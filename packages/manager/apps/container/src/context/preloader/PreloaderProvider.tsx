import { useEffect, useState } from 'react';
import PreloaderContext from '@/context/preloader/preloader.context';
import Preloader from '@/components/Preloader/Preloader';
import { Shell } from '@ovh-ux/shell';

type Props = {
  children: JSX.Element | JSX.Element[];
  shell?: Shell | null;
};

export const PreloaderProvider = ({ shell, children = null }: Props): JSX.Element => {
  const [uxPlugin, setUxPlugin] = useState(null);
  const [show, setShow] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [iframe, setIframe] = useState(null);

  useEffect(() => {
    setUxPlugin(shell?.getPlugin('ux'));
  }, [shell]);

  useEffect(() => {
    if (uxPlugin && !isInitialized) {
      uxPlugin?.onProgressStart(() => {
        setShow(true);
      });
      uxPlugin?.onProgressStop(() => {
        setShow(false);
      });
      setIsInitialized(true);
    }
  }, [uxPlugin, isInitialized]);

  useEffect(() => {
    if (iframe) {
      const showPreloader = () => {
        shell?.getPlugin('ux').showPreloader();
      };
      iframe.addEventListener('load', showPreloader);
      return () => iframe?.removeEventListener('load', showPreloader);
    }
    return () => {};
  }, [iframe]);

  const context = {
    setIframe,
    show,
  };

  return (
    <PreloaderContext.Provider value={context}>
      {show && <Preloader />}
      {children}
    </PreloaderContext.Provider>
  );
};

export default PreloaderProvider;
