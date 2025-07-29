import { useEffect, useState } from 'react';
import { useApplications } from '@/data/hooks/useApplications';

export const useLegacySignupRedirection = () => {
  const [enabled, setEnabled] = useState(false);
  const { data: applications } = useApplications(enabled);

  useEffect(() => {
    if (applications?.['sign-up']) {
      window.location.assign(applications['sign-up'].url);
    }
  }, [applications]);

  return () => {
    setEnabled(true);
  };
};
