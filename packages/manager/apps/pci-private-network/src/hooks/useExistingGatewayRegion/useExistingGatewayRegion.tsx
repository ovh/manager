import { useMemo } from 'react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { TGateway } from '@/types/gateway.type';
import { useGatewaysByRegion } from '@/data/hooks/gateway/useGateway';

type UseExistingGatewayRegion = {
  gateway: TGateway | undefined;
  isLoading: boolean;
};

export default function useExistingGatewayRegion(
  region: string,
): UseExistingGatewayRegion {
  const { data: project } = useProject();
  const { data: gateways, isLoading } = useGatewaysByRegion(
    project.project_id,
    region,
  );

  const gateway = useMemo(() => {
    const existingGateway = gateways?.find(
      ({ externalInformation }) => externalInformation,
    );

    return existingGateway ?? gateways?.[0];
  }, [gateways]);

  return {
    gateway,
    isLoading,
  };
}
