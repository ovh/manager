import { Navigate } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useAllAggregatedGateway } from '@/api/hooks/useGateway';

export default function ListGuard({
  projectId,
  children,
}: {
  projectId: string;
  children: JSX.Element;
}): JSX.Element {
  const {
    data: aggregatedGateways,
    isPending,
    isFetching,
  } = useAllAggregatedGateway(projectId);

  if (isPending || isFetching) {
    return (
      <OsdsSpinner
        inline
        size={ODS_SPINNER_SIZE.md}
        data-testid="listGuard-spinner"
      />
    );
  }

  return aggregatedGateways?.length > 0 ? (
    <>{children}</>
  ) : (
    <Navigate to={`/pci/projects/${projectId}/gateway/onboarding`} />
  );
}
