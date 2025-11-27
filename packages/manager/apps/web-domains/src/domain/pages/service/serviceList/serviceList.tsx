import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  ErrorBanner,
  useNotifications,
  Notifications,
  useResourcesIcebergV6,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';
import { download, generateCsv, mkConfig } from 'export-to-csv';
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
import appConfig from '@/web-domains.config';
import { DomainService } from '@/domain/types/domainResource';
import { useDomainDatagridColumns } from '@/domain/hooks/useDomainDatagridColumns';
import RenewRestoreModal from '@/domain/pages/service/serviceList/modalDrawer/RenewRestoreModal';
import { useDomainExport } from '@/domain/hooks/useDomainExport';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import TopBarCTA from './topBarCTA';
import ExportDrawer from './modalDrawer/exportDrawer';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import DomainGuideButton from './guideButton';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications, addError } = useNotifications();
  const [isModalOpenned, setIsModalOpenned] = useState(false);
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

  const { fetchDomainDetails, fetchAllDomains } = useDomainExport();
  const { nichandleInformation } = useNichandleInformation();

  const selectedServiceNames = Object.keys(rowSelection);

  const onOpenChange = ({ open }: ModalOpenChangeDetail) => {
    setIsModalOpenned(open);
  };

  const openModal = (serviceNames?: string[]) => {
    setModalServiceNames(serviceNames || selectedServiceNames);
    setIsModalOpenned(true);
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
    isError,
    filters,
    error,
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
  });

  const handleExport = async (selection: {
    domainColumns: string[];
    contactColumns: string[];
  }) => {
    setIsDrawerExportOpen(false);

    try {
      if (!selection || !selection.domainColumns || !selection.contactColumns) {
        throw new Error('Invalid selection');
      }

      let domainsToExport: DomainService[] = [];

      if (selectedServiceNames.length === 0) {
        setExportProgress({
          current: 0,
          total: 0,
          percentage: 0,
        });

        const data = await fetchAllDomains();
        domainsToExport = data.length > 0 ? data : domainResources || [];
      } else {
        domainsToExport = (domainResources || []).filter((domain) =>
          selectedServiceNames.includes(domain.domain),
        );
      }

      if (domainsToExport.length === 0) {
        setExportProgress(null);
        addError(
          t('domain_export_error_no_domains', 'No domains to export'),
          true,
        );
        return;
      }

      const totalDomains = domainsToExport.length;

      setExportProgress({
        current: 0,
        total: totalDomains,
        percentage: 0,
      });

      const exportData: Array<Record<string, string>> = [];
      let processedCount = 0;
      const BATCH_SIZE = 20;

      const batches = [];
      for (let i = 0; i < domainsToExport.length; i += BATCH_SIZE) {
        batches.push(domainsToExport.slice(i, i + BATCH_SIZE));
      }

      await batches.reduce(async (previousPromise, batch) => {
        await previousPromise;

        const batchResults = await Promise.all(
          batch.map((domain) =>
            fetchDomainDetails(domain, selection, nichandleInformation),
          ),
        );

        exportData.push(...batchResults);
        processedCount += batch.length;

        const percentage = Math.round((processedCount / totalDomains) * 100);
        setExportProgress({
          current: processedCount,
          total: totalDomains,
          percentage,
        });
      }, Promise.resolve());

      setExportProgress(null);

      const csvConfig = mkConfig({
        filename: `domains_export_${new Date().toISOString().split('T')[0]}`,
        fieldSeparator: ',',
        quoteStrings: true,
        useKeysAsHeaders: true,
      });

      const csv = generateCsv(csvConfig)(exportData);
      download(csvConfig)(csv);

      const csvString = typeof csv === 'string' ? csv : csv.toString();
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const filename = `${csvConfig.filename}.csv`;

      setExportDone({
        downloadUrl,
        filename,
        total: totalDomains,
      });
    } catch (exportError) {
      setExportProgress(null);
      addError(
        t('domain_export_error', { error: (exportError as Error).message }),
        true,
      );
    }
  };

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
          isLoading={isLoading}
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
          filters={filters}
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
