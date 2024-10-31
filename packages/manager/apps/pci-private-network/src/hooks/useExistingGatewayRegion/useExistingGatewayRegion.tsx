import { useMemo } from 'react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { TGateway } from '@/types/gateway.type';
import { useGatewayByRegion } from '@/data/hooks/gateway/useGateway';

type UseExistingGatewayRegion = {
  gateway: TGateway | undefined;
  isLoading: boolean;
};

export default function useExistingGatewayRegion(
  region: string,
): UseExistingGatewayRegion {
  const { data: project } = useProject();
  const { data: gateways, isLoading } = useGatewayByRegion(
    project.project_id,
    region,
  );

  return useMemo(() => {
    const existingGateway = gateways?.find(
      ({ externalInformation }) => externalInformation,
    );

    return { gateway: existingGateway ?? gateways?.[0], isLoading };
  }, [gateways, region]);
}
