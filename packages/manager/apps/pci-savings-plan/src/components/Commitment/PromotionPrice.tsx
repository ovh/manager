import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';

export const PromotionPrice = ({ price }: { price: string }) => {
  return (
    <OdsText className="ml-3  text-[16px]">
      <span className="text-[#AC246F] font-bold">{price}</span>
    </OdsText>
  );
};

export const PromotionLineThroughPrice = ({ price }: { price: string }) => {
  return <OdsText className="line-through">{price}</OdsText>;
};
