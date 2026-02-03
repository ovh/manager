import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  BaseLayout,
  ErrorBanner,
  useNotifications,
  Notifications,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';
import {
  ModalOpenChangeDetail,
  ProgressBar,
  Message,
  MessageBody,
  Link,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { VisibilityState } from '@tanstack/react-table';
import { Datagrid } from '@ovh-ux/muk';
import {
  useDomainDatagridColumns,
  DomainResourceDatagridData,
} from '@/domain/hooks/useDomainDatagridColumns';
import RenewRestoreModal from '@/domain/pages/service/serviceList/modalDrawer/RenewRestoreModal';
import { useDomainExportHandler } from '@/domain/hooks/useDomainExportHandler';
import { useDomainDataApiWithRouteParams } from '@/domain/hooks/useDomainDataApiWithRouteParams';
import TopBarCTA from './topBarCTA';
import ExportDrawer from './modalDrawer/exportDrawer';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import DomainGuideButton from './guideButton';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications } = useNotifications();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [isDrawerExportOpen, setIsDrawerExportOpen] = useState(false);
  const [modalServiceNames, setModalServiceNames] = useState<string[]>([]);
  const [exportProgress, setExportProgress] = useState<{
    current: number;
    total: number;
    percentage: number;
  } | null>(null);
  const [exportDone, setExportDone] = useState<{
    filename: string;
    downloadUrl: string;
    total: number;
  }>(null);
  const [exportAllServices, setExportAllServices] = useState(false);

  const selectedServiceNames = Object.keys(rowSelection);

  const onOpenChange = ({ open }: ModalOpenChangeDetail) => {
    setIsModalOpened(open);
  };

  const openModal = (serviceNames: string[]) => {
    setModalServiceNames(serviceNames);
    setIsModalOpened(true);
  };

  const openDrawer = (serviceNames: string[]) => {
    setModalServiceNames(serviceNames);
    setIsDrawerExportOpen(true);
    if (serviceNames?.length === 0) {
      setExportAllServices(true);
    } else {
      setExportAllServices(false);
    }
  };

  const domainColumns = useDomainDatagridColumns({
    openModal,
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const allowedVisibleColumns = new Set([
        'domain',
        'state',
        'suspensionState',
        'pendingActions',
        'renewFrequency',
        'expiration',
        'contactOwner.id',
        'actions',
      ]);

      return domainColumns.reduce<VisibilityState>((acc, column) => {
        if (column.id && !allowedVisibleColumns.has(column.id)) {
          acc[column.id] = false;
        }
        return acc;
      }, {});
    },
  );

  const {
    flattenData: domainResources,
    totalCount,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
    searchProps,
    filtersProps,
  } = useDomainDataApiWithRouteParams<DomainResourceDatagridData>({
    version: 'v2',
    baseRoute: '/domain/name',
    cacheKey: ['/domain/name'],
    defaultSorting: [{ id: 'id', desc: false }],
    disableCache: true,
    iceberg: false,
    pageSize: 10,
    enabled: true,
    columns: domainColumns,
  });

  const { handleExport } = useDomainExportHandler({
    exportAllServices,
    selectedServiceNames,
    domainResources,
    setExportProgress,
    setExportDone,
    setIsDrawerExportOpen,
  });

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: {
            message: error.message,
          },
        }}
      />
    );
  }

  return (
    <BaseLayout
      header={{
        title: t('title'),
        changelogButton: <ChangelogButton links={changelogLinks} />,
        headerButton: <DomainGuideButton />,
      }}
      message={notifications.length ? <Notifications /> : null}
    >
      {exportProgress && (
        <Message
          color="information"
          dismissible={false}
          className="w-full mb-4"
        >
          <MessageIcon name="circle-info" />
          <MessageBody>
            <Text preset={TEXT_PRESET.heading6}>
              {exportProgress.total === 0
                ? t('domain_table_progress_fetching')
                : t('domain_table_progress_exporting')}
            </Text>
            {exportProgress.total > 0 && (
              <>
                <ProgressBar value={exportProgress.percentage} max={100} />
                <div className="text-sm mt-2">
                  {exportProgress.current} / {exportProgress.total}{' '}
                  {t('domain_table_header_serviceName')}
                </div>
              </>
            )}
          </MessageBody>
        </Message>
      )}
      {exportDone && (
        <Message
          color="information"
          dismissible={false}
          className="w-full mb-4"
        >
          <MessageIcon name="circle-info" />
          <MessageBody>
            <Text preset={TEXT_PRESET.heading6}>
              {t('domain_export_done_title')}
            </Text>
            <Trans
              i18nKey={'domain_export_success'}
              count={exportDone.total}
              t={t}
              components={{
                Link: (
                  <Link
                    href={exportDone.downloadUrl}
                    download={exportDone.filename}
                    onClick={() => {
                      setTimeout(() =>
                        URL.revokeObjectURL(exportDone.downloadUrl),
                      );
                    }}
                  />
                ),
              }}
            />
          </MessageBody>
        </Message>
      )}
      {isDrawerExportOpen && (
        <div
          className="fixed inset-0 bg-[--ods-color-primary-500] opacity-75 z-40"
          onClick={() => setIsDrawerExportOpen(false)}
        />
      )}
      <Datagrid<DomainResourceDatagridData>
        autoScroll
        isLoading={isFetching || isLoading}
        sorting={sorting}
        columns={domainColumns}
        data={domainResources ?? ([] as DomainResourceDatagridData[])}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        totalCount={totalCount}
        search={searchProps}
        topbar={
          <TopBarCTA
            serviceNames={selectedServiceNames}
            openModal={openModal}
            openDrawer={openDrawer}
          />
        }
        rowSelection={{
          rowSelection,
          setRowSelection,
        }}
        columnVisibility={{
          columnVisibility,
          setColumnVisibility,
        }}
        resourceType="domain"
        filters={filtersProps}
      />
      <RenewRestoreModal
        isModalOpenned={isModalOpened}
        serviceNames={modalServiceNames}
        onOpenChange={onOpenChange}
      />
      <ExportDrawer
        serviceNames={modalServiceNames}
        isDrawerOpen={isDrawerExportOpen}
        onClose={() => setIsDrawerExportOpen(false)}
        onExport={handleExport}
      />
      <Outlet />
    </BaseLayout>
  );
}
