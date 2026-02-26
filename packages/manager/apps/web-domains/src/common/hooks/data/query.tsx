import { useQuery } from '@tanstack/react-query';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { getServiceInformation } from '@/common/data/api/common.api';
import { getOrderCatalog } from '@/common/data/api/order';
import { order } from '@/common/types/orderCatalog';

export const useGetServiceInformation = (
  key: string,
  serviceName: string,
  serviceRoute: ServiceRoutes,
) => {
  const { data, isFetching } = useQuery({
    queryKey: [key, 'service', serviceName],
    queryFn: () => getServiceInformation(serviceName, serviceRoute),
  });

  return {
    serviceInfo: data,
    isServiceInfoLoading: isFetching,
  };
};

export const useGetOrderCatalogDns = (subsidiary: OvhSubsidiary) => {
  const { data, isLoading, error } = useQuery<order.publicOrder.Catalog>({
    queryKey: ['order', 'catalog', 'dns', subsidiary],
    queryFn: () =>
      getOrderCatalog({ ovhSubsidiary: subsidiary, productName: 'dns' }),
  });
  return {
    dnsCatalog: data,
    isFetchingDnsCatalog: isLoading,
    dnsCatalogError: error,
  };
};
