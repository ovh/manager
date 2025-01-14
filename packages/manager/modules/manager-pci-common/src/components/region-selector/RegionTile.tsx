import { OdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { ComponentType } from 'react';
import { TLocalisation } from './useRegions';
import { RegionLocalzoneChip } from './RegionLocalzoneChip.component';
import { RegionGlobalzoneChip } from './RegionGlobalzoneChip.component';
import { Region3AZChip } from './Region3AZChip.component';

export interface RegionTileProps {
  region: TLocalisation;
  isSelected: boolean;
  isCompact?: boolean;
}

const CHIP_BY_TYPE: Record<TLocalisation['type'], ComponentType> = {
  localzone: RegionLocalzoneChip,
  region: RegionGlobalzoneChip,
  'region-3-az': Region3AZChip,
};

export const RegionChipByType = ({
  region,
}: Readonly<{ region: TLocalisation }>) => {
  const Chip = CHIP_BY_TYPE[region.type];
  return Chip ? <Chip /> : null;
};

export const RegionTile = ({
  region,
  isSelected,
  isCompact,
}: Readonly<RegionTileProps>) => (
  <div className="flex flex-col w-full items-center">
    <div className={isCompact ? 'my-4' : ''}>
      <OdsText preset="span" className={clsx(isSelected && 'font-bold')}>
        {region.isMacro ? region.macroLabel : region.microLabel}
      </OdsText>
    </div>
    {!isCompact && (
      <>
        <hr className="w-full border-solid border-0 border-b border-ods-primary-200" />
        <div>
          <RegionChipByType region={region} />
        </div>
      </>
    )}
  </div>
);
