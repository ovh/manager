import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useWebHostingAttachedDomain } from '@/hooks/useWebHostingAttachedDomain';
import { WebsiteType, ServiceStatus } from '@/api/type';
import ActionButtonStatistics from './ActionButtonStatistics.component';
import { BadgeStatusCell, DiagnosticCell, LinkCell } from './Cells.component';
import { ORDER_URL } from './websites.constants';

export default function Websites() {
  const { t } = useTranslation('common');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useWebHostingAttachedDomain();

  const items = data ? data.map((website: WebsiteType) => website) : [];
  const columns: DatagridColumn<WebsiteType>[] = [
    {
      id: 'fqdn',
      label: t('web_hosting_status_header_fqdn'),
      cell: (webSiteItem: WebsiteType) => (
        <LinkCell
          webSiteItem={webSiteItem}
          label={webSiteItem?.currentState.fqdn}
          withMultisite
        />
      ),
      enableHiding: false,
    },
    {
      id: 'diagnostic',
      label: t('web_hosting_status_header_diagnostic'),
      cell: (webSiteItem: WebsiteType) => (
        <DiagnosticCell webSiteItem={webSiteItem} />
      ),
      enableHiding: true,
    },
    {
      id: 'path',
      label: t('web_hosting_status_header_path'),
      cell: (webSiteItem: WebsiteType) => (
        <LinkCell
          webSiteItem={webSiteItem}
          label={webSiteItem?.currentState.path}
          withMultisite
        />
      ),
    },
    {
      id: 'serviceName',
      label: t('web_hosting_status_header_serviceName'),
      cell: (webSiteItem: WebsiteType) => (
        <LinkCell
          webSiteItem={webSiteItem}
          label={webSiteItem?.currentState.hosting.serviceName}
        />
      ),
      enableHiding: false,
    },
    {
      id: 'displayName',
      label: t('web_hosting_status_header_displayName'),
      cell: (webSiteItem: WebsiteType) => (
        <LinkCell
          webSiteItem={webSiteItem}
          label={webSiteItem?.currentState.hosting.displayName}
        />
      ),
    },
    {
      id: 'offer',
      label: t('web_hosting_status_header_offer'),
      cell: (webSiteItem: WebsiteType) => (
        <LinkCell
          webSiteItem={webSiteItem}
          label={t([
            `web_hosting_dashboard_offer_${webSiteItem?.currentState.hosting.offer}`,
            webSiteItem?.currentState.hosting.offer,
          ])}
        />
      ),
    },
    {
      id: 'git',
      label: t('web_hosting_status_header_git'),
      cell: (webSiteItem: WebsiteType) => (
        <BadgeStatusCell
          webSiteItem={webSiteItem}
          status={webSiteItem?.currentState.git?.status}
          withMultisite
        />
      ),
    },
    {
      id: 'ownLog',
      label: t('web_hosting_status_header_ownlog'),
      cell: (webSiteItem: WebsiteType) => (
        <BadgeStatusCell
          webSiteItem={webSiteItem}
          status={
            webSiteItem?.currentState.ownLog
              ? ServiceStatus.ACTIVE
              : ServiceStatus.NONE
          }
          withMultisite
        />
      ),
    },
    {
      id: 'CDN',
      label: t('web_hosting_status_header_cdn'),
      cell: (webSiteItem: WebsiteType) => (
        <BadgeStatusCell
          webSiteItem={webSiteItem}
          status={webSiteItem?.currentState.cdn.status}
          withMultisite
        />
      ),
    },
    {
      id: 'ssl',
      label: t('web_hosting_status_header_ssl'),
      cell: (webSiteItem: WebsiteType) => (
        <BadgeStatusCell
          webSiteItem={webSiteItem}
          status={webSiteItem?.currentState.ssl.status}
          withMultisite
        />
      ),
    },
    {
      id: 'firewall',
      label: t('web_hosting_status_header_firewall'),
      cell: (webSiteItem: WebsiteType) => (
        <BadgeStatusCell
          webSiteItem={webSiteItem}
          status={webSiteItem?.currentState.firewall.status}
          withMultisite
        />
      ),
    },
    {
      id: 'boostOffer',
      label: t('web_hosting_status_header_boostOffer'),
      cell: (webSiteItem: WebsiteType) => (
        <BadgeStatusCell
          webSiteItem={webSiteItem}
          status={
            webSiteItem?.currentState.hosting.boostOffer
              ? ServiceStatus.ACTIVE
              : ServiceStatus.NONE
          }
          withBoost
        />
      ),
    },
    {
      id: 'actions',
      label: '',
      cell: (webSiteItem: WebsiteType) => (
        <ActionButtonStatistics webSiteItem={webSiteItem} />
      ),
    },
  ];
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const goToOrder = () => {
    const url = ORDER_URL[ovhSubsidiary as OvhSubsidiary] || ORDER_URL.DEFAULT;
    window.open(url, '_blank');
  };
  return (
    <BaseLayout header={{ title: t('websites') }} breadcrumb={<Breadcrumb />}>
      <Datagrid
        data-testid="websites-page-datagrid"
        columns={columns}
        items={items}
        totalItems={items.length}
        hasNextPage={!isFetchingNextPage && hasNextPage}
        onFetchNextPage={fetchNextPage}
        isLoading={isFetchingNextPage || isLoading}
        topbar={
          <OdsButton
            label={t('web_hosting_header_order')}
            variant={ODS_BUTTON_VARIANT.default}
            color={ODS_BUTTON_COLOR.primary}
            onClick={goToOrder}
            icon={ODS_ICON_NAME.externalLink}
            iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
          />
        }
      />
    </BaseLayout>
  );
}
