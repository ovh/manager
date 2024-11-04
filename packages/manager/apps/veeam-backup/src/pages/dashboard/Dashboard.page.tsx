import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  DashboardGridLayout,
  BaseLayout,
  DashboardTile,
  Description,
  RedirectionGuard,
  Region,
} from '@ovh-ux/manager-react-components';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { getVeeamBackupDisplayName, useVeeamBackup } from '@/data';
import { urls } from '@/routes/routes.constant';
import { SuccessMessages } from '@/components/Messages/SuccessMessage.component';
import {
  StatusCell,
  OrganizationCell,
} from '../listing/DatagridCell.component';
import { DisplayNameWithEditButton } from './DisplayName.component';
import { OfferProgress } from './OfferProgress.component';
import { SubscriptionTile } from './SubscriptionTile.component';
import { ComingSoonBadge } from '@/components/ComingSoonBadge/ComingSoonBadge';
import { BillingLink } from '@/components/Links/BillingLink.component';
import { Loading } from '@/components/Loading/Loading';

export default function DashboardPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useVeeamBackup(id);
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const displayName = getVeeamBackupDisplayName(data?.data);

  return (
    <BaseLayout
      header={{
        title: displayName,
        description: displayName !== data?.data?.id ? data?.data?.id : null,
      }}
      breadcrumb={<Breadcrumb />}
      message={<SuccessMessages id={id} />}
      backLinkLabel={t('back_to_listing_label')}
      onClickReturn={() => navigate(urls.listing)}
    >
      <RedirectionGuard
        condition={isError}
        isLoading={isLoading}
        route={urls.listing}
      >
        <React.Suspense fallback={<Loading />}>
          <DashboardGridLayout>
            <DashboardTile
              title={t('general_informations')}
              items={[
                {
                  id: 'displayName',
                  label: t('display_name'),
                  value: <DisplayNameWithEditButton {...data?.data} />,
                },
                {
                  id: 'status',
                  label: t('product_status'),
                  value: <StatusCell className="mt-4" {...data?.data} />,
                },
                {
                  id: 'vcdOrg',
                  label: t('vcd_org'),
                  value: (
                    <OrganizationCell
                      className="mt-4"
                      withLink
                      {...data?.data}
                    />
                  ),
                },
                {
                  id: 'region',
                  label: t('region'),
                  value: (
                    <Description>
                      <Region
                        mode="region"
                        name={data?.data.currentState.region.toLowerCase()}
                      />
                    </Description>
                  ),
                },
              ]}
            />
            <DashboardTile
              title={t('billing')}
              items={[
                {
                  id: 'consumedVms',
                  label: t('consumed_vms'),
                  value: data?.data?.currentState?.vms ? (
                    <div className="flex flex-col">
                      <OsdsChip color={ODS_THEME_COLOR_INTENT.primary} inline>
                        {data.data.currentState.vms} VMs
                      </OsdsChip>
                      <Description>{t('consumed_vms_label')}</Description>
                    </div>
                  ) : (
                    <ComingSoonBadge />
                  ),
                },
                ...(data?.data?.currentState?.offers?.map((offer) => ({
                  id: offer.name,
                  label: `${offer.name
                    .at(0)
                    .toUpperCase()}${offer.name.substring(1).toLowerCase()}`,
                  value: <OfferProgress {...offer} />,
                })) || []),
                data?.data?.currentState.offers.every(
                  (offer) => offer.name !== 'GOLD',
                ) && {
                  id: 'gold',
                  label: 'Gold',
                  value: <ComingSoonBadge />,
                },
                {
                  id: 'bilingModalities',
                  value: <BillingLink />,
                },
              ].filter(Boolean)}
            />
            <SubscriptionTile {...data?.data} />
          </DashboardGridLayout>
        </React.Suspense>
      </RedirectionGuard>
      <Outlet />
    </BaseLayout>
  );
}
