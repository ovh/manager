import { FC } from 'react';
import { TRegion } from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';
import { RegionTile } from '@/components/tile/RegionTile.component';

export type TAvailableMacroRegionsProps = DeepReadonly<{
  availableMacroRegions: TRegion[];
  getRegionLabel: (name: string, datacenter: string) => string;
  onRegionTileClick: ({ name, datacenter }: TRegion) => () => void;
  selectedRegionDatacenter?: string;
}>;

export const AvailableMacroRegions: FC<TAvailableMacroRegionsProps> = ({
  availableMacroRegions,
  selectedRegionDatacenter,
  getRegionLabel,
  onRegionTileClick,
}) => (
  <div className="grid gap-6 pt-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
    {availableMacroRegions.map((macroRegion) => (
      <div key={macroRegion.name}>
        <RegionTile
          label={getRegionLabel(macroRegion.name, macroRegion.datacenter)}
          isLocalzone={macroRegion.isLocalzone}
          isSelected={selectedRegionDatacenter === macroRegion.datacenter}
          onTileClick={onRegionTileClick(macroRegion)}
        />
      </div>
    ))}
  </div>
);
