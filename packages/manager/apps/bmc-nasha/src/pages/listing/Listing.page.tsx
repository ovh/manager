import React, { Suspense, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { BaseLayout, ManagerButton, useDataGrid } from '@ovh-ux/manager-react-components';

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

  const { pagination, sorting } = useDataGrid();

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

  return (
    <BaseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <OdsText preset="heading-1" className="mb-2">
              {t('title')}
            </OdsText>
            <OdsText preset="paragraph" color="neutral-600">
              {t('subtitle')}
            </OdsText>
          </div>
          <ManagerButton
            id="create-nasha-service"
            label={t('create_service')}
            iamActions={['nasha:create']}
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Services Grid */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <OdsSpinner />
          </div>
        )}

        {!isLoading && data?.data && data.data.length === 0 && (
          <div className="text-center py-12">
            <OdsText preset="heading-3" className="mb-2">
              {t('no_services')}
            </OdsText>
            <OdsText preset="paragraph" color="neutral-600" className="mb-4">
              {t('no_services_description')}
            </OdsText>
            <ManagerButton
              id="create-first-service"
              label={t('create_first_service')}
              iamActions={['nasha:create']}
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        )}

        {!isLoading && data?.data && data.data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((service) => (
              <NashaServiceCard
                key={service.serviceName}
                service={service}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                onUpdateName={() => {}} // TODO: Implement update name functionality
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data?.totalCount && data.totalCount > pagination.pageSize && (
          <div className="flex justify-center">{/* TODO: Add pagination component */}</div>
        )}
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
