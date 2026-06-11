import { Outlet, useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { servicesQueries } from '@/data/queries/services.queries';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { urls } from '@/routes/routes.constants';

import { GeneralInformationTenantTile } from './_components/general-information-tenant-tile/GeneralInformationTenantTile.component';
import SubscriptionTile from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD);
  const queryClient = useQueryClient();
  const { data: tenantDetails } = useQuery(tenantsQueries.withClient(queryClient).details());
  const { data: vspcDetail } = useQuery(tenantsQueries.withClient(queryClient).vspcDetail());
  const navigate = useNavigate();

  const vspcResourceId = vspcDetail?.id;
  const { data: serviceIdData, isPending: isServiceIdLoading } = useQuery({
    ...servicesQueries.agoraServiceId(vspcResourceId!),
    enabled: !!vspcResourceId,
    select: (response) => response.data,
  });
  const hasNoAccess =
    !isServiceIdLoading && vspcResourceId !== undefined && (serviceIdData?.[0] ?? null) === null;

  return (
    <section className="flex md:flex-row flex-col gap-8">
      <GeneralInformationTenantTile />
      <SubscriptionTile />
      <div className="flex flex-col gap-4 w-full">
        <BillingInformationsTileStandard
          resourceName={tenantDetails?.id}
          onResiliateLinkClick={
            hasNoAccess ? undefined : () => navigate(urls.dashboardTenantTerminate)
          }
          hideResiliateLink={hasNoAccess}
        />
        {hasNoAccess && (
          <OdsMessage color="warning" isDismissible={false}>
            {t('terminate_service_no_access')}
          </OdsMessage>
        )}
      </div>
      <Outlet />
    </section>
  );
}
