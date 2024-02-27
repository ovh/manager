import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useEffect, useState } from 'react';

export const useActivatePciProjectURL = (projectId: string) => {
  const navigation = useNavigation();

  const [activateProjectUrl, setActivateProjectUrl] = useState(null);
  useEffect(() => {
    const getActiveProjectUrl = async () => {
      const activateDiscoveryUrl = await navigation.getURL(
        'public-cloud',
        `#/pci/projects/${projectId}/activate`,
        {},
      );
      setActivateProjectUrl(activateDiscoveryUrl);
    };
    getActiveProjectUrl();
  }, []);

  return activateProjectUrl;
};
