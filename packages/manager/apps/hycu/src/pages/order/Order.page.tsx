import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BaseLayout,
  IntervalUnitType,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import { useOrderCatalogHYCU } from '@/hooks/order/useOrderCatalogHYCU';

export default function Order() {
  const { t } = useTranslation('order');

  const { environment } = useContext(ShellContext);
  const subsidiary = environment.getUser().ovhSubsidiary;
  const { data: orderCatalogHYCU, isLoading } = useOrderCatalogHYCU(subsidiary);

  const header = {
    title: t('hycu_order_title'),
  };
  const description: string = t('hycu_order_description');
  const subtitle: string = t('hycu_order_subtitle');
  const subDescription: string = t('hycu_order_subtitle_description');

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      description={description}
      subtitle={subtitle}
      subDescription={subDescription}
    >
      {orderCatalogHYCU && !isLoading && (
        <div className="grid gap-8 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-8">
          {orderCatalogHYCU.plans.map((p) => (
            <OsdsTile
              rounded
              inline
              className="flex flex-col w-full h-fit text-center"
              key={p.planCode}
            >
              <div className="flex flex-col gap-6 pb-4">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.heading}
                >
                  {p.invoiceName}
                </OsdsText>
                <Price
                  value={p.pricings[2].price}
                  ovhSubsidiary={subsidiary as OvhSubsidiary}
                  intervalUnit={p.pricings[2].intervalUnit as IntervalUnitType}
                  locale={subsidiary}
                  tax={p.pricings[2].tax}
                ></Price>
              </div>
            </OsdsTile>
          ))}
        </div>
      )}
      <div className="flex flex-row">
        <OsdsButton
          slot="actions"
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            console.log('toto');
          }}
          className="mr-4"
        >
          {t('hycu_order_cta_cancel')}
        </OsdsButton>
        <OsdsButton
          disabled={true}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            console.log('toto');
          }}
        >
          {t('hycu_order_cta_order')}
        </OsdsButton>
      </div>
    </BaseLayout>
  );
}
