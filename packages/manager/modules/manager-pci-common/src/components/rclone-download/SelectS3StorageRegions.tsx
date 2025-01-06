import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { OdsSelect, OdsSpinner } from '@ovhcloud/ods-components/react';
import { useS3StorageRegions } from '../../api/hook/useRegions';
import { TRegion } from '../../api/data';

interface SelectS3StorageRegionsProps {
  projectId: string;
  onS3StorageRegionChange: (value: string) => void;
}

export default function SelectS3StorageRegions({
  projectId,
  onS3StorageRegionChange,
}: Readonly<SelectS3StorageRegionsProps>) {
  const [currentRegion, setCurrentRegion] = useState('');

  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { data: s3StorageRegions, isLoading } = useS3StorageRegions(projectId);

  useEffect(() => {
    if (s3StorageRegions?.length) {
      setCurrentRegion(s3StorageRegions[0].name);
      onS3StorageRegionChange(s3StorageRegions[0].name);
    }
  }, [s3StorageRegions]);

  if (isLoading || !currentRegion) {
    return <OdsSpinner data-testid="s3StorageRegions_spinner" size="md" />;
  }

  return (
    <OdsSelect
      value={currentRegion}
      name="currentRegion"
      data-testid="s3StorageRegions_select"
      onOdsChange={(event) => {
        setCurrentRegion(`${event.detail.value}`);
        onS3StorageRegionChange(`${event.detail.value}`);
      }}
    >
      {s3StorageRegions?.map((region: TRegion, index: number) => (
        <option key={`${region.name}-${index}`} value={region.name}>
          {translateMicroRegion(region.name)}
        </option>
      ))}
    </OdsSelect>
  );
}
