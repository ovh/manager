import { Shell } from '@ovh-ux/shell';
import { useEffect, useState } from 'react';

const usePreloader = (shell: Shell, iframe: HTMLIFrameElement) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onShowPreloader = () => {
      setVisible(true);
    };

    const onHidePreloader = () => {
      setVisible(false);
    };
    shell.getPlugin('ux').onShowPreloader(onShowPreloader);
    shell.getPlugin('ux').onHidePreloader(onHidePreloader);

    return () => {
      shell.getPlugin('ux').removeOnShowPreloader(onShowPreloader);
      shell.getPlugin('ux').removeOnHidePreloader(onHidePreloader);
    };
  }, [shell]);

  useEffect(() => {
    if (iframe) {
      const showPreloader = () => {
        shell.getPlugin('ux').showPreloader();
      };
      iframe.addEventListener('load', showPreloader);
      return () => iframe?.removeEventListener('load', showPreloader);
    }
    return () => {};
  }, [iframe]);

  return visible;
};

export default usePreloader;
