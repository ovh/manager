import { OdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { TLocalisation } from './useRegions';
import { RegionChipByType } from './RegionChipByType';

export interface RegionTileProps {
  region: TLocalisation;
  isSelected: boolean;
  isCompact?: boolean;
}

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
          <RegionChipByType type={region.type} />
        </div>
      </>
    )}
  </div>
);
