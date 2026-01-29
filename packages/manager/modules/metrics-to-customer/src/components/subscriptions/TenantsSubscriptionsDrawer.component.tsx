import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Divider, Text, TEXT_PRESET } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { LocationPathParams } from '@/routes/Routes.constants';
import { getRootUrl, getSubscriptionsConfigUrl } from '@/routes/Routes.utils';

import { useTenantsWithSubscriptions } from '@/data/hooks/tenants/useTenantsWithSubscriptions';
import { useObservabilityServices } from '@/data/hooks/services/useObservabilityServices.hook';
import { useCreateSubscription } from '@/data/hooks/tenants/useCreateSubscription.hook';
import { useDeleteSubscription } from '@/data/hooks/tenants/useDeleteSubscription.hook';

import { TenantSubscription, TenantWithSubscriptions } from '@/types/tenants.type';
import { FilterValues } from '@/types/subscriptions/subscriptionManager.type';

import ServicesDropDown from '@/components/services/ServicesDropDown.component';
import TenantsSubscriptionsDisclaimer from '@/components/subscriptions/TenantsSubscriptionsDisclaimer.component';
import SubscriptionsDrawer from '@/components/subscriptions/SubscriptionManager/SubscriptionsDrawer.component';
import SubscriptionManager from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.component';

import { TenantsSubscriptionsDrawerProps } from '@/components/subscriptions/TenantsSubscriptionsDrawer.props';
import NoTenantsMessage from '@/components/subscriptions/NoTenantsMessage.component';

const FILTER_KEYS = {
  REGION: 'region',
  SERVICE_ID: 'serviceId',
} as const;

const TenantsSubscriptionsDrawer = ({
  regions,
  defaultRetention,
  subscriptionUrls,
}: TenantsSubscriptionsDrawerProps) => {
  const { t } = useTranslation(NAMESPACES.SUBSCRIPTIONS);

  const navigate = useNavigate();
  const params = useParams<LocationPathParams>();

  const resourceName = useMemo(() => {
    return params.resourceName ?? '';
  }, [params.resourceName])

  const {
    data: services,
    isLoading: isLoadingServices,
    isSuccess: isSuccessServices,
  } = useObservabilityServices();

  const [filterValues, setFilterValues] = useState<FilterValues>({
    [FILTER_KEYS.SERVICE_ID]: null,
    [FILTER_KEYS.REGION]: regions.map(r => r.code),
  });

  useEffect(() => {
    if (!isSuccessServices || !services) {
      return;
    }

    if (resourceName) {
      const serviceExists = services.some((service) => service.id === resourceName);
      if (serviceExists) {
        setFilterValues((prev) => {
          if (prev[FILTER_KEYS.SERVICE_ID] !== resourceName) {
            return {
              ...prev,
              [FILTER_KEYS.SERVICE_ID]: resourceName,
            };
          }
          return prev;
        });
      }
    } else {
      setFilterValues((prev) => {
        if (prev[FILTER_KEYS.SERVICE_ID] !== null) {
          return {
            ...prev,
            [FILTER_KEYS.SERVICE_ID]: null,
          };
        }
        return prev;
      });
    }
  }, [resourceName, isSuccessServices, services]);

  const {
    data: tenantsData,
    isLoading: isLoadingTenants,
    isSuccess: isSuccessTenants,
  } = useTenantsWithSubscriptions(resourceName, regions);

  const createSubscription = useCreateSubscription();
  const deleteSubscription = useDeleteSubscription();

  const isLoadingData = isLoadingServices || isLoadingTenants;

  const onDismiss = useCallback(() => {
    navigate('..');
  }, [navigate]);

  const handleFilterChange = useCallback((filterKey: string, value: string | null) => {
    setFilterValues((prev) => {
      const newValues = {
        ...prev,
        [filterKey]: value,
      };

      // When service changes, update route immediately
      if (filterKey === FILTER_KEYS.SERVICE_ID) {
        const serviceId = value as string | null;

        if (serviceId) {
          if (serviceId !== resourceName) {
            navigate(serviceId, { relative: 'path' });
          }
        } else {
          if (resourceName) {
            navigate('../', { relative: 'path' });
          }
        }
      }
      return newValues;
    });
  }, [resourceName, navigate]);


  const handleCreateSubscription = useCallback((params: { subscribeUrl: string; itemId: string; resourceName: string }) => {
    createSubscription.mutate({
      subscribeUrl: params.subscribeUrl,
      tenantId: params.itemId,
      resourceName: params.resourceName,
    });
  }, [createSubscription]);

  const handleDeleteSubscription = useCallback((params: { subscription: TenantSubscription; itemId: string; resourceName: string }) => {
    const subscriptionId = params.subscription.id;
    const tenantId = params.subscription.iam?.id || params.itemId;

    deleteSubscription.mutate({
      resourceName: params.resourceName,
      tenantId,
      subscriptionId,
    });
  }, [deleteSubscription]);

  return (
    <SubscriptionsDrawer
      title={t('tenants_drawer.title')}
      onDismiss={onDismiss}
      isLoading={isLoadingData}
    >
      <SubscriptionManager<TenantWithSubscriptions, TenantSubscription>
        resourceName={resourceName}
        data={tenantsData}
        isSuccess={isSuccessTenants}
        isFiltersReady={!!resourceName}
        subscriptionUrls={subscriptionUrls}
        onCreateSubscription={handleCreateSubscription}
        onDeleteSubscription={handleDeleteSubscription}
        isCreatingSubscription={createSubscription.isPending}
        isDeletingSubscription={deleteSubscription.isPending}
      >
        <SubscriptionManager.Filters
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        >
          {({ filterValues, onFilterChange }) => (
            <div className="flex flex-col gap-4">
              <Text preset={TEXT_PRESET.label}>
                {t('tenants_regions.region', { count: regions?.length, })} : <Text preset={TEXT_PRESET.span}>
                  {regions?.map(r => r.label).join(', ')}
                </Text>
              </Text>
              <ServicesDropDown
                services={services}
                selectedServiceId={filterValues[FILTER_KEYS.SERVICE_ID] as string || ''}
                isLoading={isLoadingServices}
                onChange={(value) => onFilterChange(FILTER_KEYS.SERVICE_ID, value)}
              />
            </div>
          )}
        </SubscriptionManager.Filters>

        <Divider className="w-full" spacing="4" />

        {
          tenantsData?.length ? (
            <TenantsSubscriptionsDisclaimer
              text={t('tenants_drawer.disclaimer', { region: regions.map(r => r.label) })}
            />
          )
            : resourceName && <NoTenantsMessage regions={regions} defaultRetention={defaultRetention} />
        }

        <SubscriptionManager.List<TenantWithSubscriptions, TenantSubscription>
          titleFn={t => t.currentState.title}
          subtitleFn={t => t.id}
          idFn={t => t.id}
          subscriptionFn={(t, resourceName) =>
            t.subscriptions.find(
              (s) =>
                s.currentState.resource.name === resourceName &&
                s.iam?.id === t.id
            )
          }
          withSearch={true}
        />
      </SubscriptionManager>
    </SubscriptionsDrawer>
  );
};

export default TenantsSubscriptionsDrawer;
