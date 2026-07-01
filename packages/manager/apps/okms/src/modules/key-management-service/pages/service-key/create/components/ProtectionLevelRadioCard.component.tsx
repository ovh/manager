import { ChangeEventHandler } from 'react';

import clsx from 'clsx';

import { Text } from '@ovhcloud/ods-react';

import { PriceTilePrice } from '@/common/components/price-tile/PriceTilePrice';
import { PricingProductCode } from '@/common/components/price-tile/pricingTile.type';

export type ProtectionLevelRadioCardProps = {
  value: string;
  name: string;
  selected?: string;
  isDisabled?: boolean;
  title: string;
  subTitle: string;
  productCode: PricingProductCode;
  comingSoonLabel: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const ProtectionLevelRadioCard = ({
  value,
  name,
  selected,
  isDisabled,
  title,
  subTitle,
  productCode,
  comingSoonLabel,
  onChange,
}: ProtectionLevelRadioCardProps) => {
  const isChecked = selected === value;

  return (
    <label
      htmlFor={value}
      className={clsx(
        'flex flex-col overflow-hidden rounded-md border border-solid',
        !isDisabled && 'cursor-pointer',
        !isChecked && 'border-[--ods-color-form-element-border-default]',
        !isChecked && !isDisabled && 'hover:border-[--ods-color-form-element-border-hover-default]',
        isChecked &&
          !isDisabled &&
          'border-[--ods-color-primary-500] outline outline-1 outline-[--ods-color-primary-500]',
        isDisabled &&
          'cursor-not-allowed border-[--ods-color-border-disabled-default] opacity-70 grayscale',
      )}
    >
      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <div className="flex items-start gap-3">
          <input
            type="radio"
            id={value}
            value={value}
            name={name}
            checked={isChecked}
            onChange={onChange}
            disabled={isDisabled}
            className="m-0 mt-1 shrink-0"
          />
          <Text preset="heading-5">{title}</Text>
        </div>
        <Text preset="paragraph">{subTitle}</Text>
      </div>
      <div
        className={clsx(
          'px-4 py-3',
          isChecked ? 'bg-[--ods-color-primary-050]' : 'bg-[--ods-color-neutral-100]',
        )}
      >
        {isDisabled ? (
          <Text preset="heading-6" className="text-[--ods-color-primary-500]">
            {comingSoonLabel}
          </Text>
        ) : (
          <PriceTilePrice productCode={productCode} />
        )}
      </div>
    </label>
  );
};
