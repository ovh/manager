import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';

export const PromotionPrice = ({ price }: { price: string }) => {
  return (
    <OdsText className="ml-3  text-[16px]">
      <span className="text-[var(--ods-color-promotion)] font-bold">
        {price}
      </span>
    </OdsText>
  );
};

export const OriginalPrice = ({ price }: { price: string }) => {
  return <OdsText className="line-through">{price}</OdsText>;
};
