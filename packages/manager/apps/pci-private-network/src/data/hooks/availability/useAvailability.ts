import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductAvailability } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type TGetProductAvailability = {
  addonFamily?: string;
  planCode?: string;
  planFamily?: string;
  product?: string;
};

export const useProductAvailability = (
  projectId: string,
  params: TGetProductAvailability,
) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return useQuery({
    queryKey: ['project', projectId, 'availability', ovhSubsidiary],
    queryFn: async () => {
      const availability = await getProductAvailability(projectId, {
        ovhSubsidiary,
        ...params,
      });

      return availability?.plans;
    },
  });
};
