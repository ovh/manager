import { useTranslation } from 'react-i18next';
import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { useEffect, useState } from 'react';
import { useStorageRegions } from '@/hooks/useRegion';
import { Region } from '@/data/region';

interface S3StorageRegionsProps {
  projectId: string;
  onStorageRegionChange: (value: string) => void;
}

export default function StorageRegions({
  projectId,
  onStorageRegionChange,
}: S3StorageRegionsProps) {
  const { t } = useTranslation('region');
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
        <OsdsSelect
          value={currentRegion}
          onOdsValueChange={(
            event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
          ) => {
            setCurrentRegion(`${event.detail.value}`);
            onStorageRegionChange(`${event.detail.value}`);
          }}
        >
          {storageRegions?.map((region: Region, index: number) => (
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
