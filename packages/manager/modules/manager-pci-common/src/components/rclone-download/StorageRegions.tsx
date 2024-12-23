import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSelect, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { useStorageRegions } from '../../api/hook/useRegions';
import { TRegion } from '../../api/data/regions';

interface S3StorageRegionsProps {
  projectId: string;
  onStorageRegionChange: (value: string) => void;
}

export default function StorageRegions({
  projectId,
  onStorageRegionChange,
}: Readonly<S3StorageRegionsProps>) {
  const { t } = useTranslation('pci-rclone-download');

  const [currentRegion, setCurrentRegion] = useState('');

  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { data: storageRegions, isLoading } = useStorageRegions(projectId);

  useEffect(() => {
    if (storageRegions?.length) {
      setCurrentRegion(storageRegions[0].name);
      onStorageRegionChange(storageRegions[0].name);
    }
  }, [storageRegions]);

  if (isLoading || !currentRegion) {
    return <OdsSpinner data-testid="storageRegions_spinner" size="md" />;
  }

  return (
    <>
      <OdsSelect
        value={currentRegion}
        name="currentRegion"
        data-testid="storageRegions_select"
        onOdsChange={(event) => {
          const { value } = event.detail;
          setCurrentRegion(`${value}`);
          onStorageRegionChange(`${value}`);
        }}
      >
        {storageRegions?.map((region: TRegion, index: number) => (
          <option key={`${region.name}-${index}`} value={region.name}>
            {translateMicroRegion(region.name)}
          </option>
        ))}
      </OdsSelect>
      <OdsText slot="helper" color="text" className="mt-2">
        {t('pci_projects_project_users_download-rclone_region_help')}
      </OdsText>
    </>
  );
}
