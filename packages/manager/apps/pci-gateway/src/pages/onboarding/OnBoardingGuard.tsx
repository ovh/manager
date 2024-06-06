import { Navigate } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useAllAggregatedGateway } from '@/api/hooks/useGateway';

export default function OnBoardingGuard({
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
    return <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />;
  }

  return aggregatedGateways?.length > 0 ? (
    <Navigate to={`/pci/projects/${projectId}/gateway`} />
  ) : (
    <>{children}</>
  );
}
