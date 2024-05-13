import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllFailoverIPs } from '@/api/hooks/useFailoverIP';
import { useAllFloatingIP } from '@/api/hooks/useFloatingIP';

export default function ListGuard({
  projectId,
  children,
}: {
  projectId: string;
  children: JSX.Element;
}): JSX.Element {
  const navigate = useNavigate();
  const [view, setView] = useState<JSX.Element>(null);

  const {
    data: failoverIPs,
    isLoading: isFailoverIPsLoading,
  } = useAllFailoverIPs(projectId);

  const {
    data: floatingIPs,
    isLoading: isFloatingIPsLoading,
  } = useAllFloatingIP(projectId);

  useEffect(() => {
    if (!isFailoverIPsLoading && !isFloatingIPsLoading) {
      if (failoverIPs?.length > 0 || floatingIPs?.length > 0) {
        setView(children);
      } else {
        navigate(`/pci/projects/${projectId}/public-ips/onboarding`);
      }
    }
  }, [
    navigate,
    failoverIPs,
    floatingIPs,
    isFailoverIPsLoading,
    isFloatingIPsLoading,
  ]);

  return view;
}
