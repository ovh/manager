import React, { useState, useRef } from 'react';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import OrderPopupContent, { ShopItem } from './OrderPopupContent';
import OrderResponsivePopup from './OrderResponsivePopup';
import style from '../index.module.scss';

const OrderTrigger = ({ items }: { items: ShopItem[] }) => {
  const { t } = useTranslation('server-sidebar-order');
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const buttonRef = useRef();

  const handleButtonClick = () => {
    setIsButtonClicked((prevValue) => !prevValue);
  };

  return (
    <>
      <div ref={buttonRef}>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={handleButtonClick}
          className={style.orderTrigger}
        >
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.CART}
              size={ODS_ICON_SIZE.xs}
              contrasted
            />

            <span className={style.orderButtonContent}>
              {t('sidebar_menu_order_actions')}
            </span>
          </span>
          <span slot="end" aria-hidden="true">
            <OsdsIcon
              name={
                isButtonClicked
                  ? ODS_ICON_NAME.CHEVRON_UP
                  : ODS_ICON_NAME.CHEVRON_DOWN
              }
              size={ODS_ICON_SIZE.xs}
              contrasted
            />
          </span>
        </OsdsButton>
      </div>
      {isButtonClicked && (
        <OrderResponsivePopup
          button={buttonRef.current}
          onClose={handleButtonClick}
        >
          <OrderPopupContent shopItems={items} onSelect={handleButtonClick} />
        </OrderResponsivePopup>
      )}
    </>
  );
};

export default OrderTrigger;
