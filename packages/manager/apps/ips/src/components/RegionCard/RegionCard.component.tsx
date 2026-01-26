import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsPopover,
  OdsRadio,
  OdsText,
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
}>;

export const RegionCard: React.FC<RegionCardProps> = ({
  region,
  disabledMessage,
  isSelected,
  onClick,
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
        className={`flex cursor-pointer p-3 transition-shadow ${cardStyle} ${stateStyle} w-full min-w-[300px] sm:w-[311px] ${
          disabledMessage ? 'opacity-40' : ''
        }`}
        onClick={() => !disabledMessage && onClick?.()}
        color={ODS_CARD_COLOR.neutral}
      >
        <span className="mr-3 flex h-full">
          <OdsRadio name="" is-checked={isSelected}></OdsRadio>
        </span>
        <span
          style={{
            backgroundImage: `url('flags/${getCountryCode(region)}.svg')`,
          }}
          className={`h-[17px] w-[24px] shadow-md shadow-[${shadowColor}] mr-3 bg-cover`}
        />
        <div className="flex flex-col">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
            {t(getCountryKey(region))} - {t(getCityNameKey(region))}
          </OdsText>

          <OdsText preset={ODS_TEXT_PRESET.span}>{region}</OdsText>
        </div>
      </OdsCard>
    </div>
  );
};
