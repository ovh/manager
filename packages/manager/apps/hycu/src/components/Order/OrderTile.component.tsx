import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Card, CARD_COLOR } from '@ovhcloud/ods-react';
import { Text, TEXT_PRESET, Price, OvhSubsidiary } from '@ovh-ux/muk';

import { HYCUCatalogPlanPricing } from '@/types/orderCatalogHYCU.type';

export type OrderTileProps = {
  label: string;
  pricing: HYCUCatalogPlanPricing;
  subsidiary: OvhSubsidiary;
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const OrderTile = ({
  label,
  pricing,
  subsidiary,
  checked = false,
  disabled = false,
  onClick,
}: OrderTileProps) => {
  return (
    <Card
      className={clsx('flex border-2 flex-col w-full h-fit text-center p-4', {
        'border-[--ods-theme-input-border-color-checked]': checked,
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-pointer hover:bg-[--ods-theme-input-option-background-color-hover]': !disabled,
      })}
      color={checked ? CARD_COLOR.primary : CARD_COLOR.information}
      onClick={() => onClick?.()}
    >
      <div className="flex flex-col gap-6 pb-4">
        <Text preset={TEXT_PRESET.heading4}>{label}</Text>
        <Price
          locale={subsidiary}
          ovhSubsidiary={subsidiary}
          intervalUnit={pricing.intervalUnit}
          tax={pricing.tax}
          value={pricing.price}
        ></Price>
      </div>
    </Card>
  );
};

export const OrderTileWrapper = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-8 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-8">
    {children}
  </div>
);
