import { useQuery } from '@tanstack/react-query';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { getDomainResource } from '@/domain/data/api/domainResources';
import { TDomainResource } from '@/domain/types/domainResource';
import { getDomainZone } from '@/domain/data/api/domainZone';
import { TDomainZone } from '@/domain/types/domainZone';
import { order } from '@/domain/types/orderCatalog';
import { getOrderCatalog } from '@/domain/data/api/order';

export const useGetDomainResource = (serviceName: string) => {
  const { data, isLoading, error } = useQuery<TDomainResource>({
    queryKey: ['domain', 'resource', serviceName],
    queryFn: () => getDomainResource(serviceName),
  });
  return {
    domainResource: data,
    isFetchingDomainResource: isLoading,
    domainResourceError: error,
  };
};

export const useGetDomainZone = (serviceName: string) => {
  const { data, isLoading, error } = useQuery<TDomainZone>({
    queryKey: ['domain', 'zone', serviceName],
    queryFn: () => getDomainZone(serviceName),
    retry: false,
  });
  return {
    domainZone: data,
    isFetchingDomainZone: isLoading,
    domainZoneError: error,
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
