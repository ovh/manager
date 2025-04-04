import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  DashboardGridLayout,
  BaseLayout,
  DashboardTile,
  RedirectionGuard,
  Region,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import {
  getRegionNameFromAzName,
  getVeeamBackupDisplayName,
  useVeeamBackup,
} from '@ovh-ux/manager-module-vcd-api';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constant';
import { SuccessMessages } from '@/components/Messages/SuccessMessage.component';
import { OrganizationCell } from '../listing/DatagridCell.component';
import { DisplayNameWithEditButton } from './DisplayName.component';
import { ConsumedVms } from './ConsumedVms.component';
import { OfferProgress } from './OfferProgress.component';
import { SubscriptionTile } from './SubscriptionTile.component';
import { ComingSoonBadge } from '@/components/ComingSoonBadge/ComingSoonBadge';
import { BillingLink } from '@/components/Links/BillingLink.component';
import { Loading } from '@/components/Loading/Loading';
import { BackupStatusBadge } from '@/components/BackupStatus/BackupStatusBadge.component';

import { CHANGELOG_LINKS } from '@/constants';

export default function DashboardPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useVeeamBackup(id);

  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const displayName = getVeeamBackupDisplayName(data?.data);

  const header = {
    title: displayName,
    description: displayName !== data?.data?.id ? data?.data?.id : null,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
  };

  return (
    <BaseLayout
      header={header}
      breadcrumb={<Breadcrumb />}
      message={
        <>
          {['DISABLED', 'DISABLING', 'REMOVED'].includes(
            data?.data?.resourceStatus,
          ) && (
            <OdsMessage color="warning">{t('terminated_service')}</OdsMessage>
          )}
          <SuccessMessages id={id} />
        </>
      }
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
                  value: <BackupStatusBadge {...data?.data} />,
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
                  id: 'location',
                  label: t('location'),
                  value: (
                    <OdsText>
                      <Region
                        mode="region"
                        name={getRegionNameFromAzName(
                          data?.data.currentState.azName,
                        )}
                      />
                    </OdsText>
                  ),
                },
                {
                  id: 'region',
                  label: t('region'),
                  value: (
                    <OdsText>
                      {getRegionNameFromAzName(data?.data.currentState.azName)}
                    </OdsText>
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
                  value: <ConsumedVms id={id} backup={data?.data} />,
                },
                ...(data?.data?.currentState?.offers?.map((offer) => ({
                  id: offer.name,
                  label: `${offer.name
                    .at(0)
                    .toUpperCase()}${offer.name.substring(1).toLowerCase()}`,
                  value: <OfferProgress offer={offer} id={id} />,
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
