import { useTranslation } from 'react-i18next';
import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useS3StorageRegions } from '@/api/hooks/useRegion';
import { getMacroRegion, Region } from '@/api/data/region';

interface S3StorageRegionsProps {
  projectId: string;
  onS3StorageRegionChange: (value: string) => void;
}

export default function S3StorageRegions({
  projectId,
  onS3StorageRegionChange,
}: S3StorageRegionsProps) {
  const { t } = useTranslation('region');
  const { data: s3StorageRegions, isLoading } = useS3StorageRegions(
    `${projectId}`,
  );
  const [currentRegion, setCurrentRegion] = useState('');
  useEffect(() => {
    if (s3StorageRegions?.length) {
      setCurrentRegion(s3StorageRegions[0].name);
      onS3StorageRegionChange(s3StorageRegions[0].name);
    }
  }, [s3StorageRegions]);
  return (
    <>
      {!isLoading && currentRegion && (
        <OsdsSelect
          value={currentRegion}
          data-testid={'currentRegionSelect'}
          onOdsValueChange={(event) => {
            setCurrentRegion(`${event.detail.value}`);
            onS3StorageRegionChange(`${event.detail.value}`);
          }}
        >
          {s3StorageRegions?.map((region: Region, index: number) => (
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
      )}
    </>
  );
}
