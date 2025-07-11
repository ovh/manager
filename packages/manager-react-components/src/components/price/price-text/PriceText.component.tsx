import React from 'react';
import clsx from 'clsx';
import { PriceTextProps, PRICE_TEXT_PRESET } from './PriceText.props';

export const PriceText: React.FC<PriceTextProps> = ({
  preset = PRICE_TEXT_PRESET.BASE,
  price,
  intervalUnitText,
  label,
}) => (
  <span
    className={clsx(
      'font-semibold',
      preset === PRICE_TEXT_PRESET.BASE
        ? 'text-[--ods-color-text] text-[16px] leading-[20px]'
        : 'text-[--ods-color-neutral-500] text-[14px] leading-[18px]',
    )}
  >
    {preset === PRICE_TEXT_PRESET.WITH_TAX && '('}
    <span className="mr-1">{price}</span>
    {label && (
      <span className={clsx(preset === PRICE_TEXT_PRESET.BASE && 'mr-1')}>
        {label}
      </span>
    )}
    {intervalUnitText && preset === PRICE_TEXT_PRESET.BASE && (
      <span className="mr-1">{intervalUnitText}</span>
    )}
    {preset === PRICE_TEXT_PRESET.WITH_TAX && ')'}
  </span>
);
