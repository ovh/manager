import { useEffect, useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterCategories, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { BUTTON_VARIANT, Button, DatagridColumn, TagsList, useNotifications } from '@ovh-ux/muk';

import FilteredDatagrid from '@/components/listing/common/datagrid/filtered-datagrid/FilteredDatagrid.component';
import TenantStatus from '@/components/metrics/tenant-status/TenantStatus.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenantSubscriptions } from '@/data/hooks/tenants/useTenantSubscriptions.hook';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import { LocationPathParams } from '@/routes/Routes.constants';
import { TenantSubscriptionListing } from '@/types/tenants.type';
import { IAM_ACTIONS } from '@/utils/iam.constants';
import { mapSubscriptionsToListing } from '@/utils/tenants.utils';

export default function SubscriptionPage() {
  const { t } = useTranslation(['tenants', NAMESPACES.DASHBOARD, NAMESPACES.ERROR, 'shared']);
  const { addError } = useNotifications();

  const { selectedService } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';
  const { tenantId } = useParams<LocationPathParams>();

  const {
    data: subscriptions,
    isLoading,
    isError,
    error,
  } = useTenantSubscriptions(resourceName, tenantId ?? '');
  const {
    data: tenant,
    isLoading: isTenantLoading,
    isError: isTenantError,
    error: errorTenant,
  } = useTenant(resourceName, tenantId ?? '');

  const columns: DatagridColumn<TenantSubscriptionListing>[] = useMemo(
    () => [
      {
        id: 'kind',
        header: t('tenants:dashboard.subscription_listing.kind_cell'),
        label: t('tenants:dashboard.subscription_listing.kind_cell'),
        accessorKey: 'resource.type',
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 150,
      },
      {
        id: 'resource',
        header: t('tenants:dashboard.subscription_listing.resource_cell'),
        label: t('tenants:dashboard.subscription_listing.resource_cell'),
        accessorKey: 'resource.name',
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 250,
      },
      {
        id: 'status',
        header: t('tenants:status.title'),
        label: t('tenants:status.title'),
        accessorFn: (row: TenantSubscriptionListing) => row,
        cell: ({ getValue }) => {
          const { resourceStatus } = getValue() as TenantSubscriptionListing;
          return <TenantStatus status={resourceStatus} />;
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 100,
      },
      {
        id: 'tags',
        header: t('tenants:listing.tags_cell'),
        label: t('tenants:listing.tags_cell'),
        accessorFn: (row: TenantSubscriptionListing) => row,
        cell: ({ getValue }) => {
          const { resource, tags } = getValue<TenantSubscriptionListing>();
          return <TagsList tags={tags} modalHeading={resource.name} maxLines={1} />;
        },
        comparator: FilterCategories.Tags,
        type: FilterTypeCategories.Tags,
        isSearchable: true,
        isFilterable: true,
        size: 200,
      },
      {
        id: 'actions',
        header: '',
        accessorFn: (row: TenantSubscriptionListing) => row.id,
        cell: () => <span className="text-sm text-gray-500">TODO</span>,
        isSearchable: false,
        isFilterable: false,
        size: 80,
      },
    ],
    [t],
  );

  useEffect(() => {
    if (isError) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error?.message,
        }),
      );
    }
    if (isTenantError) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: errorTenant?.message,
        }),
      );
    }
  }, [addError, error, isError, isTenantError, errorTenant, t]);

  const listingSubscriptions = useMemo(
    () => (subscriptions ? mapSubscriptionsToListing(subscriptions) : []),
    [subscriptions],
  );

  const topbar = useMemo(
    () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="create-tenant-subscription"
            onClick={() => {}}
            variant={BUTTON_VARIANT.default}
            urn={tenant?.iam?.urn ?? ''}
            iamActions={IAM_ACTIONS.EDIT_TENANT}
            isIamTrigger={true}
            displayTooltip={true}
            disabled={true}
            loading={isTenantLoading}
          >
            {t('tenants:dashboard.subscription_listing.create_subscription')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('shared:coming_soon')}</TooltipContent>
      </Tooltip>
    ),
    [t, isTenantLoading, tenant],
  );

  if (!subscriptions) {
    return null;
  }

  return (
    <section className="mt-8">
      <FilteredDatagrid<TenantSubscriptionListing>
        topbar={topbar}
        columns={columns}
        data={listingSubscriptions}
        isLoading={isLoading}
        searchFilterLabel={t('tenants:listing.filter_search_key')}
      />
    </section>
  );
}
