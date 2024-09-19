import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getCatalog } from '@ovh-ux/manager-pci-common';

export const useCatalog = () => {
  const { me } = useMe();
  return useQuery({
    queryKey: ['catalog'],
    queryFn: () => getCatalog(me.ovhSubsidiary),
    enabled: !!me,
    throwOnError: true,
  });
};
