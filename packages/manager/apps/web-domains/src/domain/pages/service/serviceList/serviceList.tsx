import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  BaseLayout,
  ErrorBanner,
  useNotifications,
  Notifications,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { Outlet, useSearchParams } from 'react-router-dom';
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
import { toASCII } from 'punycode';
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
import { Datagrid, SearchProps } from '@ovh-ux/muk';
import {
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications } = useNotifications();
  const [isModalOpenned, setIsModalOpenned] = useState(false);
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
    isError,
    filters: hookFilters,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
  } = useDomainDataApiWithRouteParams<DomainResourceDatagridData>({
    version: 'v2',
    baseRoute: '/domain/name',
    cacheKey: ['/domain/name'],
    disableCache: true,
    defaultSorting: [{ id: 'id', desc: false }],
    iceberg: true,
    enabled: true,
    fetchAll: true,
  });

  // Local search synced to URL so v2 route includes ?searchValue=...
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>(
    urlSearchParams.get('search') || '',
  );
  const searchProps: SearchProps = {
    onSearch: (value?: string) => {
      const next = new URLSearchParams(urlSearchParams);
      if (value && value.length > 0) {
        next.set('search', value);
      } else {
        next.delete('search');
      }
      setUrlSearchParams(next, { replace: true });
      setSearchInput(value ?? '');
    },
    searchInput,
    setSearchInput,
  };

  // Build Datagrid filters that sync to URL (v2 params)
  type Filter = {
    key: string;
    value: string | string[];
    comparator: FilterComparator;
  };
  type FilterWithLabel = Filter & { label: string };

  const filterKeyToApiParam: Record<string, string> = {
    'contactOwner.id': 'contactOwner',
    'contactAdministrator.id': 'contactAdministrator',
    'contactTechnical.id': 'contactTechnical',
    'contactBilling.id': 'contactBilling',
    state: 'mainState',
    suspensionState: 'additionalStates',
  };

  const urlFilters: FilterWithLabel[] = useMemo(() => {
    const acc: FilterWithLabel[] = [];
    Object.entries(filterKeyToApiParam).forEach(([columnKey, apiKey]) => {
      const v = urlSearchParams.get(`filter_${apiKey}`);
      if (v && v.length > 0) {
        const col = domainColumns.find((c) => c.id === columnKey);
        const label =
          typeof col?.header === 'string' ? (col?.header as string) : '';
        const value = v.includes(',') ? v.split(',') : v;
        acc.push({
          key: columnKey,
          value,
          comparator: FilterComparator.IsEqual,
          label,
        });
      }
    });
    return acc;
  }, [urlSearchParams, domainColumns]);

  const filtersProps = {
    filters: [...urlFilters, ...(hookFilters?.filters ?? [])],
    add: (filter: FilterWithLabel) => {
      // Route tags to hook; everything else to URL
      if (filter.key === 'iam.tags') {
        hookFilters?.add?.(filter as any);
        return;
      }
      const apiKey = filterKeyToApiParam[filter.key] ?? filter.key;
      const next = new URLSearchParams(urlSearchParams);
      if (Array.isArray(filter.value)) {
        if (filter.value.length > 0)
          next.set(`filter_${apiKey}`, filter.value.join(','));
      } else if (filter.value) {
        next.set(`filter_${apiKey}`, String(filter.value));
      }
      setUrlSearchParams(next, { replace: true });
    },
    remove: (filter: Filter) => {
      if (filter.key === 'iam.tags') {
        hookFilters?.remove?.(filter as any);
        return;
      }
      const apiKey = filterKeyToApiParam[filter.key] ?? filter.key;
      const next = new URLSearchParams(urlSearchParams);
      next.delete(`filter_${apiKey}`);
      setUrlSearchParams(next, { replace: true });
    },
  };

  // Reconstruct tags filters from iamTags query param and sync with hook filters
  useEffect(() => {
    const iamTagsParam = urlSearchParams.get('iamTags');
    const tagsColumn = domainColumns.find((c) => c.id === 'iam.tags');
    const tagsLabel =
      typeof tagsColumn?.header === 'string'
        ? (tagsColumn.header as string)
        : 'Tags';

    // Parse URL iamTags into a normalized array of tag filters
    let parsed: Array<{
      tagKey: string;
      operator: string;
      value?: string;
    }> = [];
    try {
      if (iamTagsParam) {
        const obj = JSON.parse(iamTagsParam) as Record<
          string,
          Array<{ operator: string; value?: string }>
        >;
        Object.entries(obj).forEach(([tagKey, entries]) => {
          entries.forEach(({ operator, value }) => {
            parsed.push({ tagKey, operator, value });
          });
        });
      }
    } catch {
      // Ignore malformed iamTags
      parsed = [];
    }

    const existing = (hookFilters?.filters || []).filter(
      (f: any) => f?.key === 'iam.tags',
    );

    const sig = (arr: typeof parsed) =>
      JSON.stringify(
        arr
          .map((e) => ({ k: e.tagKey, o: e.operator, v: e.value || '' }))
          .sort((a, b) => (a.k + a.o + a.v).localeCompare(b.k + b.o + b.v)),
      );

    const existingSig = sig(
      existing.map((f: any) => ({
        tagKey: f.tagKey,
        operator: f.comparator,
        value: f.value,
      })),
    );
    const parsedSig = sig(parsed);

    if (existingSig === parsedSig) return;

    // Clear current iam.tags filters
    existing.forEach((f: any) => hookFilters?.remove?.(f));

    // Add from URL
    parsed.forEach(({ tagKey, operator, value }) => {
      hookFilters?.add?.({
        key: 'iam.tags',
        label: tagsLabel,
        comparator: (operator as unknown) as FilterComparator,
        value: value,
        type: FilterTypeCategories.Tags,
        tagKey,
      } as any);
    });
  }, [urlSearchParams, domainColumns, hookFilters]);

  const { handleExport } = useDomainExportHandler({
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
        isLoading={isLoading}
        columns={domainColumns}
        data={(domainResources ?? []) as DomainResourceDatagridData[]}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={sorting}
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
        filters={filtersProps}
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
    </BaseLayout>
  );
}
