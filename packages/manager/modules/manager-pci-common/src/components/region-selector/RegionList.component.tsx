import clsx from 'clsx';
import { OdsCard } from '@ovhcloud/ods-components/react';
import { TLocalisation } from './useRegions';
import {
  regionContainer,
  regionTile,
  regionTileSelected,
} from './style.constants';

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
          <OdsCard
            className={clsx(
              regionTile,
              region === selectedRegion && regionTileSelected,
            )}
            onClick={() => onClick(region)}
            data-testid={`region-${region.name}`}
          >
            {render(region, selectedRegion === region)}
          </OdsCard>
        </li>
      ))}
    </ul>
  );
}
