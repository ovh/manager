import React, { useState, useRef } from 'react';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-stencil/components/react/';
import { OdsIconName, OdsIconSize, OdsButtonVariant, OdsButtonType } from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
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
          color={OdsThemeColorIntent.primary}
          type={OdsButtonType.button}
          variant={
            OdsButtonVariant.flat
          }
          onClick={handleButtonClick}
          className={style.orderTrigger}
          flex
        >
          <span slot="start">
            <OsdsIcon
              name={OdsIconName.CART}
              size={OdsIconSize.xs}
              contrasted
            />

            <span className={style.orderButtonContent}>
              {t('sidebar_menu_order_actions')}
            </span>
          </span>
          <span slot="end" aria-hidden="true">

            <OsdsIcon
              name={isButtonClicked ? OdsIconName.CHEVRON_UP : OdsIconName.CHEVRON_DOWN}
              size={OdsIconSize.xs}
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
