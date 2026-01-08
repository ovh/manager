import { Card, Text } from '@ovhcloud/ods-react';

import { PriceTilePrice } from './PriceTilePrice';
import { PricingProductCode } from './pricingTile.type';

type PriceTileProps = {
  title: string;
  subtitle: string;
  productCode: PricingProductCode;
};

export const PriceTile = ({ title, subtitle, productCode }: PriceTileProps) => {
  return (
    <Card className="flex h-fit w-full flex-col overflow-hidden border-[--ods-color-form-element-border-default]">
      <div className="flex flex-col justify-center gap-3 px-4 py-3 align-middle">
        <Text className="block" preset="heading-5">
          {title}
        </Text>
        <Text preset="paragraph">{subtitle}</Text>
      </div>
      <div className="bg-gray-100 px-4 py-3">
        <PriceTilePrice productCode={productCode} />
      </div>
    </Card>
  );
};
