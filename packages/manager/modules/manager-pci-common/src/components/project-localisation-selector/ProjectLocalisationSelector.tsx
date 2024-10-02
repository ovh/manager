// import React from 'react';
// import { OsdsSpinner } from '@ovhcloud/ods-components/react';
// import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
// import { useRegionSelector } from '@/components/region-selector/useRegionSelector';
// import { TLocalisation } from '@/components/region-selector/useRegions';
// import { RegionSelector } from '@/components/region-selector/RegionSelector.component';

// export interface ProjectLocalisationSelectorProps {
//   projectId: string;
//   onSelectRegion: (region?: TLocalisation) => void;
//   regionFilter?: (region: TLocalisation) => boolean;
//   compactMode?: boolean;
// }
//
// export function ProjectLocalisationSelector({
//   projectId,
//   onSelectRegion,
//   regionFilter,
//   compactMode,
// }: ProjectLocalisationSelectorProps) {
//   const {
//     continents,
//     macroRegions,
//     microRegions,
//     selectContinent: setSelectedContinent,
//     selectMacroRegion,
//     selectMicroRegion,
//     selectedMacroRegion,
//     selectedMicroRegion,
//     isPending,
//   } = useRegionSelector({ projectId, onSelectRegion, regionFilter });
//
//   if (isPending) {
//     return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
//   }
//
//   return <RegionSelector compactMode={compactMode} />;
// }

export function ProjectLocalisationSelector() {
  return null;
}
