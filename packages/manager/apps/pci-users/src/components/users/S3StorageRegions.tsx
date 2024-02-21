import { useTranslation } from 'react-i18next';
import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { useEffect, useState } from 'react';
import { useS3StorageRegions } from '@/hooks/useRegion';
import { Region } from '@/data/region';

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
    if (s3StorageRegions) {
      setCurrentRegion(s3StorageRegions[0].name);
      onS3StorageRegionChange(s3StorageRegions[0].name);
    }
  }, [s3StorageRegions]);
  return (
    <>
      {!isLoading && currentRegion && (
        <OsdsSelect
          value={currentRegion}
          onOdsValueChange={(
            event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
          ) => {
            setCurrentRegion(`${event.detail.value}`);
            onS3StorageRegionChange(`${event.detail.value}`);
          }}
        >
          {s3StorageRegions?.map((region: Region, index: number) => (
            <OsdsSelectOption key={index} value={region.name}>
              {t(`manager_components_region_${region.name}_micro`, {
                micro: region.name,
              })}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      )}
    </>
  );
}
