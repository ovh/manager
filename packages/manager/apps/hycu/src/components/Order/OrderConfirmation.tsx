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

type OrderConfirmationProps = {
  description: string;
  doneLabel: string;
  info: string;
  orderLink: string;
  title: string;
  onClickDone: () => void;
};

const OrderConfirmation = ({
  description,
  doneLabel,
  info,
  orderLink,
  title,
  onClickDone,
}: OrderConfirmationProps) => {
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
              {title}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._800}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {description}
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
              {info}
            </OsdsText>
          </div>
        </span>
      </OsdsTile>
      <OsdsButton
        inline
        size={ODS_BUTTON_SIZE.md}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onClickDone}
      >
        {doneLabel}
      </OsdsButton>
    </>
  );
};

export default OrderConfirmation;
