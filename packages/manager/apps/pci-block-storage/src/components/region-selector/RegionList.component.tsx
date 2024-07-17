import { OsdsTile } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { TLocalisation } from '@/api/hooks/useRegions';
import {
  regionContainer,
  regionTile,
  regionTileSelected,
} from './style.constant';

export interface RegionListProps {
  regions: TLocalisation[];
  selectedRegion: TLocalisation;
  onClick: (region: TLocalisation) => void;
  render: (region: TLocalisation, isSelected: boolean) => JSX.Element | string;
}

export function RegionList({
  regions,
  selectedRegion,
  onClick,
  render,
}: RegionListProps): JSX.Element {
  return (
    <ul className={regionContainer}>
      {regions.map((region) => (
        <li className="w-full px-1" key={region.name}>
          <OsdsTile
            className={clsx(
              regionTile,
              region === selectedRegion && regionTileSelected,
            )}
            checked={selectedRegion === region}
            onClick={() => onClick(region)}
          >
            {render(region, selectedRegion === region)}
          </OsdsTile>
        </li>
      ))}
    </ul>
  );
}
