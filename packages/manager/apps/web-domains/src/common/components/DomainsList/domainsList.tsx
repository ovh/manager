import { Trans, useTranslation } from 'react-i18next';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';
import {
  ProgressBar,
  Message,
  MessageBody,
  Link,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { Datagrid } from '@ovh-ux/muk';
import {
  DomainResourceDatagridData,
  useDomainDatagridColumns,
} from '@/domain/hooks/useDomainDatagridColumns';
import RenewRestoreModal from '@/common/components/DomainsList/modalDrawer/RenewRestoreModal';
import { useDomainExportHandler } from '@/domain/hooks/useDomainExportHandler';
import TopBarCTA from '@/common/components/DomainsList/topBarCTA';
import ExportDrawer from '@/common/components/DomainsList/modalDrawer/exportDrawer';
import { useDomainListModals } from '@/common/hooks/domainsList/useDomainListModals';
import { useDomainListExport } from '@/common/hooks/domainsList/useDomainListExport';
import { useDomainListState } from '@/common/hooks/domainsList/useDomainListState';
import { useDomainDataApiWithRouteParams } from '@/domain/hooks/useDomainDataApiWithRouteParams';

interface DomainsListProps {
  baseRoute: string;
  associateModalOpen?: boolean;
  isActionMenu: boolean;
  onAssociateModalChange?: (open: boolean) => void;
}

export default function DomainsList({
  baseRoute,
  isActionMenu,
  onAssociateModalChange,
}: DomainsListProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);

  const {
    isModalOpened,
    modalServiceNames: renewModalServiceNames,
    openModal,
    onOpenChange,
  } = useDomainListModals();

  const {
    isDrawerExportOpen,
    modalServiceNames: exportModalServiceNames,
    exportProgress,
    exportDone,
    exportAllServices,
    openDrawer,
    closeDrawer,
    setExportProgress,
    setExportDone,
    setIsDrawerExportOpen,
  } = useDomainListExport();

  const domainColumns = useDomainDatagridColumns({
    openModal,
  });

  const {
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    selectedServiceNames,
  } = useDomainListState(domainColumns);

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
    baseRoute,
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
    <section>
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
          onClick={closeDrawer}
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
            onAssociateModalChange={onAssociateModalChange}
            isActionMenu={isActionMenu}
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
        serviceNames={renewModalServiceNames}
        onOpenChange={onOpenChange}
      />
      <ExportDrawer
        serviceNames={exportModalServiceNames}
        isDrawerOpen={isDrawerExportOpen}
        onClose={closeDrawer}
        onExport={handleExport}
      />
      <Outlet />
    </section>
  );
}
