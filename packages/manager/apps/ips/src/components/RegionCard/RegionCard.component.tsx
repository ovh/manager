import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  CARD_COLOR,
  RadioControl,
  RadioGroup,
  TEXT_PRESET,
  Card,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Radio,
  Text,
} from '@ovhcloud/ods-react';

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
    <Popover open={!!disabledMessage}>
      <PopoverContent withArrow>{disabledMessage}</PopoverContent>
      <PopoverTrigger asChild>
        <Card
          id={region}
          tabIndex={0}
          className={`flex cursor-pointer p-3 transition-shadow ${cardStyle} ${stateStyle} w-full min-w-[300px] sm:w-[311px] ${
            disabledMessage ? 'opacity-40' : ''
          }`}
          onClick={() => !disabledMessage && onClick?.()}
          color={CARD_COLOR.neutral}
        >
          <span className="mr-3 flex h-full">
            <RadioGroup
              value={isSelected ? 'selected' : 'notSelected'}
              disabled={!!disabledMessage}
            >
              <Radio value="selected">
                <RadioControl />
              </Radio>
            </RadioGroup>
          </span>
          <span
            style={{
              backgroundImage: `url('flags/${getCountryCode(region)}.svg')`,
            }}
            className={`h-[17px] w-[24px] shadow-md shadow-[${shadowColor}] mr-3 bg-cover`}
          />
          <div className="flex flex-col">
            <Text className="block" preset={TEXT_PRESET.heading5}>
              {t(getCountryKey(region))} - {t(getCityNameKey(region))}
            </Text>

            <Text preset={TEXT_PRESET.span}>{region}</Text>
          </div>
        </Card>
      </PopoverTrigger>
    </Popover>
  );
};
