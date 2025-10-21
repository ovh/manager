import React, { Suspense, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsSpinner, OdsTabs, OdsTab, OdsText } from '@ovhcloud/ods-components/react';

import { BaseLayout } from '@ovh-ux/manager-react-components';

import { DashboardHeader } from '@/components/DashboardHeader';
import { GeneralInformationTab } from '@/pages/dashboard/tabs/GeneralInformation.tab';
import { PartitionsTab } from '@/pages/dashboard/tabs/Partitions.tab';
import { useNashaServiceDetails } from '@/data/api/hooks/useNashaServices';
import { urls } from '@/routes/Routes.constants';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('general-information');

  const { data, isLoading, error } = useNashaServiceDetails(serviceName || '');

  if (!serviceName) {
    return (
      <BaseLayout>
        <div className="text-center py-8">
          <OdsText preset="heading-3" color="error">
            {t('service_not_found')}
          </OdsText>
        </div>
      </BaseLayout>
    );
  }

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="flex justify-center py-8">
          <OdsSpinner />
        </div>
      </BaseLayout>
    );
  }

  if (error || !data?.service) {
    return (
      <BaseLayout>
        <div className="text-center py-8">
          <OdsText preset="heading-3" color="error">
            {t('error_loading_service')}
          </OdsText>
          <OdsText preset="paragraph" color="neutral-600" className="mt-2">
            {String(error)}
          </OdsText>
        </div>
      </BaseLayout>
    );
  }

  const service = data.service;

  const handleEditName = () => {
    // TODO: Implement edit name modal
    console.log('Edit name clicked');
  };

  const handleGoToPartitions = () => {
    setActiveTab('partitions');
  };

  const handlePartitionCreate = () => {
    // TODO: Implement partition creation
    console.log('Create partition clicked');
  };

  const handlePartitionDelete = (partition: any) => {
    // TODO: Implement partition deletion
    console.log('Delete partition:', partition);
  };

  const handlePartitionEditSize = (partition: any) => {
    // TODO: Implement partition size edit
    console.log('Edit partition size:', partition);
  };

  const handlePartitionZfsOptions = (partition: any) => {
    // TODO: Implement ZFS options
    console.log('ZFS options:', partition);
  };

  const tabs = [
    { id: 'general-information', label: t('general_information') },
    { id: 'partitions', label: t('partitions') },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general-information':
        return (
          <GeneralInformationTab
            service={service}
            onEditName={handleEditName}
            onGoToPartitions={handleGoToPartitions}
          />
        );

      case 'partitions':
        return (
          <PartitionsTab
            serviceName={serviceName}
            partitions={service.partitions || []}
            onPartitionCreate={handlePartitionCreate}
            onPartitionDelete={handlePartitionDelete}
            onPartitionEditSize={handlePartitionEditSize}
            onPartitionZfsOptions={handlePartitionZfsOptions}
          />
        );

      default:
        return null;
    }
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        {/* Header avec nom éditable + guides */}
        <DashboardHeader
          serviceName={service.serviceName}
          customName={service.customName}
          onEditName={handleEditName}
          guides={[
            {
              id: 'getting-started',
              link: 'https://docs.ovh.com/fr/storage/nas/decouverte/',
              title: t('nasha_onboarding_getting-started_title'),
              description: t('nasha_onboarding_getting-started_content'),
            },
          ]}
        />

        {/* Tabs navigation ODS */}
        <OdsTabs>
          {tabs.map((tab) => (
            <OdsTab
              key={tab.id}
              id={tab.id}
              isSelected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </OdsTab>
          ))}
        </OdsTabs>

        {/* Tab Content */}
        <Suspense fallback={<OdsSpinner />}>{renderTabContent()}</Suspense>
      </div>
    </BaseLayout>
  );
}
