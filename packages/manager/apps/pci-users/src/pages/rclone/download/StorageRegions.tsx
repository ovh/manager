import { useTranslation } from 'react-i18next';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';
import { useStorageRegions } from '@/api/hooks/useRegion';
import { getMacroRegion, Region } from '@/api/data/region';

interface S3StorageRegionsProps {
  projectId: string;
  onStorageRegionChange: (value: string) => void;
}

export default function StorageRegions({
  projectId,
  onStorageRegionChange,
}: S3StorageRegionsProps) {
  const { t } = useTranslation('region');
  const { t: tCommon } = useTranslation('common');
  const { data: storageRegions, isLoading } = useStorageRegions(`${projectId}`);
  const [currentRegion, setCurrentRegion] = useState('');
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
            data-testid={'currentRegionSelect'}
            onOdsValueChange={(event) => {
              const { value } = event.detail;
              setCurrentRegion(`${value}`);
              onStorageRegionChange(`${value}`);
            }}
          >
            {storageRegions?.map((region: Region, index: number) => (
              <OsdsSelectOption key={index} value={region.name}>
                {t(
                  `manager_components_region_${getMacroRegion(
                    region.name,
                  )}_micro`,
                  {
                    micro: region.name,
                  },
                )}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
          <OsdsText
            slot="helper"
            color={ODS_THEME_COLOR_INTENT.text}
            className={'mt-1'}
          >
            {tCommon('pci_projects_project_users_download-rclone_region_help')}
          </OsdsText>
        </>
      )}
    </>
  );
}
