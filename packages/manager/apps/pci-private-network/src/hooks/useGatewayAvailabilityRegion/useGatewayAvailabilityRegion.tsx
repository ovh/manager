import { useMemo } from 'react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useProductAvailability } from '@/data/hooks/availability/useAvailability';

export default function useGatewayAvailabilityRegion(
  region: string,
  planCode: string,
): boolean {
  const { data: project } = useProject();
  const { data: gateways } = useProductAvailability(project.project_id, {
    planCode,
  });

  return useMemo(() => {
    const gateway = gateways?.find(({ code }) => code === planCode);

    if (gateway) {
      return gateway.regions.some(({ name }) => name === region);
    }

    return false;
  }, [gateways, region]);
}
