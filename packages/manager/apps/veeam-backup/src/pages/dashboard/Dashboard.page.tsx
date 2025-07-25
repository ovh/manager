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
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import {
  getOrganizationIdFromBackup,
  getRegionNameFromAzName,
  getVeeamBackupDisplayName,
  useVeeamBackup,
} from '@ovh-ux/manager-module-vcd-api';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constant';
import { MessagesViewer } from '@/components/Messages/MessageViewer.component';
import { OrganizationCell } from '../listing/DatagridCell.component';
import { DisplayNameWithEditButton } from './DisplayName.component';
import { SubscriptionTile } from './SubscriptionTile.component';
import { BillingTile } from './BillingTile.component';
import { Loading } from '@/components/Loading/Loading';
import { BackupStatusBadge } from '@/components/BackupStatus/BackupStatusBadge.component';

import { CHANGELOG_LINKS, CANCELED_VEEAM_BACKUP_STATUS } from '@/constants';
import VeeamGuidesHeader from '@/components/Guide/VeeamGuidesHeader';

export default function DashboardPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useVeeamBackup(id);

  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const displayName = getVeeamBackupDisplayName(data?.data);

  const header: HeadersProps = {
    title: displayName,
    description: displayName !== data?.data?.id ? data?.data?.id : null,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
    headerButton: <VeeamGuidesHeader />,
  };

  return (
    <BaseLayout
      header={header}
      breadcrumb={<Breadcrumb />}
      message={
        <>
          {CANCELED_VEEAM_BACKUP_STATUS.includes(
            data?.data?.resourceStatus,
          ) && (
            <OdsMessage color="warning" isDismissible={false}>
              {t('terminated_service')}
            </OdsMessage>
          )}
          <MessagesViewer id={id} />
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
                      className="mt-4 tile__link--breakable"
                      withLink
                      organizationId={getOrganizationIdFromBackup(data?.data)}
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

            <BillingTile backup={data?.data} id={id} />
            <SubscriptionTile {...data?.data} />
          </DashboardGridLayout>
        </React.Suspense>
      </RedirectionGuard>
      <Outlet />
    </BaseLayout>
  );
}
