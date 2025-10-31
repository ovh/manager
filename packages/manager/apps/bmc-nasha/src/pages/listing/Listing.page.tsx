import { useState, useMemo } from 'react';
import {
  BaseLayout,
  Button,
  Datagrid,
  DatagridColumn,
  ChangelogMenu,
  GuideMenu,
} from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNashaServices } from '@/data/api/hooks/useNashaServices';
import { useUser } from '@/hooks/useUser';
import { CHANGELOG_LINKS, CHANGELOG_CHAPTERS } from '@/constants/Changelog.constants';
import { GUIDES_URL } from '@/constants/Guides.constants';
import type { NashaService } from '@/types/Nasha.type';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const user = useUser();

  const [sorting, setSorting] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    monitored: false,
    zpoolCapacity: false,
    zpoolSize: false,
  });

  const { data, isLoading, error } = useNashaServices({
    page: 1,
    pageSize: 1000, // Load all data for client-side filtering/pagination
    sortBy: undefined,
    sortDesc: false,
  });

  const handleOrderClick = () => {
    trackClick({ actions: ['listing::add'] });
    window.open('https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/', '_blank');
  };

  const handleServiceClick = (serviceName: string) => {
    trackClick({ actions: ['listing::service-link'] });
    navigate(`/${serviceName}`);
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

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchInput || !data?.data) {
      return data?.data || [];
    }
    const searchLower = searchInput.toLowerCase();
    return data.data.filter(
      (service) =>
        service.serviceName?.toLowerCase().includes(searchLower) ||
        service.customName?.toLowerCase().includes(searchLower) ||
        service.datacenter?.toLowerCase().includes(searchLower) ||
        service.diskType?.toLowerCase().includes(searchLower),
    );
  }, [data?.data, searchInput]);

  const columns: DatagridColumn<NashaService>[] = [
    {
      id: 'serviceName',
      accessorKey: 'serviceName',
      header: t('nasha_directory_columns_header_serviceName', {
        defaultValue: 'ID Service',
      }),
      cell: ({ row }) => (
        <button
          onClick={() => handleServiceClick(row.original.serviceName)}
          className="text-blue-600 hover:underline"
        >
          {row.original.serviceName}
        </button>
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
        headerButton: (
          <div className="flex items-center gap-2">
            <ChangelogMenu links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />
            <GuideMenu items={guideItems} />
          </div>
        ),
        cta: (
          <Button variant="default" onClick={handleOrderClick}>
            {t('nasha_listing_order', { defaultValue: 'Order a HA-NAS' })}
          </Button>
        ),
      }}
    >
      <Datagrid
        columns={columns}
        data={filteredData}
        totalCount={filteredData.length}
        isLoading={isLoading}
        sorting={{
          sorting,
          setSorting,
          manualSorting: false,
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
          filters: [],
          add: () => {},
          remove: () => {},
        }}
        columnVisibility={{
          columnVisibility,
          setColumnVisibility,
        }}
      />
    </BaseLayout>
  );
}
