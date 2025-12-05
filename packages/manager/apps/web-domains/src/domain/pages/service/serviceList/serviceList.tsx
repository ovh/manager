import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Datagrid,
  BaseLayout,
  ErrorBanner,
  useNotifications,
  Notifications,
  useResourcesIcebergV6,
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
import { toASCII } from 'punycode';
import { FilterWithLabel } from '@ovh-ux/manager-react-components/dist/types/src/components/filters/interface';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import {
  DomainService,
  DomainServiceStateEnum,
} from '@/domain/types/domainResource';
import { useDomainDatagridColumns } from '@/domain/hooks/useDomainDatagridColumns';
import RenewRestoreModal from '@/domain/pages/service/serviceList/modalDrawer/RenewRestoreModal';
import { useDomainExportHandler } from '@/domain/hooks/useDomainExportHandler';
import TopBarCTA from './topBarCTA';
import ExportDrawer from './modalDrawer/exportDrawer';
import {
  changelogLinks,
  ONGOING_PROCEEDINGS,
} from '@/domain/constants/serviceDetail';
import DomainGuideButton from './guideButton';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications } = useNotifications();
  const [isModalOpenned, setIsModalOpened] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [searchInput, setSearchInput] = useState('');
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

  const selectedServiceNames = Object.keys(rowSelection);

  const onOpenChange = ({ open }: ModalOpenChangeDetail) => {
    setIsModalOpened(open);
  };

  const openModal = (serviceNames?: string[]) => {
    setModalServiceNames(serviceNames || selectedServiceNames);
    setIsModalOpened(true);
  };

  const openDrawer = (serviceNames?: string[]) => {
    setModalServiceNames(serviceNames || selectedServiceNames);
    setIsDrawerExportOpen(true);
  };

  const domainColumns = useDomainDatagridColumns({
    openModal,
  });

  const {
    flattenData: domainResources,
    isLoading,
    isFetching,
    isError,
    error,
    filters,
    totalCount,
    hasNextPage,
    fetchNextPage,
    sorting,
    setSorting,
    search,
  } = useResourcesIcebergV6<DomainService>({
    columns: domainColumns,
    route: '/domain',
    queryKey: ['/domain'],
    disableCache: true,
  });

  const { handleExport } = useDomainExportHandler({
    selectedServiceNames,
    domainResources,
    setExportProgress,
    setExportDone,
    setIsDrawerExportOpen,
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      search.setSearchInput(toASCII(searchInput.toLowerCase()));
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    search.onSearch(search.searchInput);
  }, [search.searchInput]);

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
                      setTimeout(
                        () => URL.revokeObjectURL(exportDone.downloadUrl),
                        1000,
                      );
                    }}
                  ></Link>
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
      <div data-testid="datagrid">
        <Datagrid
          isLoading={isLoading || isFetching}
          columns={domainColumns}
          items={domainResources || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
          getRowId={(row) => row.domain}
          rowSelection={{
            rowSelection,
            setRowSelection,
          }}
          topbar={
            <TopBarCTA
              serviceNames={selectedServiceNames}
              openModal={openModal}
              openDrawer={openDrawer}
            />
          }
          columnVisibility={[
            'domain',
            'state',
            'suspensionState',
            'pendingActions',
            'renewFrequency',
            'expiration',
            'contactOwner',
            'actions',
          ]}
          search={{
            searchInput,
            setSearchInput,
            onSearch: () => null,
          }}
          filters={{
            filters: filters.filters,
            add: (filter: FilterWithLabel) => {
              if (
                filter.key === 'state' &&
                filter.value === ONGOING_PROCEEDINGS
              ) {
                filters.add({
                  ...filter,
                  comparator: FilterComparator.IsIn,
                  value: [
                    DomainServiceStateEnum.REGISTRY_SUSPENDED,
                    DomainServiceStateEnum.DISPUTE,
                    DomainServiceStateEnum.TECHNICAL_SUSPENDED,
                  ],
                });
                return;
              }
              filters.add(filter);
            },
            remove: filters.remove,
          }}
        />
        <RenewRestoreModal
          isModalOpenned={isModalOpenned}
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
      </div>
    </BaseLayout>
  );
}
