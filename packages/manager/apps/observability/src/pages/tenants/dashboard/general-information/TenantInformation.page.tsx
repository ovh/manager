import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/muk';

import ConfigurationTile from '@/components/dashboard/ConfigurationTile.component';
import GeneralInformationTile from '@/components/dashboard/GeneralInformationTile.component';
import SubscriptionTile from '@/components/dashboard/SubscriptionTile.component';
import TagsTile from '@/components/dashboard/TagsTile.component';
import GrafanaButton from '@/components/metrics/grafana-button/GrafanaButton.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';

export default function TenantsInformationPage() {
  const { t } = useTranslation(['tenants', NAMESPACES.ERROR]);

  const { addError } = useNotifications();

  const { selectedService } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';
  const { tenantId } = useParams<{ tenantId: string }>();

  const { data: tenant, isLoading, error, isError } = useTenant(resourceName, tenantId ?? '');

  const tenantState = tenant?.currentState;
  const resourceStatus = tenant?.resourceStatus;
  const iam = tenant?.iam;
  const createdAt = tenant?.createdAt;
  const updatedAt = tenant?.updatedAt;
  const title = tenantState?.title;
  const description = tenantState?.description;
  const endpoint = tenantState?.endpoint;

  const limits = tenantState?.limits;

  const currentTenantId = tenantId ?? '';

  useEffect(() => {
    if (isError) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error?.message,
        }),
      );
    }
  }, [addError, isError, error, t]);

  return (
    <section>
      <div className="my-8">
        <GrafanaButton />
      </div>

      <div className="block w-full">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start lg:gap-6">
          <GeneralInformationTile
            tenantId={currentTenantId}
            title={title}
            description={description}
            iam={iam}
            endpoint={endpoint}
            createdAt={createdAt}
            updatedAt={updatedAt}
            isLoading={isLoading}
            resourceStatus={resourceStatus}
          />

          <div className="flex flex-col justify-start gap-6">
            <ConfigurationTile
              retention={limits?.mimir?.compactor_blocks_retention_period}
              numberOfSeriesMaximum={limits?.mimir?.max_global_series_per_user}
              isLoading={isLoading}
            />

            <TagsTile
              tenantId={currentTenantId}
              title={title ?? ''}
              tags={iam?.tags ?? {}}
              isLoading={isLoading}
            />
          </div>

          <SubscriptionTile tenantId={currentTenantId} subscriptions={5} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
