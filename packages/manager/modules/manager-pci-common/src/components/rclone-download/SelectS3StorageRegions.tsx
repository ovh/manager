import React from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { useS3StorageRegions } from '../../api/hook/useRegions';
import { StorageRegionSelector } from './StorageRegionSelector';

interface SelectS3StorageRegionsProps {
  projectId: string;
  onS3StorageRegionChange: (value: string) => void;
}

export default function SelectS3StorageRegions({
  projectId,
  onS3StorageRegionChange,
}: Readonly<SelectS3StorageRegionsProps>) {
  const { data: s3StorageRegions, isLoading } = useS3StorageRegions(projectId);

  if (isLoading) {
    return <OdsSpinner data-testid="s3StorageRegions_spinner" size="md" />;
  }

  return (
    <StorageRegionSelector
      regions={s3StorageRegions}
      onRegionChange={onS3StorageRegionChange}
    />
  );
}
