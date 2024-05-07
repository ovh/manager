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

  const {
    data: failoverIPs,
    isLoading: isFailoverIPsLoading,
  } = useAllFailoverIPs(projectId);

  const {
    data: floatingIPs,
    isLoading: isFloatingIPsLoading,
  } = useAllFloatingIP(projectId);

  if (!isFailoverIPsLoading && !isFloatingIPsLoading) {
    if (failoverIPs?.length > 0 || floatingIPs?.length > 0) {
      return children;
    }
    navigate('../onboarding');
  }

  return null;
}
