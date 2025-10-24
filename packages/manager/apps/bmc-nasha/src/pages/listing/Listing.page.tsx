import { useState } from 'react';
import {
  BaseLayout,
  Button,
  Datagrid,
  DatagridColumn,
} from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNashaServices } from '@/data/api/hooks/useNashaServices';
import type { NashaService } from '@/types/Nasha.type';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState(undefined);

  const { data, isLoading, error } = useNashaServices({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: undefined,
    sortDesc: false,
  });

  const handleOrderClick = () => {
    trackClick({ actions: ['listing::add'] });
    window.open('https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/', '_blank');
  };

  const handleServiceClick = (serviceName: string) => {
    trackClick({ actions: ['listing::service-link'] });
    navigate(`/bmc-nasha/${serviceName}`);
  };

  const columns: DatagridColumn<NashaService>[] = [
    {
      id: 'serviceName',
      accessorKey: 'serviceName',
      header: t('nasha_listing_serviceName'),
      cell: ({ row }) => (
        <button
          onClick={() => handleServiceClick(row.original.serviceName)}
          className="text-blue-600 hover:underline"
        >
          {row.original.serviceName}
        </button>
      ),
    },
    {
      id: 'customName',
      accessorKey: 'customName',
      header: t('nasha_listing_customName'),
    },
    {
      id: 'datacenter',
      accessorKey: 'datacenter',
      header: t('nasha_listing_datacenter'),
    },
    {
      id: 'diskType',
      accessorKey: 'diskType',
      header: t('nasha_listing_diskType'),
    },
    {
      id: 'canCreatePartition',
      accessorKey: 'canCreatePartition',
      header: t('nasha_listing_canCreatePartition'),
      cell: ({ row }) =>
        t(`nasha_listing_canCreatePartition_${row.original.canCreatePartition}`),
    },
  ];

  return (
    <BaseLayout
      header={{
        title: t('nasha_listing_title', { defaultValue: 'NAS-HA Services' }),
      }}
    >
      <div className="mb-4">
        <Button variant="default" onClick={handleOrderClick}>
          {t('nasha_listing_order', { defaultValue: 'Order a HA-NAS' })}
        </Button>
      </div>
      <Datagrid
        columns={columns}
        data={data?.data || []}
        totalCount={data?.totalCount || 0}
        isLoading={isLoading}
      />
    </BaseLayout>
  );
}
