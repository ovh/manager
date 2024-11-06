import { useMe } from '@ovh-ux/manager-react-components';
import { useQuery } from '@tanstack/react-query';
import { getCatalogQuery } from '@/data/api/services';

export const useCatalog = () => {
  const { me } = useMe();
  console.info('entre dans le useCatalog !!');
  console.info('me : ', me);
  return useQuery({
    ...getCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
