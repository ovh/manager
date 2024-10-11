import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BaseLayout,
  IntervalUnitType,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import Loading from '@/components/Loading/Loading.component';
import { useOrderCatalogHYCU } from '@/hooks/order/useOrderCatalogHYCU';
import useOrderHYCU from '@/hooks/order/useOrderHYCU';

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

  const [selectedPack, setSelectedPack] = useState<string>(null);

  const cancelOrder = () => {
    setSelectedPack(null);
  };

  const { orderLink, redirectToOrder } = useOrderHYCU({
    planCode: selectedPack,
    region: subsidiary,
  });

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      description={description}
      header={header}
      subtitle={subtitle}
      subDescription={subDescription}
    >
      {isLoading && <Loading />}
      {orderCatalogHYCU && !isLoading && (
        <div className="grid gap-8 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 my-8">
          {orderCatalogHYCU.plans
            .sort((a, b) => a.pricings[2].price - b.pricings[2].price)
            .map((p) => (
              <OsdsTile
                checked={p.planCode === selectedPack || undefined} // workaround to handle a bad implementation of checked attribute
                className="flex flex-col w-full h-fit text-center"
                hoverable
                key={p.planCode}
                onClick={() => {
                  setSelectedPack(p.planCode);
                }}
                rounded
              >
                <div className="flex flex-col gap-6 pb-4">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_TEXT_LEVEL.heading}
                    size={ODS_TEXT_SIZE._400}
                  >
                    {p.invoiceName}
                  </OsdsText>
                  <Price
                    locale={subsidiary}
                    ovhSubsidiary={subsidiary as OvhSubsidiary}
                    intervalUnit={
                      p.pricings[2].intervalUnit as IntervalUnitType
                    }
                    tax={p.pricings[2].tax}
                    value={p.pricings[2].price}
                  ></Price>
                </div>
              </OsdsTile>
            ))}
        </div>
      )}
      <div className="flex flex-row">
        <OsdsButton
          className="mr-4"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={cancelOrder}
          slot="actions"
          variant={ODS_BUTTON_VARIANT.ghost}
        >
          {t('hycu_order_cta_cancel')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={(!selectedPack && !orderLink) || undefined} // workaround to handle a bad implementation of disabled attribute
          onClick={redirectToOrder}
          slot="actions"
        >
          {t('hycu_order_cta_order')}
        </OsdsButton>
      </div>
    </BaseLayout>
  );
}
