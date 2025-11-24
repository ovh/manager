import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/muk';

import ConfigurationTile from '@/components/dashboard/ConfigurationTile.component';
import GeneralInformationTile from '@/components/dashboard/GeneralInformationTile.component';
import SubscriptionTile from '@/components/dashboard/SubscriptionTile.component';
import TagsTile from '@/components/dashboard/TagsTile.component';
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
  const iam = tenant?.iam;
  const createdAt = tenant?.createdAt;
  const updatedAt = tenant?.updatedAt;
  const title = tenantState?.title;
  const description = tenantState?.description;
  const infrastructure = tenantState?.infrastructure;

  const endpoint = infrastructure?.currentState.entryPoint ?? '';
  const limits = tenantState?.limits;

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
        <Button variant={BUTTON_VARIANT.outline}>{t('dashboard.explore_in_grafana_button')}</Button>
      </div>

      <div className="w-full block">
        <div className="grid grid-cols-1 lg:items-start lg:grid-cols-3 gap-4 lg:gap-6">
          <GeneralInformationTile
            title={title}
            description={description}
            iam={iam}
            endpoint={endpoint}
            createdAt={createdAt}
            updatedAt={updatedAt}
            isLoading={isLoading}
          />

          <div className="flex flex-col justify-start gap-6">
            <ConfigurationTile
              retention={limits?.retention?.duration}
              numberOfSeriesCurrent={limits?.numberOfSeries.current}
              numberOfSeriesMaximum={limits?.numberOfSeries.maximum}
              isLoading={isLoading}
            />

            <TagsTile tenantId={tenantId ?? ''} tags={iam?.tags} isLoading={isLoading} />
          </div>

          <SubscriptionTile tenantId={tenantId ?? ''} subscriptions={5} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
