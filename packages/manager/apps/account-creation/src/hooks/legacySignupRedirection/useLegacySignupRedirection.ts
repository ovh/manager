import { useEffect, useState } from 'react';
import { useApplications } from '@/data/hooks/useApplications';

export const useLegacySignupRedirection = () => {
  const [enabled, setEnabled] = useState(false);
  const { data: applications } = useApplications({ enabled });

  useEffect(() => {
    if (enabled && applications?.['sign-up']) {
      window.location.assign(applications['sign-up'].url);
    }
  }, [applications, enabled]);

  return () => {
    setEnabled(true);
  };
};
