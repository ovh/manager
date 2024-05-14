import { Navigate } from 'react-router-dom';
import { useAllAggregatedGateway } from '@/api/hooks/useGateway';

export default function ListGuard({
  projectId,
  children,
}: {
  projectId: string;
  children: JSX.Element;
}): JSX.Element {
  const { data: aggregatedGateways, isPending } = useAllAggregatedGateway(
    projectId,
  );

  if (isPending) {
    return null;
  }

  return aggregatedGateways?.length > 0 ? (
    <>{children}</>
  ) : (
    <Navigate to={`/pci/projects/${projectId}/gateway/onboarding`} />
  );
}
