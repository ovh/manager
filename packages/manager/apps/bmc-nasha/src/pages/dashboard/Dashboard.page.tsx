import React, { Suspense, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsSpinner, OdsTabs, OdsText } from '@ovhcloud/ods-components/react';

import { BaseLayout, ManagerButton, useBytes } from '@ovh-ux/manager-react-components';

import NashaAccessTab from '@/components/NashaAccessTab/NashaAccessTab';
import NashaPartitionsTab from '@/components/NashaPartitionsTab/NashaPartitionsTab';
import NashaQuotasTab from '@/components/NashaQuotasTab/NashaQuotasTab';
import NashaSnapshotsTab from '@/components/NashaSnapshotsTab/NashaSnapshotsTab';
import { useCreateNashaAccess, useDeleteNashaAccess } from '@/data/api/hooks/useNashaAccess';
import {
  useCreateNashaPartition,
  useDeleteNashaPartition,
} from '@/data/api/hooks/useNashaPartitions';
import { useNashaServiceDetails } from '@/data/api/hooks/useNashaServices';
import { urls } from '@/routes/Routes.constants';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { formatBytes } = useBytes();

  const [activeTab, setActiveTab] = useState('overview');

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
          <OdsText preset="body-2" color="neutral-600" className="mt-2">
            {error}
          </OdsText>
        </div>
      </BaseLayout>
    );
  }

  const service = data.service;
  const usagePercentage =
    service.zpoolSize > 0 ? (service.zpoolCapacity / service.zpoolSize) * 100 : 0;

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'partitions', label: t('partitions') },
    { id: 'access', label: t('access') },
    { id: 'snapshots', label: t('snapshots') },
    { id: 'quotas', label: t('quotas') },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Service Information */}
            <OdsCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <OdsIcon name={ODS_ICON_NAME.SERVER} size="lg" />
                  <div>
                    <OdsText preset="heading-2">
                      {service.customName || service.serviceName}
                    </OdsText>
                    <OdsText preset="body-2" color="neutral-600">
                      {service.serviceName}
                    </OdsText>
                  </div>
                </div>
                <ManagerButton
                  id="back-to-listing"
                  label={t('back_to_listing')}
                  onClick={() => navigate(urls.root)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <OdsText preset="caption-1" color="neutral-600" className="mb-1">
                    {t('status')}
                  </OdsText>
                  <OdsText preset="body-1">
                    {service.canCreatePartition ? t('active') : t('limited')}
                  </OdsText>
                </div>
                <div>
                  <OdsText preset="caption-1" color="neutral-600" className="mb-1">
                    {t('datacenter')}
                  </OdsText>
                  <OdsText preset="body-1">
                    {service.localeDatacenter || service.datacenter}
                  </OdsText>
                </div>
                <div>
                  <OdsText preset="caption-1" color="neutral-600" className="mb-1">
                    {t('disk_type')}
                  </OdsText>
                  <OdsText preset="body-1">{service.diskType.toUpperCase()}</OdsText>
                </div>
                <div>
                  <OdsText preset="caption-1" color="neutral-600" className="mb-1">
                    {t('monitoring')}
                  </OdsText>
                  <OdsText preset="body-1">
                    {service.monitored ? t('enabled') : t('disabled')}
                  </OdsText>
                </div>
              </div>
            </OdsCard>

            {/* Storage Usage */}
            <OdsCard className="p-6">
              <OdsText preset="heading-3" className="mb-4">
                {t('storage_usage')}
              </OdsText>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <OdsText preset="body-1">{t('used_space')}</OdsText>
                  <OdsText preset="body-1">
                    {formatBytes(service.zpoolCapacity * 1024 * 1024 * 1024)} /{' '}
                    {formatBytes(service.zpoolSize * 1024 * 1024 * 1024)}
                  </OdsText>
                </div>

                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-neutral-600">
                  <span>
                    {usagePercentage.toFixed(1)}% {t('used')}
                  </span>
                  <span>
                    {formatBytes((service.zpoolSize - service.zpoolCapacity) * 1024 * 1024 * 1024)}{' '}
                    {t('available')}
                  </span>
                </div>
              </div>
            </OdsCard>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OdsCard className="p-6 text-center">
                <OdsText preset="heading-2" className="text-primary-500">
                  {service.partitions?.length || 0}
                </OdsText>
                <OdsText preset="body-2" color="neutral-600">
                  {t('partitions')}
                </OdsText>
              </OdsCard>

              <OdsCard className="p-6 text-center">
                <OdsText preset="heading-2" className="text-primary-500">
                  {service.access?.length || 0}
                </OdsText>
                <OdsText preset="body-2" color="neutral-600">
                  {t('access_rules')}
                </OdsText>
              </OdsCard>

              <OdsCard className="p-6 text-center">
                <OdsText preset="heading-2" className="text-primary-500">
                  {service.snapshots?.length || 0}
                </OdsText>
                <OdsText preset="body-2" color="neutral-600">
                  {t('snapshots')}
                </OdsText>
              </OdsCard>
            </div>
          </div>
        );

      case 'partitions':
        return (
          <NashaPartitionsTab serviceName={serviceName} partitions={service.partitions || []} />
        );

      case 'access':
        return <NashaAccessTab serviceName={serviceName} access={service.access || []} />;

      case 'snapshots':
        return <NashaSnapshotsTab serviceName={serviceName} snapshots={service.snapshots || []} />;

      case 'quotas':
        return <NashaQuotasTab serviceName={serviceName} quotas={service.quotas || []} />;

      default:
        return null;
    }
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <OdsText preset="heading-1" className="mb-2">
              {service.customName || service.serviceName}
            </OdsText>
            <OdsText preset="body-1" color="neutral-600">
              {t('service_details')}
            </OdsText>
          </div>
        </div>

        {/* Tabs */}
        <OdsTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <Suspense fallback={<OdsSpinner />}>{renderTabContent()}</Suspense>
      </div>
    </BaseLayout>
  );
}
