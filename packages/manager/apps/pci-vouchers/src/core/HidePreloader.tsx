import { useUX } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';

export default function HidePreloader() {
  const ux = useUX();

  useEffect(() => {
    ux.hidePreloader();
  }, []);

  return null;
}
