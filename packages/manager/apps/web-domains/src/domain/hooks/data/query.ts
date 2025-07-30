import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  OvhSubsidiary,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  getDomainAnycastOption,
  getDomainResource,
} from '@/domain/data/api/domainResources';
import { TDomainOption, TDomainResource } from '@/domain/types/domainResource';
import { getDomainZone } from '@/domain/data/api/domainZone';
import { TDomainZone } from '@/domain/types/domainZone';
import { order } from '@/domain/types/orderCatalog';
import { getOrderCatalog } from '@/domain/data/api/order';
import { updateServiceOption } from '@/common/data/api/common.api';
import { ServiceInfoUpdateEnum } from '@/common/enum/common.enum';
import { TServiceInfo } from '@/common/types/common.types';

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

export const useGetDnsOption = (serviceName: string) => {
  const { data, isLoading, error } = useQuery<TDomainOption>({
    queryKey: ['option', 'anycast', serviceName],
    queryFn: () => getDomainAnycastOption(serviceName),
    retry: false,
  });

  return {
    dnsOption: data,
    isFetchingDnsOption: isLoading,
    dnsOptionError: error,
  };
};

export const useGetDomainAnycastOption = (serviceName: string) => {
  const { data, isLoading, error } = useQuery<TDomainOption>({
    queryKey: ['option', 'dns', serviceName],
    queryFn: () => getDomainAnycastOption(serviceName),
    retry: false,
  });

  return {
    anycastOption: data,
    isFetchingAnycastOption: isLoading,
    anycastOptionError: error,
  };
};

export const useTerminateAnycastMutation = (
  serviceName: string,
  restore: boolean,
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const { addSuccess, addError } = useNotifications();
  const updateInfo = restore
    ? ServiceInfoUpdateEnum.Empty
    : ServiceInfoUpdateEnum.TerminateAtExpirationDate;
  const { mutate, isPending } = useMutation<TServiceInfo>({
    mutationFn: () =>
      updateServiceOption(serviceName, updateInfo, 'anycast', '/domain/zone'),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['option', 'dns', serviceName],
      });
      addSuccess(
        t('domain_dns_tab_terminate_anycast_success', {
          action: restore ? t('domain_action_restore') : t('domain_action_terminate'),
        }),
      );
    },
    onError: (error) => {
      addError(t('domain_dns_tab_terminate_anycast_error', { error }));
    },
  });

  return {
    terminateAnycast: mutate,
    isTerminateAnycastPending: isPending,
  };
};
