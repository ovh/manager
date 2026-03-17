import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_CARD_COLOR,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsIcon,
  OdsPopover,
  OdsRadio,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { getCountryCode } from '@/utils';

import './region-card.scss';
import {
  getCityNameKey,
  getCountryKey,
  shadowColor,
} from './region-card.utils';

export type RegionCardProps = React.PropsWithChildren<{
  region: string;
  disabledMessage?: string;
  isSelected?: boolean;
  onClick?: () => void;
  tooltipInfo?: string;
}>;

export const RegionCard: React.FC<RegionCardProps> = ({
  region,
  disabledMessage,
  isSelected,
  onClick,
  tooltipInfo,
}) => {
  const stateStyle = disabledMessage
    ? 'cursor-not-allowed bg-neutral-100'
    : 'cursor-pointer hover:shadow-md';
  const cardStyle = isSelected ? 'region_card_selected' : 'region_card m-[1px]';
  const { t } = useTranslation('region-selector');

  return (
    <div>
      {disabledMessage && (
        <OdsPopover triggerId={region} withArrow className="max-w-sm">
          <OdsText className="block p-2" preset={ODS_TEXT_PRESET.paragraph}>
            {disabledMessage}
          </OdsText>
        </OdsPopover>
      )}
      <OdsCard
        id={region}
        tabIndex={0}
        className={`flex cursor-pointer p-3 transition-shadow ${cardStyle} ${stateStyle} size-full min-w-[300px] sm:w-[311px] ${
          disabledMessage ? 'opacity-40' : ''
        }`}
        onClick={() => !disabledMessage && onClick?.()}
        color={ODS_CARD_COLOR.neutral}
      >
        <div className="flex gap-3 p-4">
          <div className="flex h-full gap-4">
            <OdsRadio name="mr-4 align-middle" isChecked={isSelected} />
            <span
              style={{
                backgroundImage: `url('flags/${getCountryCode(region)}.svg')`,
              }}
              className={`h-[17px] w-[24px] shadow-md shadow-[${shadowColor}] mr-3 bg-cover`}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <OdsText preset={ODS_TEXT_PRESET.heading5}>
              {t(getCountryKey(region))} - {t(getCityNameKey(region))}
            </OdsText>

            <OdsText preset={ODS_TEXT_PRESET.span}>
              {region}
              {!disabledMessage && tooltipInfo && (
                <>
                  <OdsTooltip
                    triggerId={`${region}-info`}
                    withArrow
                    className="max-w-sm"
                  >
                    <OdsText
                      className="block max-w-[200px] p-2"
                      preset={ODS_TEXT_PRESET.paragraph}
                    >
                      {tooltipInfo}
                    </OdsText>
                  </OdsTooltip>
                  <OdsIcon
                    id={`${region}-info`}
                    className="ml-3 text-xs"
                    name={ODS_ICON_NAME.circleInfo}
                  />
                </>
              )}
            </OdsText>
          </div>
        </div>
      </OdsCard>
    </div>
  );
};
