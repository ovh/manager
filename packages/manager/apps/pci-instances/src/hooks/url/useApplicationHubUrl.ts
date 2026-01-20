import { useContext, useState, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useApplicationHubUrl = () => {
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [applicationHubUrl, setApplicationHubUrl] = useState('');

  useEffect(() => {
    navigation
      .getURL('hub', '#/', {})
      .then((data) => setApplicationHubUrl(data as string));
  }, [navigation]);

  return applicationHubUrl;
};
