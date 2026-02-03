import { useContext, useMemo, useRef, useState } from 'react';

import { VisibilityState } from '@tanstack/react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import punycode from 'punycode/punycode';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  Datagrid,
  GuideMenu,
  GuideMenuItem,
  Link,
  Notifications,
  OvhSubsidiary,
  useNotifications,
} from '@ovh-ux/muk';
import type { DatagridColumn } from '@ovh-ux/muk';

import { getAllWebHostingAttachedDomain } from '@/data/api/webHosting';
import { useWebHostingAttachedDomain } from '@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain';
import { WebsiteType } from '@/data/types/product/website';
import { GitStatus, ServiceStatus } from '@/data/types/status';
import { useDebouncedValue } from '@/hooks/debouncedValue/useDebouncedValue';
import { EXPORT_CSV, ORDER_CTA, WEBSITE } from '@/utils/tracking.constants';
import { buildURLSearchParams } from '@/utils/url';

import ActionButtonStatistics from './ActionButtonStatistics.component';
import { BadgeStatusCell, DiagnosticCell, LinkCell } from './Cells.component';
import { GUIDE_URL, ORDER_URL } from './constant/websites.constants';

export default function Websites() {
  const { t } = useTranslation('common');
  const [isExportPopoverOpen, setIsExportPopoverOpen] = useState(false);
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const csvPopoverRef = useRef<{ hide?: () => void | Promise<void> } | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { notifications, addSuccess } = useNotifications();
  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');

  const { data, isLoading, hasNextPage, fetchAllPages, fetchNextPage, isFetchingAllPages } =
    useWebHostingAttachedDomain({
      domain: punycode.toASCII(debouncedSearchInput),
    });
  const { trackClick } = useOvhTracking();

  const displayColumns: DatagridColumn<WebsiteType>[] = useMemo(
    () => [
      {
        id: 'fqdn',
        accessorFn: (row) => row.currentState?.fqdn ?? '',
        header: t('web_hosting_status_header_fqdn'),
        cell: ({ getValue, row }) => {
          const fqdn = getValue<string>();
          const containsPunycode = fqdn.split('.').some((part) => part.startsWith('xn--'));
          const decodedFqdn = punycode.toUnicode(fqdn);

          return (
            <div className="flex items-center gap-2">
              <LinkCell
                webSiteItem={row.original}
                label={decodedFqdn}
                tracking="fqdn"
                withMultisite
              />
              {containsPunycode && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon
                        name={ICON_NAME.circleQuestion}
                        color="muted"
                        className="cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>{fqdn}</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          );
        },
        enableHiding: false,
        isSearchable: true,
      },
      {
        id: 'diagnostic',
        header: t('web_hosting_status_header_diagnostic'),
        cell: ({ row }) => (
          <DiagnosticCell
            serviceName={row.original.currentState?.hosting?.serviceName}
            fqdn={row.original.currentState?.fqdn}
            isWebsiteView={false}
          />
        ),
        enableHiding: true,
      },
      {
        id: 'path',
        accessorFn: (row) => row.currentState?.path ?? '',
        header: t('web_hosting_status_header_path'),
        cell: ({ getValue, row }) => (
          <LinkCell
            webSiteItem={row.original}
            label={getValue<string>()}
            tracking="path"
            withMultisite
          />
        ),
      },
      {
        id: 'displayName',
        accessorFn: (row) =>
          row.currentState?.hosting?.displayName ?? row.currentState?.hosting?.serviceName,
        header: t('web_hosting_status_header_displayName'),
        cell: ({ getValue, row }) => (
          <LinkCell webSiteItem={row.original} label={getValue<string>()} tracking="displayName" />
        ),
      },
      {
        id: 'offer',
        accessorFn: (row) => row.currentState?.hosting?.offer ?? '',
        header: t('web_hosting_status_header_offer'),
        cell: ({ getValue, row }) => {
          const offer = getValue<string>();
          return (
            <LinkCell
              webSiteItem={row.original}
              label={t([`web_hosting_dashboard_offer_${offer}`, offer])}
              tracking="offer"
            />
          );
        },
      },
      {
        id: 'git',
        accessorFn: (row) => row.currentState?.git?.status,
        header: t('web_hosting_status_header_git'),
        cell: ({ getValue, row }) => (
          <BadgeStatusCell
            webSiteItem={row.original}
            status={getValue<GitStatus>()}
            tracking="git"
            withMultisite
          />
        ),
      },
      {
        id: 'ownLog',
        accessorFn: (row) => (row.currentState?.ownLog ? ServiceStatus.ACTIVE : ServiceStatus.NONE),
        header: t('web_hosting_status_header_ownlog'),
        cell: ({ getValue, row }) => (
          <BadgeStatusCell
            webSiteItem={row.original}
            status={getValue<ServiceStatus>()}
            tracking="ownLog"
            withMultisite
          />
        ),
      },
      {
        id: 'CDN',
        accessorFn: (row) => row.currentState?.cdn?.status,
        header: t('web_hosting_status_header_cdn'),
        cell: ({ getValue, row }) => (
          <BadgeStatusCell
            webSiteItem={row.original}
            status={getValue<ServiceStatus>()}
            tracking="cdn"
            withMultisite
          />
        ),
      },
      {
        id: 'ssl',
        accessorFn: (row) => row.currentState?.ssl?.status,
        header: t('web_hosting_status_header_ssl'),
        cell: ({ getValue, row }) => (
          <BadgeStatusCell
            webSiteItem={row.original}
            status={getValue<ServiceStatus>()}
            tracking="ssl"
            withMultisite
          />
        ),
      },
      {
        id: 'firewall',
        accessorFn: (row) => row.currentState?.firewall?.status,
        header: t('web_hosting_status_header_firewall'),
        cell: ({ getValue, row }) => (
          <BadgeStatusCell
            webSiteItem={row.original}
            status={getValue<ServiceStatus>()}
            tracking="firewall"
            withMultisite
          />
        ),
      },
      {
        id: 'boostOffer',
        accessorFn: (row) =>
          row.currentState?.hosting?.boostOffer ? ServiceStatus.ACTIVE : ServiceStatus.NONE,
        header: t('web_hosting_status_header_boostOffer'),
        cell: ({ getValue, row }) => (
          <BadgeStatusCell
            webSiteItem={row.original}
            status={getValue<ServiceStatus>()}
            tracking="boostOffer"
            withBoost
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => <ActionButtonStatistics webSiteItem={row.original} />,
        enableHiding: false,
      },
    ],
    [t],
  );

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
      id: 'displayName',
      label: t('web_hosting_status_header_displayName'),
      getValue: (item) =>
        item?.currentState.hosting.displayName || item?.currentState.hosting.serviceName,
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
      getValue: (item) => t(`web_hosting_status_${item?.currentState.git?.status.toLowerCase()}`),
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
      getValue: (item) => t(`web_hosting_status_${item?.currentState.cdn?.status.toLowerCase()}`),
    },
    {
      id: 'ssl',
      label: t('web_hosting_status_header_ssl'),
      getValue: (item) => t(`web_hosting_status_${item?.currentState.ssl?.status.toLowerCase()}`),
    },
    {
      id: 'firewall',
      label: t('web_hosting_status_header_firewall'),
      getValue: (item) =>
        t(`web_hosting_status_${item?.currentState.firewall?.status.toLowerCase()}`),
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

  const handleExportWithExportToCsv = (dataCsv: WebsiteType[]) => {
    Promise.resolve(csvPopoverRef.current?.hide()).catch(() => {});
    setIsCSVLoading(true);
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [`${EXPORT_CSV}_${WEBSITE}`],
    });
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
    const csvString = csv as unknown as string;
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const successMessage = (
      <div>
        {t('web_hosting_export_success')}
        <Link href={url} download={csvConfig.filename} className="ml-4">
          {t('web_hosting_export_download_manually')}
        </Link>
        <Icon name={ICON_NAME.download}></Icon>
      </div>
    );
    addSuccess(successMessage);
    download(csvConfig)(csv);
    setIsCSVLoading(false);
  };

  const handleExportAllWithExportToCsv = async () => {
    await csvPopoverRef.current?.hide();
    setIsCSVLoading(true);
    const searchParams = buildURLSearchParams({ domain: debouncedSearchInput });
    const result = await getAllWebHostingAttachedDomain(searchParams);
    if (result?.data && result.data.length > 0) {
      handleExportWithExportToCsv(result.data);
    }
  };

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const goToOrder = () => {
    const url = ORDER_URL[ovhSubsidiary as OvhSubsidiary] || ORDER_URL.DEFAULT;
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ORDER_CTA],
    });
    window.open(url, '_blank');
  };

  const guideItems: GuideMenuItem[] = [
    {
      id: 1,
      href: GUIDE_URL[ovhSubsidiary as OvhSubsidiary] || GUIDE_URL.DEFAULT,
      target: '_blank',
      children: t('web_hosting_header_guide_general_informations'),
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
        guideMenu: <GuideMenu items={guideItems} />,
      }}
      message={notifications.length ? <Notifications /> : null}
    >
      <Datagrid
        data-testid="websites-page-datagrid"
        columns={data ? displayColumns : []}
        containerHeight={500}
        data={data ?? []}
        isLoading={isLoading}
        hasNextPage={!isFetchingAllPages && hasNextPage}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
        autoScroll={false}
        onFetchAllPages={fetchAllPages}
        columnVisibility={{ columnVisibility, setColumnVisibility }}
        topbar={
          <div className="flex items-center gap-4">
            <Button
              variant={BUTTON_VARIANT.default}
              color={BUTTON_COLOR.primary}
              onClick={goToOrder}
              data-testid="websites-page-order-button"
            >
              <>
                {t('web_hosting_header_order')}
                <Icon className="ml-2" name={ICON_NAME.externalLink}></Icon>
              </>
            </Button>
            <div className="w-max px-0 py-2">
              <Popover
                aria-label="Export menu"
                position={POPOVER_POSITION.bottomStart}
                open={isExportPopoverOpen}
                onOpenChange={({ open }) => setIsExportPopoverOpen(open)}
              >
                <PopoverTrigger aria-haspopup="menu" asChild>
                  <Button
                    id="export-popover-trigger"
                    variant={BUTTON_VARIANT.outline}
                    data-testid="websites-page-export-button"
                    loading={isCSVLoading}
                  >
                    <>
                      <Icon
                        className="mr-2"
                        name={isExportPopoverOpen ? ICON_NAME.chevronUp : ICON_NAME.chevronDown}
                      />
                      {t('web_hosting_export_label')}
                    </>
                  </Button>
                </PopoverTrigger>
                <PopoverContent aria-label="Export menu" withArrow>
                  <div className="flex w-full flex-col p-2">
                    {actionItems.map((action) => (
                      <Button
                        key={action.id}
                        onClick={action.onClick}
                        variant={BUTTON_VARIANT.ghost}
                        role="menuitem"
                        data-testid={`websites-page-export-button-${action.id}`}
                        className="w-full justify-start"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        }
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
      />
    </BaseLayout>
  );
}
