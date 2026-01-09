import { upperFirst } from 'lodash/fp';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';

import { RegionChipByType } from '@ovh-ux/manager-pci-common';

import useStandardPlanAvailable from '@/hooks/useStandardPlanAvailable';
import { TClusterPlanEnum } from '@/types/index';
import { TLocation } from '@/types/region';

export interface RegionTileProps {
  region: TLocation;
  isSelected: boolean;
  isCompact?: boolean;
  plans: TClusterPlanEnum[];
}

export const RegionTile = ({ region, isSelected, isCompact, plans }: Readonly<RegionTileProps>) => {
  const standardIsActivated = useStandardPlanAvailable();

  return (
    <div className="flex w-full flex-col items-center">
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
          <hr className="border-ods-primary-200 w-full border-0 border-b border-solid" />
          <div>
            {standardIsActivated ? (
              plans.map((plan) => (
                <OsdsChip key={plan} color={ODS_THEME_COLOR_INTENT.primary}>
                  {upperFirst(plan)}
                </OsdsChip>
              ))
            ) : (
              <RegionChipByType type={region.type} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
