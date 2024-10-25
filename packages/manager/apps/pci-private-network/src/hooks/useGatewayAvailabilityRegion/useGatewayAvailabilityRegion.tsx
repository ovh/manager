import { useMemo } from 'react';
import { useProject, useProductAvailability } from '@ovh-ux/manager-pci-common';

export default function useGatewayAvailabilityRegion(
  region: string,
  planCode: string,
): boolean {
  const { data: project } = useProject();
  const { data } = useProductAvailability(project.project_id, {
    planCode,
  });

  return useMemo(() => {
    const gateway = data?.plans.find(({ code }) => code === planCode);

    if (gateway) {
      return gateway.regions.some(({ name }) => name === region);
    }

    return false;
  }, [data, region]);
}
