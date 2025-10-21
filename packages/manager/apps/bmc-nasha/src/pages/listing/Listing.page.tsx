import React, { Suspense, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { BaseLayout, ManagerButton, useDataGrid, Datagrid, DataGridTextCell } from '@ovh-ux/manager-react-components';

import NashaCreateModal from '@/components/NashaCreateModal/NashaCreateModal';
import NashaDeleteModal from '@/components/NashaDeleteModal/NashaDeleteModal';
import NashaServiceCard from '@/components/NashaServiceCard/NashaServiceCard';
import { useNashaServices } from '@/data/api/hooks/useNashaServices';
import { urls } from '@/routes/Routes.constants';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    serviceDisplayName?: string;
  }>({
    isOpen: false,
    serviceName: '',
  });

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const { data, isLoading, error } = useNashaServices({
    page: pagination.pageIndex + 1,
    pageSize: 12,
    sortBy: sorting?.id || 'serviceName',
    sortDesc: sorting?.desc || false,
  });

  const handleViewDetails = (serviceName: string) => {
    navigate(`${urls.root}/dashboard/${serviceName}`);
  };

  const handleDelete = (serviceName: string, serviceDisplayName?: string) => {
    setDeleteModal({
      isOpen: true,
      serviceName,
      serviceDisplayName,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      serviceName: '',
    });
  };

  if (error) {
    return (
      <BaseLayout>
        <div className="text-center py-8">
          <OdsText preset="heading-3" color="error">
            {t('error_loading_services')}
          </OdsText>
          <OdsText preset="paragraph" color="neutral-600" className="mt-2">
            {String(error)}
          </OdsText>
        </div>
      </BaseLayout>
    );
  }

  const columns = useMemo(
    () => [
      {
        id: 'serviceName',
        label: t('service_name'),
        cell: (service: any) => (
          <DataGridTextCell>
            <ManagerButton
              id={`view-service-${service.serviceName}`}
              variant="ghost"
              label={service.serviceName}
              onClick={() => handleViewDetails(service.serviceName)}
            />
          </DataGridTextCell>
        ),
      },
      {
        id: 'datacenter',
        label: t('datacenter'),
        cell: (service: any) => <DataGridTextCell>{service.datacenter}</DataGridTextCell>,
      },
      {
        id: 'diskType',
        label: t('disk_type'),
        cell: (service: any) => <DataGridTextCell>{service.diskType || 'N/A'}</DataGridTextCell>,
      },
      {
        id: 'zpoolSize',
        label: t('size'),
        cell: (service: any) => <DataGridTextCell>{service.zpoolSize || 'N/A'}</DataGridTextCell>,
      },
      {
        id: 'zpoolCapacity',
        label: t('capacity'),
        cell: (service: any) => <DataGridTextCell>{service.zpoolCapacity || 'N/A'}</DataGridTextCell>,
      },
      {
        id: 'actions',
        label: t('actions'),
        cell: (service: any) => (
          <div className="flex gap-2">
            <ManagerButton
              id={`view-details-${service.serviceName}`}
              label={t('view_details')}
              iamActions={['nasha:read']}
              urn={`urn:v1:eu:nasha:${service.serviceName}`}
              onClick={() => handleViewDetails(service.serviceName)}
            />
            <ManagerButton
              id={`delete-${service.serviceName}`}
              label={t('delete')}
              iamActions={['nasha:delete']}
              urn={`urn:v1:eu:nasha:${service.serviceName}`}
              onClick={() => handleDelete(service.serviceName)}
            />
          </div>
        ),
      },
    ],
    [t, handleViewDetails, handleDelete],
  );

  return (
    <BaseLayout
      header={{
        title: t('title'),
        description: t('subtitle'),
        headerButton: (
          <div className="flex gap-2">
            <ManagerButton
              id="guides-button"
              label="Guides"
              icon="book"
              variant="ghost"
              onClick={() => window.open('https://docs.ovh.com/fr/storage/nas/decouverte/', '_blank')}
            />
            <ManagerButton
              id="create-nasha-service"
              label={t('create_service')}
              icon="plus"
              iamActions={['nasha:create']}
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        ),
      }}
    >
      <div className="space-y-6">

        {/* Services Datagrid */}
        <Datagrid
          columns={columns}
          items={data?.data || []}
          totalItems={data?.totalCount || 0}
          pagination={pagination}
          sorting={sorting}
          onPaginationChange={setPagination}
          onSortChange={setSorting}
          manualPagination
          manualSorting
          isLoading={isLoading}
          noResultLabel={t('no_services')}
        />
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        <NashaCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        <NashaDeleteModal
          isOpen={deleteModal.isOpen}
          serviceName={deleteModal.serviceName}
          serviceDisplayName={deleteModal.serviceDisplayName}
          onClose={handleCloseDeleteModal}
        />
      </Suspense>
    </BaseLayout>
  );
}
