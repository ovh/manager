import React, { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsButton,
  OsdsTile,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import {
  Description,
  IntervalUnitType,
  OvhSubsidiary,
  Price,
  Subtitle,
} from '@ovh-ux/manager-react-components';

import Loading from '@/components/Loading/Loading.component';
import { useOrderCatalogHYCU } from '@/hooks/order/useOrderCatalogHYCU';
import { urls } from '@/routes/routes.constant';
import { sortPacksByPrice } from '@/utils/sortPacks';

type PackSelectionProps = {
  selectPack: Dispatch<SetStateAction<string>>;
  setOrderInitiated: () => void;
  orderLink: string;
  selectedPack: string;
  subsidiary: OvhSubsidiary;
};

const PackSelection = ({
  selectPack,
  setOrderInitiated,
  orderLink,
  selectedPack,
  subsidiary,
}: PackSelectionProps) => {
  const { t } = useTranslation('order');
  const navigate = useNavigate();

  const { data: orderCatalogHYCU, isLoading } = useOrderCatalogHYCU(subsidiary);

  return (
    <>
      <Subtitle className="block mb-6">{t('hycu_order_subtitle')}</Subtitle>
      <Description className="mb-8">
        <Trans
          t={t}
          i18nKey="hycu_order_subtitle_description"
          components={{
            contact: (
              <OsdsLink
                color={ODS_THEME_COLOR_INTENT.primary}
                href={'https://www.ovhcloud.com/fr/contact/'}
                target={OdsHTMLAnchorElementTarget._blank}
              ></OsdsLink>
            ),
          }}
        ></Trans>
      </Description>
      {isLoading && <Loading />}
      {orderCatalogHYCU && !isLoading && (
        <div className="grid gap-8 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-8">
          {sortPacksByPrice(orderCatalogHYCU.plans).map((product) => (
            <OsdsTile
              checked={product.planCode === selectedPack || undefined} // workaround to handle a bad implementation of checked attribute
              className="flex flex-col w-full h-fit text-center"
              hoverable
              key={product.planCode}
              onClick={() => {
                selectPack(product.planCode);
              }}
              rounded
            >
              <div className="flex flex-col gap-6 pb-4">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.heading}
                  size={ODS_TEXT_SIZE._400}
                >
                  {product.invoiceName}
                </OsdsText>
                <Price
                  locale={subsidiary}
                  ovhSubsidiary={subsidiary as OvhSubsidiary}
                  intervalUnit={
                    product.pricings[2].intervalUnit as IntervalUnitType
                  }
                  tax={product.pricings[2].tax}
                  value={product.pricings[2].price}
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
          onClick={() => {
            navigate(urls.root);
          }}
          slot="actions"
          variant={ODS_BUTTON_VARIANT.ghost}
        >
          {t('hycu_order_cta_cancel')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={(!selectedPack && !orderLink) || undefined} // workaround to handle a bad implementation of disabled attribute
          onClick={() => {
            setOrderInitiated();
          }}
          slot="actions"
        >
          {t('hycu_order_cta_order')}
        </OsdsButton>
      </div>
    </>
  );
};

export default PackSelection;
