import React from 'react';
import clsx from 'clsx';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { PriceTextProps, PriceTextPreset } from './PriceText.props';

export const PriceText: React.FC<PriceTextProps> = ({
  preset = PriceTextPreset.BASE,
  price,
  intervalUnitText,
  label,
}) => (
  <Text
    preset={TEXT_PRESET.span}
    className={clsx(
      'font-semibold',
      preset === PriceTextPreset.BASE
        ? 'text-[--ods-color-text] text-[16px] leading-[20px]'
        : 'text-[--ods-color-neutral-500] text-[14px] leading-[18px]',
    )}
  >
    {preset === PriceTextPreset.WITH_TAX && '('}
    <Text preset={TEXT_PRESET.span} className="mr-1">
      {price}
    </Text>
    {label && (
      <Text
        preset={TEXT_PRESET.span}
        className={clsx(preset === PriceTextPreset.BASE && 'mr-1')}
      >
        {label}
      </Text>
    )}
    {intervalUnitText && preset === PriceTextPreset.BASE && (
      <Text preset={TEXT_PRESET.span} className="mr-1">
        {intervalUnitText}
      </Text>
    )}
    {preset === PriceTextPreset.WITH_TAX && ')'}
  </Text>
);
