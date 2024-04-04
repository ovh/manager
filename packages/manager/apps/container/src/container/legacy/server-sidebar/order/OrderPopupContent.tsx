import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsLink,
} from '@ovhcloud/ods-components/react';

import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import './OrderPopupContent.scss';

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
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        tabIndex={tabIndex}
      >
        <div className="order-popup-content-icon" aria-hidden="true">
          {item.icon}
        </div>
      </OsdsButton>
      <div className="order-popup-content-label">
        <OsdsText
          size={ODS_TEXT_SIZE._300}
          color={ODS_THEME_COLOR_INTENT.primary}
          level={ODS_TEXT_LEVEL.subheading}
        >
          {t(`server_sidebar_${item.label}_title`)}
        </OsdsText>
      </div>
      {item.external && (
        <span className="order-popup-content-external-link">
          <OsdsIcon
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
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
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={hideMenu}
        text-align="start"
      >
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.CHEVRON_LEFT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
          {t('sidebar_order_menu_back')}
        </span>
      </OsdsButton>

      {currentMenu.map(
        (item) =>
          item && (
            <div key={`current-menu-${item.label}`}>
              <OsdsButton
                key={item.label}
                href={item.url}
                variant={ODS_BUTTON_VARIANT.ghost}
                color={ODS_THEME_COLOR_INTENT.primary}
                text-align="start"
                onClick={() => onItemSelect(item)}
                target={
                  item.external
                    ? OdsHTMLAnchorElementTarget['_blank']
                    : OdsHTMLAnchorElementTarget['_top']
                }
              >
                <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
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
          return (
            <OpenLayout
              item={item}
              key={`open-layout-${item.label}`}
              {...props}
            />
          );
        })}
    </div>
  );
};

export default OrderPopupContent;
