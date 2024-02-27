import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsLink,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsIconName,
  OdsIconSize,
  OdsButtonVariant,
  OdsHTMLAnchorElementTarget,
  OdsTextSize,
  OdsTextLevel,
} from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

import './OrderPopupContent.scss';
import '@ovhcloud/ods-theme-blue-jeans/index.css';
import style from './style.module.scss';

export interface ShopSubItem {
  label: string;
  url: string;
  feature?: string;
  external?: boolean;
  tracking?: string;
}

export interface ShopItem {
  external?: boolean;
  url?: string;
  icon: any;
  label: string;
  subMenu?: Array<ShopSubItem>;
  feature?: string;
  tracking?: string;
}
const OpenLayout = ({ as, item, href, target, onClick, tabIndex }: any) => {
  const Component = as === 'a' ? 'a' : 'button';

  return (
    <Component
      href={as === 'a' ? href : undefined}
      target={as === 'a' ? target : undefined}
      onClick={onClick}
      className={as === 'button' ? 'buttonOrder' : ''}
      tabIndex={tabIndex}
    >
      <OpenLayoutContent item={item} />
    </Component>
  );
};

const OpenLayoutContent = ({ item, tabIndex }: any) => {
  const { t } = useTranslation('server-sidebar-order');
  return (
    <>
      <OsdsButton
        circle
        color={OdsThemeColorIntent.primary}
        tabIndex={tabIndex}
      >
        <div className="order-popup-content-icon" aria-hidden="true">
          {item.icon}
        </div>
      </OsdsButton>
      <div className="order-popup-content-label">
        <OsdsText
          size={OdsTextSize._300}
          color={OdsThemeColorIntent.primary}
          level={OdsTextLevel.subheading}
        >
          {t(`server_sidebar_${item.label}_title`)}
        </OsdsText>
      </div>
      {item.external && (
        <span className="order-popup-content-external-link">
          <OsdsIcon
            name={OdsIconName.EXTERNAL_LINK}
            size={OdsIconSize.xxs}
            color={OdsThemeColorIntent.primary}
          />
        </span>
      )}
    </>
  );
};



const OrderPopupContent = ({
  shopItems,
  onSelect,
}: {
  shopItems: Array<ShopItem>;
  onSelect: () => void;
}) => {
  const [showListMenu, setShowListMenu] = useState(false);
  const [currentMenu, setCurrentMenu] = useState([]);
  const { t } = useTranslation('server-sidebar-order');
  const shell = useShell();
  const hideMenu = useCallback(() => setShowListMenu(false), [setShowListMenu]);

  const onItemSelect = useCallback(
    (item: ShopItem | ShopSubItem) => () => {
      if (item?.tracking) {
        shell.getPlugin('tracking')?.trackClick({
          type: 'action',
          name: item.tracking,
        });
      }
      onSelect();
    },
    [shell, onSelect],
  );

  return showListMenu ? (
    <>
      <OsdsButton
        flex
        variant={OdsButtonVariant.ghost}
        color={OdsThemeColorIntent.primary}
        className={style.buttonMenu}
        onClick={hideMenu}
      >
        <span slot="start">
          <OsdsIcon name={OdsIconName.CHEVRON_LEFT}
            size={OdsIconSize.xs}
            color={OdsThemeColorIntent.primary}></OsdsIcon>
          {t('sidebar_order_menu_back')}
        </span>
      </OsdsButton>

      {currentMenu.map(
        (item) =>
          item && (
            <div key={`current-menu-${item.label}`} className={style.toto}>
              <OsdsButton
                flex
                key={item.label}
                href={item.url}
                variant={OdsButtonVariant.ghost}
                color={OdsThemeColorIntent.primary}
                className={style.buttonMenu}
                onClick={() => onItemSelect(item)}
                target={
                  item.external
                    ? OdsHTMLAnchorElementTarget['_blank']
                    : OdsHTMLAnchorElementTarget['_top']
                }
              >
                <OsdsLink color={OdsThemeColorIntent.primary}>
                  {t(`server_sidebar_${item.label}_title`)}
                </OsdsLink>
              </OsdsButton>
            </div>
          ),
      )}
    </>
  ) : (
    <div className="order-popup-content">
      {shopItems
        .filter((item) => !!item)
        .map((item, index) => {
          const props: Record<string, unknown> =
            item.subMenu?.length > 0
              ? {
                  as: 'button',
                  onClick: () => {
                    setShowListMenu(true);
                    setCurrentMenu(item.subMenu);
                  },
                  tabIndex: index + 1,
                }
              : {
                  as: 'a',
                  href: item.url,
                  target: item.external ? '_blank' : '_top',
                  onClick: onItemSelect(item),
                  tabIndex: index + 1,
                };
          return <OpenLayout item={item} key={`open-layout-${item.label}`} {...props} />;
        })}
    </div>
  );
};

export default OrderPopupContent;
