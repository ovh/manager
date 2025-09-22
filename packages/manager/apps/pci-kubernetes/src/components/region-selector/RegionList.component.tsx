import { ReactElement } from 'react';

import clsx from 'clsx';

import { OsdsTile } from '@ovhcloud/ods-components/react';

import { TLocation } from '@/types/region';

export type RegionListProps = {
  regions: TLocation[];
  selectedRegion: string | null;
  onClick: (region: TLocation) => void;
  render: (region: TLocation, isSelected: boolean) => ReactElement | string;
  isUnselectableRegion?: boolean;
};

export const regionContainerClassName = 'grid gap-6 list-none p-6 m-0 grid-cols-1 md:grid-cols-3';

export const regionTile =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';

export const regionTileSelected =
  'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';

export function RegionList({
  regions,
  selectedRegion,
  onClick,
  render,
  isUnselectableRegion,
}: RegionListProps): ReactElement {
  const isDisabledRegion = (region: TLocation) => isUnselectableRegion && !region.enabled;

  return (
    <ul className={regionContainerClassName}>
      {regions.map((region) => (
        <li className="w-full px-1" key={region.name}>
          <OsdsTile
            disabled={isDisabledRegion(region) || undefined}
            className={clsx(regionTile, region.name === selectedRegion && regionTileSelected)}
            checked={selectedRegion === region.name}
            onClick={() => !isDisabledRegion(region) && onClick(region)}
            data-testid={`region-${region.name}`}
          >
            {render(region, selectedRegion === region.name)}
          </OsdsTile>
        </li>
      ))}
    </ul>
  );
}
