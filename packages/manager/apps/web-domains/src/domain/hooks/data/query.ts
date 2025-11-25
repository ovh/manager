import {
  useMutation,
  useQuery,
  useQueryClient,
  useQueries,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  OvhSubsidiary,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { Subsidiary } from '@ovh-ux/manager-config';
import {
  getDomainAnycastOption,
  getDomainResource,
  updateDomainResource,
} from '@/domain/data/api/domainResources';
import {
  ServiceType,
  TDomainOption,
  TDomainResource,
} from '@/domain/types/domainResource';
import { getDomainZone, getServiceDnssec } from '@/domain/data/api/domainZone';
import { TDomainZone } from '@/domain/types/domainZone';
import { order } from '@/domain/types/orderCatalog';
import { getOrderCatalog } from '@/domain/data/api/order';
import {
  getDomainContact,
  getMXPlan,
  getZimbra,
  updateServiceOption,
} from '@/common/data/api/common.api';
import { ServiceInfoUpdateEnum } from '@/common/enum/common.enum';
import { TDomainContact, TServiceInfo } from '@/common/types/common.types';
import { AssociatedEmailsServicesEnum } from '@/domain/enum/associatedServices.enum';
import { emailOfferRedirect } from '@/domain/constants/susbcriptions';
import {
  getAssociatedHosting,
  getAssociatedSubDomainsMultiSite,
  getFreeHostingService,
  initialOrderFreeHosting,
  orderFreeHosting,
} from '@/domain/data/api/hosting';
import { FreeHostingOptions } from '@/domain/components/AssociatedServicesCards/Hosting';
import { THost } from '@/domain/types/host';

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

export const useUpdateDomainResource = (serviceName: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      checksum,
      nameServers,
      hosts,
    }: {
      checksum: string;
      nameServers: {
        nameServer: string;
        ipv4?: string;
        ipv6?: string;
      }[];
      hosts: THost[];
    }) =>
      updateDomainResource(serviceName, {
        checksum,
        targetSpec: {
          dnsConfiguration: {
            nameServers,
          },
          hostsConfiguration: {
            hosts,
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

export const useGetDomainContact = (
  contactID: string,
  options?: { enabled?: boolean },
) => {
  const { data, isFetching, error } = useQuery<TDomainContact>({
    queryKey: ['domain', 'contact', contactID],
    queryFn: () => getDomainContact(contactID),
    enabled: options?.enabled ?? false,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
  });
  return {
    domainContact: data,
    isFetchingDomainContact: isFetching,
    domainContactError: error,
  };
};

export function useEmailService(serviceName: string) {
  return useQuery<ServiceType>({
    queryKey: ['service-detection', serviceName],
    queryFn: async (): Promise<ServiceType> => {
      try {
        const zimbra = await getZimbra(serviceName);
        if (zimbra && zimbra.length > 0) {
          return {
            serviceDetected: AssociatedEmailsServicesEnum.ZIMBRA,
            data: zimbra[0].id,
          };
        }
      } catch (_) {
        // Zimbra not found try mxPlan
      }

      try {
        const mxplan = await getMXPlan(serviceName);
        if (mxplan) {
          if (mxplan.offer === emailOfferRedirect) {
            return {
              serviceDetected: AssociatedEmailsServicesEnum.REDIRECTION,
              data: serviceName,
            };
          }
          return {
            serviceDetected: AssociatedEmailsServicesEnum.MXPLAN,
            data: serviceName,
          };
        }
      } catch (_) {
        // MXplan not found return redirect
      }

      return {
        serviceDetected: AssociatedEmailsServicesEnum.REDIRECTION,
        data: serviceName,
      };
    },
    staleTime: 60_000,
  });
}

export function useGetAssociatedHosting(serviceName: string) {
  return useQuery<string[]>({
    queryKey: ['associated-hosting', serviceName],
    queryFn: () => getAssociatedHosting(serviceName),
  });
}

export function useOrderFreeHosting() {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { addSuccess, addError } = useNotifications();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({
      cartId,
      itemId,
      options,
    }: {
      cartId: string;
      itemId: number;
      options: FreeHostingOptions;
    }) => orderFreeHosting(cartId, itemId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['associated-hosting'],
      });
      addSuccess(
        t(
          'domain_tab_general_information_associated_services_hosting_free_order_success',
        ),
      );
    },
    onError: (error: Error) => {
      addError(
        t(
          'domain_tab_general_information_associated_services_hosting_free_order_error',
          { error },
        ),
      );
    },
  });

  return {
    orderFreeHosting: mutate,
    isOrderFreeHostingPending: isPending,
    orderCompleted: isSuccess,
  };
}

export function useInitialOrderFreeHosting(
  serviceName: string,
  subsidiary: Subsidiary,
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['initial-order-free-hosting', serviceName, subsidiary],
    queryFn: () => initialOrderFreeHosting(serviceName, subsidiary),
    enabled: false,
  });

  return {
    getInitialOrder: refetch,
    orderCartDetails: data,
    isInitialOrderFreeHostingPending: isLoading,
    orderCartError: error,
  };
}

// Multi-hosting variant: fetch free hosting service info for each provided hosting name.
// Returns an array of UseQueryResult<TServiceInfo> matching the input order.
export function useGetFreeHostingServices(serviceNames: string[]) {
  return useQueries({
    queries: serviceNames.map((name) => ({
      queryKey: ['free-hosting-service', name],
      queryFn: () => getFreeHostingService(name),
      enabled: !!name,
    })),
  });
}

export function useGetSubDomainsAndMultiSites(serviceNames: string[]) {
  return useQueries({
    queries: serviceNames.map((serviceName) => ({
      queryKey: ['domain', 'subdomain-multisite', serviceName],
      queryFn: async () => {
        const data = await getAssociatedSubDomainsMultiSite(serviceName);
        return data.filter((item) => item !== serviceName);
      },
      enabled: !!serviceName,
      retry: false,
    })),
  });
}
export const useGetDnssecStatus = (serviceName: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ['domain', 'zone', 'dnssec', serviceName],
    queryFn: () => getServiceDnssec(serviceName),
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
  });

  return {
    dnssecStatus: data,
    isDnssecStatusLoading: isFetching,
  };
};
