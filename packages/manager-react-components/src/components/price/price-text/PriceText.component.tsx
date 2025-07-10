import React from 'react';
import clsx from 'clsx';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { PriceTextProps, PRICE_TEXT_PRESET } from './PriceText.props';

export const PriceText: React.FC<PriceTextProps> = ({
  preset = PRICE_TEXT_PRESET.BASE,
  price,
  intervalUnitText,
  label,
}) => (
  <Text
    preset={TEXT_PRESET.span}
    className={clsx(
      'font-semibold',
      preset === PRICE_TEXT_PRESET.BASE
        ? 'text-[--ods-color-text] text-[16px] leading-[20px]'
        : 'text-[--ods-color-neutral-500] text-[14px] leading-[18px]',
    )}
  >
    {preset === PRICE_TEXT_PRESET.WITH_TAX && '('}
    <Text preset={TEXT_PRESET.span} className="mr-1">
      {price}
    </Text>
    {label && (
      <Text
        preset={TEXT_PRESET.span}
        className={clsx(preset === PRICE_TEXT_PRESET.BASE && 'mr-1')}
      >
        {label}
      </Text>
    )}
    {intervalUnitText && preset === PRICE_TEXT_PRESET.BASE && (
      <Text preset={TEXT_PRESET.span} className="mr-1">
        {intervalUnitText}
      </Text>
    )}
    {preset === PRICE_TEXT_PRESET.WITH_TAX && ')'}
  </Text>
);
