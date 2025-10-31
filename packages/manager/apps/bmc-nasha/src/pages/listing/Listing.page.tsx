import { useState, useMemo, useCallback } from 'react';
import type { SortingState, VisibilityState } from '@tanstack/react-table';
import {
  BaseLayout,
  Button,
  Datagrid,
  ChangelogMenu,
  GuideMenu,
  useColumnFilters,
} from '@ovh-ux/muk';
import type { DatagridColumn } from '@ovh-ux/muk';
import type { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNashaServices } from '@/data/api/hooks/useNashaServices';
import { useUser } from '@/hooks/useUser';
import { CHANGELOG_LINKS, CHANGELOG_CHAPTERS } from '@/constants/Changelog.constants';
import { GUIDES_URL } from '@/constants/Guides.constants';
import type { NashaService } from '@/types/Nasha.type';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();
  const user = useUser();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    monitored: false,
    zpoolCapacity: false,
    zpoolSize: false,
  });

  // Extract sort column and direction from sorting state
  const sortBy = useMemo(() => {
    if (sorting.length === 0 || !sorting[0]) return undefined;
    return sorting[0].id as string;
  }, [sorting]);

  const sortDesc = useMemo(() => {
    if (sorting.length === 0 || !sorting[0]) return false;
    return sorting[0].desc ?? false;
  }, [sorting]);

  // Server-side pagination with reasonable page size (10 items per page for better UX)
  const pageSize = 10;

  // Column filters management
  const { filters: columnFilters, addFilter, removeFilter } = useColumnFilters();

  // Convert FilterWithLabel[] to Filter[] for API
  const apiFilters = useMemo<Filter[] | undefined>(() => {
    if (!columnFilters || columnFilters.length === 0) return undefined;
    return columnFilters.map((filter) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { label, ...filterWithoutLabel } = filter;
      return filterWithoutLabel;
    });
  }, [columnFilters]);

  // Adapters for FilterProps interface (ColumnFilterProps -> FilterWithLabel)
  const handleAddFilter = useCallback(
    (filterProps: { comparator: FilterComparator; key: string; label: string; value: string | string[] }) => {
      addFilter({
        key: filterProps.key,
        label: filterProps.label,
        comparator: filterProps.comparator,
        value: filterProps.value,
      });
    },
    [addFilter],
  );

  const handleRemoveFilter = useCallback(
    (filter: { key: string; comparator: FilterComparator; value?: string | string[] }) => {
      removeFilter({
        key: filter.key,
        comparator: filter.comparator,
        value: filter.value,
      });
    },
    [removeFilter],
  );

  const { data, isLoading, totalCount, hasNextPage, fetchNextPage } = useNashaServices({
    limit: pageSize,
    sortBy,
    sortDesc,
    filters: apiFilters,
  });

  const handleOrderClick = () => {
    trackClick({ actions: ['listing::add'] });
    window.open('https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/', '_blank');
  };


  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const guideUrl = useMemo(() => {
    if (!user?.ovhSubsidiary) {
      return GUIDES_URL.DEFAULT;
    }
    return GUIDES_URL[user.ovhSubsidiary as keyof typeof GUIDES_URL] || GUIDES_URL.DEFAULT;
  }, [user?.ovhSubsidiary]);

  const guideItems = useMemo(
    () => [
      {
        id: 1,
        href: guideUrl,
        target: '_blank',
        label: t('nasha_dashboard_guides_title', { defaultValue: 'Guides NAS-HA' }),
      },
    ],
    [guideUrl, t],
  );

  // Client-side search filtering (can be moved to server-side later if needed)
  const filteredData = useMemo(() => {
    if (!searchInput || !data) {
      return data || [];
    }
    const searchLower = searchInput.toLowerCase();
    return data.filter(
      (service) =>
        service.serviceName?.toLowerCase().includes(searchLower) ||
        service.customName?.toLowerCase().includes(searchLower) ||
        service.datacenter?.toLowerCase().includes(searchLower) ||
        service.diskType?.toLowerCase().includes(searchLower),
    );
  }, [data, searchInput]);

  const columns: DatagridColumn<NashaService>[] = [
    {
      id: 'serviceName',
      accessorKey: 'serviceName',
      header: t('nasha_directory_columns_header_serviceName', {
        defaultValue: 'ID Service',
      }),
      cell: ({ row }) => (
        <Link
          to={`../${row.original.serviceName}`}
          onClick={() => trackClick({ actions: ['listing::service-link'] })}
          className="text-blue-600 hover:underline"
        >
          {row.original.serviceName}
        </Link>
      ),
      enableHiding: false,
      isSearchable: true,
      isSortable: true,
    },
    {
      id: 'canCreatePartition',
      accessorKey: 'canCreatePartition',
      header: t('nasha_directory_columns_header_canCreatePartition', {
        defaultValue: 'Création de partition',
      }),
      cell: ({ row }) =>
        t(`nasha_directory_columns_header_canCreatePartition_${row.original.canCreatePartition}`, {
          defaultValue: row.original.canCreatePartition ? 'Autorisée' : 'Non autorisée',
        }),
      enableHiding: false,
      isSortable: true,
    },
    {
      id: 'customName',
      accessorKey: 'customName',
      header: t('nasha_directory_columns_header_customName', { defaultValue: 'Nom' }),
      enableHiding: false,
      isSearchable: true,
      isSortable: true,
    },
    {
      id: 'datacenter',
      accessorKey: 'datacenter',
      header: t('nasha_directory_columns_header_datacenter', {
        defaultValue: 'Localisation du datacenter',
      }),
      enableHiding: false,
      isSearchable: true,
      isSortable: true,
    },
    {
      id: 'diskType',
      accessorKey: 'diskType',
      header: t('nasha_directory_columns_header_diskType', { defaultValue: 'Type de disque' }),
      enableHiding: false,
      isSortable: true,
    },
    {
      id: 'monitored',
      accessorKey: 'monitored',
      header: t('nasha_directory_columns_header_monitored', { defaultValue: 'Monitoré' }),
      cell: ({ row }) =>
        t(`nasha_directory_columns_header_monitored_${row.original.monitored}`, {
          defaultValue: row.original.monitored ? 'Oui' : 'Non',
        }),
      enableHiding: true,
      isSortable: true,
    },
    {
      id: 'zpoolCapacity',
      accessorKey: 'zpoolCapacity',
      header: t('nasha_directory_columns_header_zpoolCapacity', {
        defaultValue: 'Capacité du Zpool',
      }),
      enableHiding: true,
      isSortable: true,
    },
    {
      id: 'zpoolSize',
      accessorKey: 'zpoolSize',
      header: t('nasha_directory_columns_header_zpoolSize', { defaultValue: 'Taille du Zpool' }),
      enableHiding: true,
      isSortable: true,
    },
  ];

  return (
    <BaseLayout
      header={{
        title: t('nasha_listing_title', { defaultValue: 'NAS-HA Services' }),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} chapters={[...CHANGELOG_CHAPTERS]} />,
        guideMenu: <GuideMenu items={guideItems} />,
      }}
    >
      <div className="mb-4 flex justify-end">
        <Button variant="default" onClick={handleOrderClick}>
          {t('nasha_listing_order', { defaultValue: 'Order a HA-NAS' })}
        </Button>
      </div>
      <Datagrid
        columns={columns as DatagridColumn<Record<string, unknown>>[]}
        data={filteredData as unknown as Record<string, unknown>[]}
        totalCount={totalCount ?? filteredData.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={{
          sorting,
          setSorting,
          manualSorting: false, // Server-side sorting is handled by useNashaServices
        }}
        search={{
          searchInput,
          setSearchInput,
          onSearch: handleSearch,
          placeholder: t('nasha_directory_search_placeholder', {
            defaultValue: 'Rechercher...',
          }),
        }}
        filters={{
          filters: columnFilters,
          add: handleAddFilter,
          remove: handleRemoveFilter,
        }}
        columnVisibility={{
          columnVisibility,
          setColumnVisibility,
        }}
      />
    </BaseLayout>
  );
}
