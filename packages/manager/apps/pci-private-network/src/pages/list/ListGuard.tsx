import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [displayChildren, setDisplayChildren] = useState(false);

  const navigate = useNavigate();

  const { data: regions } = useProjectRegions(projectId);

  const {
    data: nonLocalNetworks,
    isPending: nonLocalNetworksPending,
  } = useAggregatedNonLocalNetworks(projectId, regions);

  const {
    data: localNetworks,
    isPending: localNetworksPending,
  } = useAggregatedLocalNetworks(projectId, regions);

  useEffect(() => {
    if (!localNetworksPending && !nonLocalNetworksPending) {
      if (localNetworks?.length > 0 || nonLocalNetworks?.length > 0) {
        setDisplayChildren(true);
      } else {
        navigate(`/pci/projects/${projectId}/private-networks/onboarding`);
      }
    }
  }, [
    localNetworksPending,
    nonLocalNetworksPending,
    localNetworks,
    nonLocalNetworks,
    navigate,
  ]);

  return displayChildren ? children : null;
}
