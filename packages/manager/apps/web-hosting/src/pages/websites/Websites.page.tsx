import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateCsv, mkConfig, download } from 'export-to-csv';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  GuideButton,
  GuideItem,
  Notifications,
  OvhSubsidiary,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsLink, OdsPopover } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useWebHostingAttachedDomain } from '@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain';
import { WebsiteType, ServiceStatus } from '@/data/type';
import ActionButtonStatistics from './ActionButtonStatistics.component';
import { BadgeStatusCell, DiagnosticCell, LinkCell } from './Cells.component';
import { GUIDE_URL, ORDER_URL } from './websites.constants';
import { getAllWebHostingAttachedDomain } from '@/data/api/AttachedDomain';

export default function Websites() {
  const { t } = useTranslation('common');
  const [isExportPopoverOpen, setIsExportPopoverOpen] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useWebHostingAttachedDomain();

  const { notifications, addSuccess } = useNotifications();

  const items = data ? data.map((website: WebsiteType) => website) : [];

  const displayColumns: DatagridColumn<WebsiteType>[] = [
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
  interface ExportColumn {
    id: string;
    label: string;
    getValue: (item: WebsiteType) => string;
  }

  const exportColumns: ExportColumn[] = [
    {
      id: 'fqdn',
      label: t('web_hosting_status_header_fqdn'),
      getValue: (item) => item?.currentState.fqdn,
    },
    {
      id: 'path',
      label: t('web_hosting_status_header_path'),
      getValue: (item) => item?.currentState.path,
    },
    {
      id: 'serviceName',
      label: t('web_hosting_status_header_serviceName'),
      getValue: (item) => item?.currentState.hosting.serviceName,
    },
    {
      id: 'displayName',
      label: t('web_hosting_status_header_displayName'),
      getValue: (item) => item?.currentState.hosting.displayName,
    },
    {
      id: 'offer',
      label: t('web_hosting_status_header_offer'),
      getValue: (item) =>
        t([
          `web_hosting_dashboard_offer_${item?.currentState.hosting.offer}`,
          item?.currentState.hosting.offer,
        ]),
    },
    {
      id: 'git',
      label: t('web_hosting_status_header_git'),
      getValue: (item) =>
        t(`web_hosting_status_${item?.currentState.git?.status.toLowerCase()}`),
    },
    {
      id: 'ownLog',
      label: t('web_hosting_status_header_ownlog'),
      getValue: (item: WebsiteType) =>
        t(
          `web_hosting_status_${(item?.currentState.ownLog
            ? ServiceStatus.ACTIVE
            : ServiceStatus.NONE
          ).toLowerCase()}`,
        ),
    },
    {
      id: 'CDN',
      label: t('web_hosting_status_header_cdn'),
      getValue: (item) =>
        t(`web_hosting_status_${item?.currentState.cdn?.status.toLowerCase()}`),
    },
    {
      id: 'ssl',
      label: t('web_hosting_status_header_ssl'),
      getValue: (item) =>
        t(`web_hosting_status_${item?.currentState.ssl?.status.toLowerCase()}`),
    },
    {
      id: 'firewall',
      label: t('web_hosting_status_header_firewall'),
      getValue: (item) =>
        t(
          `web_hosting_status_${item?.currentState.firewall?.status.toLowerCase()}`,
        ),
    },
    {
      id: 'boostOffer',
      label: t('web_hosting_status_header_boostOffer'),
      getValue: (item: WebsiteType) =>
        t(
          `web_hosting_status_${(item?.currentState.hosting.boostOffer
            ? ServiceStatus.ACTIVE
            : ServiceStatus.NONE
          ).toLowerCase()}`,
        ),
    },
  ];

  const handleExportPopoverToggle = () => {
    setIsExportPopoverOpen(!isExportPopoverOpen);
  };

  const handleExportWithExportToCsv = (dataCsv: WebsiteType[]) => {
    setIsExportPopoverOpen(false);
    const csvConfig = mkConfig({
      filename: t('websites'),
      fieldSeparator: ',',
      quoteStrings: true,
      useKeysAsHeaders: true,
    });

    const csvData = dataCsv.map((item) =>
      exportColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column.label]: column.getValue(item),
        }),
        {},
      ),
    );

    const csv = generateCsv(csvConfig)(csvData);
    const blob = new Blob([csv.toString()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const successMessage = (
      <div>
        {t('web_hosting_export_success')}
        <OdsLink
          href={url}
          download={csvConfig.filename}
          label={t('web_hosting_export_download_manually')}
          className="ml-4"
          icon={ODS_ICON_NAME.download}
          iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
        />
      </div>
    );
    addSuccess(successMessage);
    download(csvConfig)(csv);
  };

  const handleExportAllWithExportToCsv = async () => {
    setIsExportPopoverOpen(false);
    const result = await getAllWebHostingAttachedDomain();
    if (result?.data && result.data.length > 0) {
      handleExportWithExportToCsv(result.data);
    }
  };

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const goToOrder = () => {
    const url = ORDER_URL[ovhSubsidiary as OvhSubsidiary] || ORDER_URL.DEFAULT;
    window.open(url, '_blank');
  };

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: GUIDE_URL[ovhSubsidiary as OvhSubsidiary] || GUIDE_URL.DEFAULT,
      target: '_blank',
      label: t('web_hosting_header_guide_general_informations'),
    },
  ];

  const actionItems = [
    {
      id: 1,
      onClick: () => data && handleExportWithExportToCsv(data),
      label: t('web_hosting_export_label_displayed'),
    },
    {
      id: 2,
      onClick: handleExportAllWithExportToCsv,
      label: t('web_hosting_export_label_all'),
    },
  ];

  return (
    <BaseLayout
      header={{
        title: t('websites'),
        headerButton: <GuideButton items={guideItems} />,
      }}
      message={notifications.length ? <Notifications /> : null}
    >
      <Datagrid
        data-testid="websites-page-datagrid"
        columns={displayColumns}
        items={items}
        totalItems={items.length}
        hasNextPage={!isFetchingNextPage && hasNextPage}
        onFetchNextPage={fetchNextPage}
        isLoading={isFetchingNextPage || isLoading}
        topbar={
          <div className="flex items-center gap-4">
            <OdsButton
              label={t('web_hosting_header_order')}
              variant={ODS_BUTTON_VARIANT.default}
              color={ODS_BUTTON_COLOR.primary}
              onClick={goToOrder}
              icon={ODS_ICON_NAME.externalLink}
              iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
              data-testid="websites-page-order-button"
            />
            <div id="export-popover-trigger" className="w-min">
              <OdsButton
                label={t('web_hosting_export_action_label')}
                variant={ODS_BUTTON_VARIANT.outline}
                onClick={handleExportPopoverToggle}
                data-testid="websites-page-export-button"
                icon={
                  isExportPopoverOpen
                    ? ODS_ICON_NAME.chevronUp
                    : ODS_ICON_NAME.chevronDown
                }
              />
            </div>

            <OdsPopover
              className="py-[8px] px-0 w-max"
              triggerId="export-popover-trigger"
              with-arrow
            >
              <div className="flex flex-col">
                {actionItems.map((action) => (
                  <OdsButton
                    key={action.id}
                    label={action.label}
                    onClick={action.onClick}
                    variant={ODS_BUTTON_VARIANT.ghost}
                    data-testid={`websites-page-export-button-${action.id}`}
                    className="w-full"
                  />
                ))}
              </div>
            </OdsPopover>
          </div>
        }
      />
    </BaseLayout>
  );
}
