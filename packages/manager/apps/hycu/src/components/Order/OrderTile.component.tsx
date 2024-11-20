import React, { ReactNode } from 'react';

import { Price } from '@ovh-ux/manager-react-components';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components/src/enumTypes';
import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';

import { HYCUCatalogPlanPricing } from '@/types/orderCatalogHYCU.type';

export type OrderTileProps = React.ComponentProps<typeof OsdsTile> & {
  label: string;
  pricing: HYCUCatalogPlanPricing;
  subsidiary: OvhSubsidiary;
};

export const OrderTile = ({
  label,
  pricing,
  subsidiary,
  ...otherProps
}: OrderTileProps) => {
  return (
    <OsdsTile
      className="flex flex-col w-full h-fit text-center"
      color={ODS_THEME_COLOR_INTENT.primary}
      hoverable
      rounded
      {...otherProps}
    >
      <div className="flex flex-col gap-6 pb-4">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._400}
        >
          {label}
        </OsdsText>
        <Price
          locale={subsidiary}
          ovhSubsidiary={subsidiary}
          intervalUnit={pricing.intervalUnit}
          tax={pricing.tax}
          value={pricing.price}
        ></Price>
      </div>
    </OsdsTile>
  );
};

export const OrderTileWrapper = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-8 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-8">
    {children}
  </div>
);
