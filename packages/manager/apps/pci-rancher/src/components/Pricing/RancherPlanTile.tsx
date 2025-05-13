// RancherPlanTile.tsx
import React from 'react';
import { OsdsTile, OsdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { RancherPlan } from '@/types/api.type';

export interface RancherPlanTileProps {
  plan: RancherPlan;
  name: string;
  selectedPlan: RancherPlan;
  setSelectedPlan: (plan: RancherPlan) => void;
  planDescription: string | null;
  formattedHourlyPrice: string;
  formattedMonthlyPrice: string;
  isPricing: boolean;
}

const RancherPlanTile: React.FC<RancherPlanTileProps> = ({
  plan,
  name,
  selectedPlan,
  setSelectedPlan,
  planDescription,
  formattedHourlyPrice,
  formattedMonthlyPrice,
  isPricing,
}) => {
  const { t } = useTranslation(['dashboard']);
  return (
    <li key={plan.name}>
      <OsdsTile
        aria-label={`tile-${name}`}
        onClick={() => setSelectedPlan(plan)}
        className={clsx(
          'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-075] hover:border-[--ods-color-blue-600]',
          plan.name === selectedPlan?.name &&
            'bg-[--ods-color-blue-075] border-[--ods-color-blue-600]',
        )}
      >
        <div>
          <div
            className={clsx(
              'border-0 border-b border-b-[#bef1ff] w-full mx-3 pb-2 text-[#4d5592] text-sm',
              isPricing && 'border-solid',
            )}
          >
            <div
              className={clsx(
                'border-b-[--ods-color-blue-100] font-bold pb-2',
                plan.name === selectedPlan?.name && 'font-bold',
              )}
            >
              <span>{name}</span>
            </div>
            <div
              className={clsx(
                'pt-2 text-[#4d5592] font-sans text-xs',
                isPricing && ' pb-8',
              )}
            >
              {planDescription}
            </div>
          </div>
          {isPricing && (
            <div className="text-center border-t border-t-[#bef1ff]">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                className="block pt-4"
              >
                <strong>{formattedHourlyPrice}</strong>
              </OsdsText>
              <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="block">
                ~ {formattedMonthlyPrice}
              </OsdsText>
              <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                {t('createRancherOfferDescription')}
              </OsdsText>
              <div></div>
            </div>
          )}
        </div>
      </OsdsTile>
    </li>
  );
};

export default RancherPlanTile;
