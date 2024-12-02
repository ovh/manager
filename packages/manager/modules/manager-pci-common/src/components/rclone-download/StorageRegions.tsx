import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStorageRegions } from '../../api/hook/useRegions';
import { TRegion } from '../../api/data/regions';

interface S3StorageRegionsProps {
  projectId: string;
  onStorageRegionChange: (value: string) => void;
}

export default function StorageRegions({
  projectId,
  onStorageRegionChange,
}: S3StorageRegionsProps) {
  const { t } = useTranslation('pci-rclone-download');

  const [currentRegion, setCurrentRegion] = useState('');

  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { data: storageRegions, isLoading } = useStorageRegions(`${projectId}`);

  useEffect(() => {
    if (storageRegions?.length) {
      setCurrentRegion(storageRegions[0].name);
      onStorageRegionChange(storageRegions[0].name);
    }
  }, [storageRegions]);

  return (
    <>
      {!isLoading && currentRegion && (
        <>
          <OsdsSelect
            value={currentRegion}
            data-testid="currentRegionSelect"
            onOdsValueChange={(event) => {
              const { value } = event.detail;
              setCurrentRegion(`${value}`);
              onStorageRegionChange(`${value}`);
            }}
          >
            {storageRegions?.map((region: TRegion, index: number) => (
              <OsdsSelectOption key={index} value={region.name}>
                {translateMicroRegion(region.name)}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
          <OsdsText
            slot="helper"
            color={ODS_THEME_COLOR_INTENT.text}
            className="mt-2"
          >
            {t('pci_projects_project_users_download-rclone_region_help')}
          </OsdsText>
        </>
      )}
    </>
  );
}
