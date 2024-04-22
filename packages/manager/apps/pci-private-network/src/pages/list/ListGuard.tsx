import { Navigate } from 'react-router-dom';
import {
  useAggregatedLocalNetworks,
  useAggregatedNonLocalNetworks,
} from '@/api/hooks/useNetwork';
import { useProjectRegions } from '@/api/hooks/useRegions';

export default function ListGuard({
  projectId,
  children,
}: {
  projectId: string;
  children: JSX.Element;
}): JSX.Element {
  const { data: regions } = useProjectRegions(projectId);

  const {
    data: nonLocalNetworks,
    isPending: nonLocalNetworksPending,
  } = useAggregatedNonLocalNetworks(projectId, regions);

  const {
    data: localNetworks,
    isPending: localNetworksPending,
  } = useAggregatedLocalNetworks(projectId, regions);

  if (localNetworksPending || nonLocalNetworksPending) {
    return null;
  }

  return localNetworks?.length > 0 || nonLocalNetworks?.length > 0 ? (
    <>{children}</>
  ) : (
    <Navigate to={`/pci/projects/${projectId}/private-networks/onboarding`} />
  );
}
