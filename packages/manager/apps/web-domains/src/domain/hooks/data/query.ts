import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  OvhSubsidiary,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  getDomainAnycastOption,
  getDomainResource,
  updateDomainResource,
} from '@/domain/data/api/domainResources';
import { TDomainOption, TDomainResource } from '@/domain/types/domainResource';
import {
  activateServiceDnssec,
  deactivateServiceDnssec,
  getDomainZone,
  getServiceDnssec,
} from '@/domain/data/api/domainZone';
import { TDomainZone } from '@/domain/types/domainZone';
import { order } from '@/domain/types/orderCatalog';
import { getOrderCatalog } from '@/domain/data/api/order';
import {
  getServiceInformation,
  updateServiceOption,
} from '@/common/data/api/common.api';
import { ServiceInfoUpdateEnum } from '@/common/enum/common.enum';
import { TServiceInfo } from '@/common/types/common.types';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';

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
          action: restore
            ? t('domain_action_restore')
            : t('domain_action_terminate'),
        }),
      );
    },
    onError: (error: Error) => {
      addError(t('domain_dns_tab_terminate_anycast_error', { error }));
    },
  });

  return {
    terminateAnycast: mutate,
    isTerminateAnycastPending: isPending,
  };
};

export const useGetServiceInformation = (
  serviceName: string,
  serviceRoute: ServiceRoutes,
) => {
  const { data, isLoading } = useQuery({
    queryKey: ['domain', 'service', serviceName],
    queryFn: () => getServiceInformation(serviceName, serviceRoute),
  });

  return {
    serviceInfo: data,
    isServiceInfoLoading: isLoading,
  };
};
export const useUpdateDomainResource = (serviceName: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      checksum,
      nameServers,
    }: {
      checksum: string;
      nameServers: {
        nameServer: string;
        ipv4?: string;
        ipv6?: string;
      }[];
    }) =>
      updateDomainResource(serviceName, {
        checksum,
        targetSpec: {
          dnsConfiguration: {
            nameServers,
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['domain', 'resource', serviceName],
      });
    },
    onError: () => {},
  });

  return {
    updateDomain: mutate,
    isUpdateDomainPending: isPending,
  };
};

export const useGetDnssecStatus = (serviceName: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['domain', 'zone', 'dnssec', serviceName],
    queryFn: () => getServiceDnssec(serviceName),
    retry: false,
  });

  return {
    dnssecStatus: data,
    isDnssecStatusLoading: isLoading,
  };
};

export const useUpdateDnssecService = (
  serviceName: string,
  action: DnssecStatusEnum,
) => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation(['domain', 'web-domains/error']);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (action === DnssecStatusEnum.ENABLED) {
        return activateServiceDnssec(serviceName);
      }

      return deactivateServiceDnssec(serviceName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['domain', 'zone', 'dnssec', serviceName],
      });
      addSuccess(t('domain_tab_general_information_dnssec_result'));
    },
    onError: (error: Error) => {
      addError(
        t('domain_tab_general_information_dnssec_error', {
          error: error.message,
        }),
      );
    },
  });

  return {
    updateServiceDnssec: mutate,
    isUpdateIsPending: isPending,
  };
};
