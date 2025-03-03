import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { useStorageRegions } from '../../api/hook/useRegions';
import { StorageRegionSelector } from './StorageRegionSelector';

interface S3StorageRegionsProps {
  projectId: string;
  onStorageRegionChange: (value: string) => void;
}

export default function StorageRegions({
  projectId,
  onStorageRegionChange,
}: Readonly<S3StorageRegionsProps>) {
  const { t } = useTranslation('pci-rclone-download');
  const { data: storageRegions, isLoading } = useStorageRegions({ projectId });

  if (isLoading) {
    return <OdsSpinner data-testid="storageRegions_spinner" size="md" />;
  }

  return (
    <>
      <StorageRegionSelector
        regions={storageRegions}
        onRegionChange={onStorageRegionChange}
      />
      <OdsText preset="caption" className="mt-2">
        {t('pci_projects_project_users_download-rclone_region_help')}
      </OdsText>
    </>
  );
}
