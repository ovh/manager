import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useS3StorageRegions } from '../../api/hook/useRegions';

interface S3StorageRegionsProps {
  projectId: string;
  onS3StorageRegionChange: (value: string) => void;
}

export default function S3StorageRegions({
  projectId,
  onS3StorageRegionChange,
}: S3StorageRegionsProps) {
  const [currentRegion, setCurrentRegion] = useState('');

  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { data: s3StorageRegions, isLoading } = useS3StorageRegions(
    `${projectId}`,
  );

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
          data-testid="currentRegionSelect"
          onOdsValueChange={(event) => {
            setCurrentRegion(`${event.detail.value}`);
            onS3StorageRegionChange(`${event.detail.value}`);
          }}
        >
          {s3StorageRegions?.map((region: TRegion, index: number) => (
            <OsdsSelectOption key={index} value={region.name}>
              {translateMicroRegion(region.name)}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      )}
    </>
  );
}
