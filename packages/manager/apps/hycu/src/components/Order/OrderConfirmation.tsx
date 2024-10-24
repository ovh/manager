import React from 'react';
import {
  OsdsText,
  OsdsButton,
  OsdsLink,
  OsdsIcon,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
  ODS_LINK_REFERRER_POLICY,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { urls } from '@/routes/routes.constant';

type OrderConfirmationProps = {
  orderLink: string;
};

const OrderConfirmation = ({ orderLink }: OrderConfirmationProps) => {
  const { t } = useTranslation('hycu/order');
  const navigate = useNavigate();

  return (
    <>
      <OsdsTile className="mb-8">
        <span slot="start">
          <div className="flex flex-col gap-6 mb-6">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._600}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('hycu_order_initiated_title')}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._800}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('hycu_order_initiated_description')}
            </OsdsText>
            <OsdsLink
              color={ODS_THEME_COLOR_INTENT.primary}
              target={OdsHTMLAnchorElementTarget._blank}
              referrerpolicy={
                ODS_LINK_REFERRER_POLICY.strictOriginWhenCrossOrigin
              }
              href={orderLink}
            >
              {orderLink}
              <span slot="end">
                <OsdsIcon
                  className="ml-4 cursor-pointer"
                  name={ODS_ICON_NAME.EXTERNAL_LINK}
                  size={ODS_ICON_SIZE.xs}
                  hoverable
                ></OsdsIcon>
              </span>
            </OsdsLink>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._800}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('hycu_order_initiated_info')}
            </OsdsText>
          </div>
        </span>
      </OsdsTile>
      <OsdsButton
        inline
        size={ODS_BUTTON_SIZE.md}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          navigate(urls.listing);
        }}
      >
        {t('hycu_order_initiated_cta_done')}
      </OsdsButton>
    </>
  );
};

export default OrderConfirmation;
