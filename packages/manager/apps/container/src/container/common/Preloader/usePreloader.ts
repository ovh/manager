import { Shell } from '@ovh-ux/shell/types';
import { useEffect, useState } from 'react';

const usePreloader = (shell: Shell, defaultValue = false) => {
  const [visible, setVisible] = useState(defaultValue);

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

  return visible;
};

export default usePreloader;
