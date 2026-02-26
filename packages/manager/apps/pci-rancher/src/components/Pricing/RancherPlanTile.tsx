// RancherPlanTile.tsx
import React from 'react';
import { OsdsTile, OsdsText, OsdsChip } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Trans, useTranslation } from 'react-i18next';
import { RancherPlan } from '@/types/api.type';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';

export interface RancherPlanTileProps {
  plan: RancherPlan;
  name: string;
  selectedPlan: RancherPlan;
  setSelectedPlan: (plan: RancherPlan) => void;
  planDescription: Array<string> | null;
  formattedHourlyPrice: string;
  formattedMonthlyPrice: string;
  isPricing: boolean;
  showFreeTrialBadge?: boolean;
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
  showFreeTrialBadge = false,
}) => {
  const { t } = useTranslation(['dashboard']);
  return (
    <li key={plan.name}>
      <OsdsTile
        aria-label={`tile-${name}`}
        onClick={() => setSelectedPlan(plan)}
        className={clsx(
          'cursor-pointer h-full border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-075] hover:border-[--ods-color-blue-600]',
          plan.name === selectedPlan?.name &&
            'bg-[--ods-color-blue-075] border-[--ods-color-blue-600]',
        )}
      >
        <div className="flex flex-col">
          <div
            className={clsx(
              'border-0 border-b border-b-[#bef1ff] w-full flex-1 mx-3 pb-2 text-[#4d5592] text-sm',
              isPricing && 'border-solid',
            )}
          >
            <div
              className={clsx(
                'border-b-[--ods-color-blue-100] font-bold pb-2',
                plan.name === selectedPlan?.name && 'font-bold',
              )}
            >
              <div className="flex flex-wrap items-center gap-4">
                <span>{name}</span>
                {showFreeTrialBadge && (
                  <OsdsChip
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_CHIP_SIZE.sm}
                  >
                    {t('freeTrialBadge')}
                  </OsdsChip>
                )}
              </div>
            </div>
            <div
              className={clsx(
                'pt-2 text-[#4d5592] font-sans text-xs',
                isPricing && ' pb-8',
              )}
            >
              {planDescription && planDescription.length > 0 && (
                <ul className="list-disc -ml-8 space-y-4 mt-4">
                  {planDescription.map((key, index) => (
                    <li key={index}>
                      <Trans
                        i18nKey={key}
                        ns="dashboard"
                        components={{ b: <b /> }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {isPricing && (
            <div className="text-center border-t border-t-[#bef1ff] pt-4">
              {showFreeTrialBadge && (
                <>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="block"
                  >
                    <strong>{t('freeTrialPriceLabel')}</strong>
                  </OsdsText>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="block"
                  >
                    {t('freeTrialThenLabel')}
                  </OsdsText>
                </>
              )}
              <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="block">
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
