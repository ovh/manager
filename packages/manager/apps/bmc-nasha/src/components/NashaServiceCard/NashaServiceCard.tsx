/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerButton, ManagerText, ServiceStateBadge } from '@ovh-ux/manager-react-components';
import { OdsCard, OdsText, OdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useBytes } from '@ovh-ux/manager-react-components';
import type { NashaService } from '@/types/Nasha.type';

interface NashaServiceCardProps {
  service: NashaService;
  onViewDetails: (serviceName: string) => void;
  onDelete: (serviceName: string) => void;
  onUpdateName: (serviceName: string, customName: string) => void;
}

export default function NashaServiceCard({
  service,
  onViewDetails,
  onDelete,
  onUpdateName,
}: NashaServiceCardProps) {
  const { t } = useTranslation('listing');
  const { formatBytes } = useBytes();

  const getStatusColor = (canCreatePartition: boolean) => {
    return canCreatePartition ? 'success' : 'warning';
  };

  const getProtocolIcon = (diskType?: string) => {
    return diskType === 'ssd' ? ODS_ICON_NAME.STORAGE : ODS_ICON_NAME.SERVER;
  };

  return (
    <OdsCard className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <OdsIcon name={getProtocolIcon(service.diskType)} />
          <div>
            <OdsText preset="heading-4" className="mb-1">
              {service.customName || service.serviceName}
            </OdsText>
            <OdsText preset="paragraph" color="neutral-600">
              {service.serviceName}
            </OdsText>
          </div>
        </div>
        <ServiceStateBadge
          state={service.canCreatePartition ? 'active' : 'warning'}
          color={getStatusColor(service.canCreatePartition)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <OdsText preset="caption" color="neutral-600" className="mb-1">
            {t('datacenter')}
          </OdsText>
          <OdsText preset="paragraph">
            {service.datacenter}
          </OdsText>
        </div>
        <div>
          <OdsText preset="caption" color="neutral-600" className="mb-1">
            {t('disk_type')}
          </OdsText>
          <OdsText preset="paragraph">
            {service.diskType?.toUpperCase() || 'N/A'}
          </OdsText>
        </div>
        <div>
          <OdsText preset="caption" color="neutral-600" className="mb-1">
            {t('size')}
          </OdsText>
          <OdsText preset="paragraph">
            {service.diskSize || (service.zpoolSize ? formatBytes(service.zpoolSize * 1024 * 1024 * 1024) : 'N/A')}
          </OdsText>
        </div>
        <div>
          <OdsText preset="caption" color="neutral-600" className="mb-1">
            {t('capacity')}
          </OdsText>
          <OdsText preset="paragraph">
            {service.zpoolCapacity ? formatBytes(service.zpoolCapacity * 1024 * 1024 * 1024) : 'N/A'}
          </OdsText>
        </div>
      </div>

      {service.description && (
        <div className="mb-4">
          <OdsText preset="caption" color="neutral-600" className="mb-1">
            {t('description')}
          </OdsText>
          <OdsText preset="paragraph">
            {service.description}
          </OdsText>
        </div>
      )}

      <div className="flex gap-2">
        <ManagerButton
          id={`view-details-${service.serviceName}`}
          label={t('view_details')}
          iamActions={['nasha:read']}
          urn={`urn:v1:eu:nasha:${service.serviceName}`}
          onClick={() => onViewDetails(service.serviceName)}
        />
        <ManagerButton
          id={`delete-${service.serviceName}`}
          label={t('delete')}
          iamActions={['nasha:delete']}
          urn={`urn:v1:eu:nasha:${service.serviceName}`}
          onClick={() => onDelete(service.serviceName)}
        />
      </div>
    </OdsCard>
  );
}
