import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getCatalog } from '../data/catalog';

export const getCatalogQuery = ({
  ovhSubsidiary,
  productName,
}: {
  ovhSubsidiary: string;
  productName?: string;
}) => ({
  queryKey: ['catalog', productName],
  queryFn: () => getCatalog(ovhSubsidiary, productName),
});

export const useCatalog = (productName?: string) => {
  const { me } = useMe();
  return useQuery({
    ...getCatalogQuery({
      ovhSubsidiary: me?.ovhSubsidiary,
      productName,
    }),
    enabled: !!me,
  });
};
