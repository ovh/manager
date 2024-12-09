import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useS3StorageRegions } from '../../api/hook/useRegions';
import { TRegion } from '../../api/data';

interface S3StorageRegionsProps {
  projectId: string;
  onS3StorageRegionChange: (value: string) => void;
}

export default function S3StorageRegions({
  projectId,
  onS3StorageRegionChange,
}: Readonly<S3StorageRegionsProps>) {
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
    return (
      <OsdsSpinner
        data-testid="s3StorageRegions_spinner"
        inline
        size={ODS_SPINNER_SIZE.md}
      />
    );
  }

  return (
    <OsdsSelect
      value={currentRegion}
      data-testid="s3StorageRegions_select"
      onOdsValueChange={(event) => {
        setCurrentRegion(`${event.detail.value}`);
        onS3StorageRegionChange(`${event.detail.value}`);
      }}
    >
      {s3StorageRegions?.map((region: TRegion, index: number) => (
        <OsdsSelectOption key={`${region.name}-${index}`} value={region.name}>
          {translateMicroRegion(region.name)}
        </OsdsSelectOption>
      ))}
    </OsdsSelect>
  );
}
