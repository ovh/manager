import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { TLocalisation } from './useRegions';
import { RegionLocalzoneChip } from './RegionLocalzoneChip.component';
import { RegionGlobalzoneChip } from './RegionGlobalzoneChip.component';
import { Region3AZChip } from './Region3AZChip.component';

export interface RegionTileProps {
  region: TLocalisation;
  isSelected: boolean;
  isCompact?: boolean;
}

export const RegionChipByType = ({
  region,
}: Readonly<{ region: TLocalisation }>) => {
  switch (region.type) {
    case 'localzone':
      return <RegionLocalzoneChip />;
    case 'region':
      return <RegionGlobalzoneChip />;
    case 'region-3-az':
      return <Region3AZChip />;
    default:
      return null;
  }
};

export const RegionTile = ({
  region,
  isSelected,
  isCompact,
}: Readonly<RegionTileProps>) => (
  <div className="flex flex-col w-full items-center">
    <div className={isCompact ? 'my-4' : ''}>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={isSelected ? ODS_TEXT_SIZE._500 : ODS_TEXT_SIZE._400}
      >
        {region.isMacro ? region.macroLabel : region.microLabel}
      </OsdsText>
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
