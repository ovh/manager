import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { TLocalisation, useProjectRegions } from './useRegions';
import { RegionSelector } from './RegionSelector.component';

export interface RegionSelectorProps {
  projectId: string;
  onSelectRegion: (region?: TLocalisation) => void;
  regionFilter?: (region: TLocalisation) => boolean;
  compactMode?: boolean;
}

export function ProjectRegionSelector({
  projectId,
  ...otherProps
}: RegionSelectorProps) {
  const { data, isLoading } = useProjectRegions(projectId);

  if (isLoading) return <OsdsSpinner />;

  return <RegionSelector {...otherProps} regions={data} />;
}
