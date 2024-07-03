import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { TLocalisation } from '@/api/hooks/useRegions';
import {
  regionContainer,
  regionTile,
  regionTileSelected,
} from './style.constant';

export interface RegionSummaryProps {
  region: TLocalisation;
}

export function RegionSummary({ region }: Readonly<RegionSummaryProps>) {
  return (
    <div className={regionContainer}>
      <OsdsTile
        className={`${regionTile} ${regionTileSelected}`}
        checked={true}
      >
        <div className="w-full">
          <div className="border-solid border-0 border-b border-b-[#85d9fd] py-3">
            <OsdsText
              className="font-bold"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {region.macroLabel}
            </OsdsText>
          </div>
          <div className="mt-6">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {region.microLabel}
            </OsdsText>
          </div>
        </div>
      </OsdsTile>
    </div>
  );
}
