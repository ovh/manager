import { useEffect, useState } from 'react';
import PreloaderContext from '@/context/preloader/preloader.context';
import Preloader from '@/components/Preloader/Preloader';
import { Shell } from '@ovh-ux/shell';

type Props = {
  children: JSX.Element | JSX.Element[];
  shell?: Shell | null;
};

export const PreloaderProvider = ({ shell, children = null }: Props): JSX.Element => {
  const uxPlugin = shell.getPlugin('ux');
  const [show, setShow] = useState(true);
  const [iframe, setIframe] = useState(null);

  useEffect(() => {
    uxPlugin.onProgressStart(() => {
      setShow(true);
    });
    uxPlugin.onProgressStop(() => {
      setShow(false);
    });
  }, []);

  useEffect(() => {
    if (iframe) {
      const showPreloader = () => {
        uxPlugin.showPreloader();
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
