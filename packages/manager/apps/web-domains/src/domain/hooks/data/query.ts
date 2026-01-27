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
  getDomainAuthInfo,
  transferTag,
} from '@/domain/data/api/domainResources';
import {
  DomainUpdateApiError,
  ServiceType,
  TDomainOption,
  TDomainResource,
  TCurrentState,
  TTargetSpec,
  TUpdateDomainVariables,
} from '@/domain/types/domainResource';
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
  getDomainContact,
  getMXPlan,
  getRedirectionEmail,
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
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { ApiError } from '@ovh-ux/manager-core-api';

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

export const useGetDomainZone = (
  serviceName: string,
  domainResource: TDomainResource,
  enabled: boolean = false,
) => {
  const { data, isLoading, error } = useQuery<TDomainZone>({
    queryKey: ['domain', 'zone', serviceName],
    queryFn: () => getDomainZone(serviceName),
    retry: false,
    enabled: enabled,
  });
  return {
    domainZone: data,
    isFetchingDomainZone: isLoading,
    domainZoneError: error as ApiError,
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

  const { mutate, isPending, error, reset } = useMutation<
    void,
    DomainUpdateApiError,
    TUpdateDomainVariables
  >({
    mutationKey: ['domain', 'resource', 'update', serviceName],
    mutationFn: async ({ currentTargetSpec, updatedSpec }) => {
      await queryClient.refetchQueries({
        queryKey: ['domain', 'resource', serviceName],
        exact: true,
      });

      const domainResource = await queryClient.ensureQueryData({
        queryKey: ['domain', 'resource', serviceName],
        queryFn: () => getDomainResource(serviceName),
      });

      const newTargetSpec: TTargetSpec = {
        ...currentTargetSpec,
        ...updatedSpec,
      };

      return updateDomainResource(serviceName, {
        checksum: domainResource.checksum,
        targetSpec: newTargetSpec,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['domain', 'resource', serviceName],
      });
    },
  });

  return {
    updateDomain: mutate,
    errorMessage: error,
    isUpdateDomainPending: isPending,
    resetError: reset,
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

      try {
        const redirection = await getRedirectionEmail(serviceName);
        if (redirection) {
          if (redirection.length > 0) {
            return {
              serviceDetected: AssociatedEmailsServicesEnum.REDIRECTION,
              data: redirection[0],
            };
          }
        }
      } catch (_) {
        // Redirection not found return nothing
      }

      return {
        serviceDetected: AssociatedEmailsServicesEnum.NOTHING,
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
  pricingMode: string,
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['initial-order-free-hosting', serviceName, subsidiary],
    queryFn: () =>
      initialOrderFreeHosting(serviceName, subsidiary, pricingMode),
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

export const useGetDnssecStatus = (
  resourceCurrentState: TCurrentState,
  resourceTargetSpec: TTargetSpec,
): { dnssecStatus: DnssecStatusEnum; isDnssecStatusLoading: boolean } => {
  if (!resourceCurrentState.dnssecConfiguration?.dnssecSupported) {
    return {
      dnssecStatus: DnssecStatusEnum.NOT_SUPPORTED,
      isDnssecStatusLoading: false,
    };
  }

  if (
    resourceCurrentState?.dnsConfiguration?.configurationType ===
      DnsConfigurationTypeEnum.EXTERNAL ||
    resourceCurrentState?.dnsConfiguration?.configurationType ===
      DnsConfigurationTypeEnum.MIXED
  ) {
    // If the configuration is not hosted by OVH, check the registry declaration to know whether DNSSEC is activated
    let status: DnssecStatusEnum;
    const isCurrentDsData =
      resourceCurrentState?.dnssecConfiguration?.dsData?.length > 0;
    const isTargetDsData =
      resourceTargetSpec?.dnssecConfiguration?.dsData?.length > 0;

    if (isCurrentDsData) {
      if (isTargetDsData) {
        // DNSSEC is enabled and not being deleted
        status = DnssecStatusEnum.ENABLED;
      } else {
        // DNSSEC is enabled and disabling has been asked
        status = DnssecStatusEnum.DISABLE_IN_PROGRESS;
      }
    }

    if (!isCurrentDsData) {
      if (isTargetDsData) {
        // DNSSEC is not enabled yet, but enabling has been asked
        status = DnssecStatusEnum.ENABLE_IN_PROGRESS;
      } else {
        // DNSSEC is not enabled and activation has not been asked
        status = DnssecStatusEnum.DISABLED;
      }
    }

    return {
      dnssecStatus: status,
      isDnssecStatusLoading: false,
    };
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['domain', 'zone', 'dnssec', resourceCurrentState.name],
    queryFn: () => getServiceDnssec(resourceCurrentState.name),
    retry: false,
  });

  // This call ends up in error if the customer has not registered their DNS zone yet.
  // In this case, the DNSSEC status should be "DISABLED"
  const dnssecStatus = isError ? DnssecStatusEnum.DISABLED : data?.status;

  return {
    dnssecStatus,
    isDnssecStatusLoading: isLoading,
  };
};

export const useUpdateDnssecService = (
  serviceName: string,
  isEnableDnssecAction: boolean,
) => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation(['domain', 'web-domains/error']);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (isEnableDnssecAction) {
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
    onError: (error: DomainUpdateApiError) => {
      addError(
        t('domain_tab_general_information_dnssec_error', {
          error: error.response.data.message,
        }),
      );
    },
  });

  return {
    updateServiceDnssec: mutate,
    isUpdateIsPending: isPending,
  };
};

export const useGetDomainAuthInfo = (serviceName: string, fetch: boolean) => {
  const { data, isLoading } = useQuery({
    queryKey: ['domain', 'service', serviceName, 'authInfo'],
    queryFn: () => getDomainAuthInfo(serviceName),
    enabled: fetch,
  });

  return {
    authInfo: data,
    isAuthInfoLoading: isLoading,
  };
};

export const useTransferTag = (serviceName: string, tag: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { addSuccess } = useNotifications();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => transferTag(tag, serviceName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['domain', 'service', serviceName, 'authInfo'],
      });
      addSuccess(t('domain_tab_general_information_transfer_tag_success'));
    },
  });

  return {
    transferTag: mutate,
    transferTagError: error,
    isTransferTagPending: isPending,
  };
};
