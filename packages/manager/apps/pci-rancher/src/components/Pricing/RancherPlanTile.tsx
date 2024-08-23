// RancherPlanTile.tsx
import React from 'react';
import { OsdsTile, OsdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { RancherPlan } from '@/api/api.type';

export interface RancherPlanTileProps {
  plan: RancherPlan;
  name: string;
  selectedPlan: RancherPlan;
  setSelectedPlan: (plan: RancherPlan) => void;
  planDescription: string | null;
  hourlyPrice: string;
  monthlyPrice: string;
}

const RancherPlanTile: React.FC<RancherPlanTileProps> = ({
  plan,
  name,
  selectedPlan,
  setSelectedPlan,
  planDescription,
  hourlyPrice,
  monthlyPrice,
}) => {
  return (
    <li key={plan.name}>
      <OsdsTile
        onClick={() => setSelectedPlan(plan)}
        className={clsx(
          'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-075] hover:border-[--ods-color-blue-600]',
          plan.name === selectedPlan?.name &&
            'bg-[--ods-color-blue-075] border-[--ods-color-blue-600]',
        )}
      >
        <div>
          <div className="border-solid border-0 border-b border-b-[#bef1ff] w-full mx-3 pb-2 text-[#4d5592] text-sm">
            <div
              className={clsx(
                'border-b-[--ods-color-blue-100] font-bold pb-2',
                plan.name === selectedPlan?.name && 'font-bold',
              )}
            >
              <span>{name}</span>
            </div>
            <div className="pt-2 pb-8 text-[#4d5592] font-sans text-xs">
              {planDescription}
            </div>
          </div>
          <div className="text-center border-t border-t-[#bef1ff]">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              className="block pt-4"
            >
              <strong>{hourlyPrice}</strong>
            </OsdsText>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="block">
              ~ {monthlyPrice}
            </OsdsText>
          </div>
        </div>
      </OsdsTile>
    </li>
  );
};

export default RancherPlanTile;
