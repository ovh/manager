import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';
import { TLocalisation } from './useRegions';
import {
  regionContainer,
  regionTile,
  regionTileSelected,
} from './style.constants';
import './style.scss';

export interface RegionSummaryProps {
  region: TLocalisation;
}

export function RegionSummary({ region }: Readonly<RegionSummaryProps>) {
  return (
    <div className={regionContainer}>
      <OdsCard className={`${regionTile} ${regionTileSelected}`}>
        <div className="w-full">
          <div className="border-solid border-0 border-b border-ods-primary-200 py-3">
            <OdsText preset="span" className="font-bold">
              {region.macroLabel}
            </OdsText>
          </div>
          <div className="mt-6">
            <OdsText preset="span" className="text-[14px] font-bold">
              {region.microLabel}
            </OdsText>
          </div>
        </div>
      </OdsCard>
    </div>
  );
}
