import React, { useCallback, useState } from 'react';
import {
  Button,
  chakra,
  Stack,
  ComponentWithAs,
  IconProps,
  Box,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@ovh-ux/manager-themes';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
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
  icon: string | ComponentWithAs<'svg', IconProps>;
  label: string;
  subMenu?: Array<ShopSubItem>;
  feature?: string;
  tracking?: string;
}

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

  const iconStyles = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const containerIconStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3',
    borderRadius: 'full',
    color: '#2859c0',
    transitionProperty: 'common',
    transitionDuration: 'normal',
  };

  const glyphIconStyles = {
    fontSize: '2rem',
    textDecoration: 'none',
  };

  const itemStyles = (showAfter: boolean) => {
    const itemAfterStyles = showAfter
      ? {
          _after: {
            content: '""',
            position: 'absolute',
            height: '50%',
            width: '1px',
            bg: 'gray.200',
            top: '1rem',
            right: '0',
          },
        }
      : {};
    return {
      display: 'flex',
      position: 'relative',
      paddingTop: '2.5',
      paddingBottom: '1.5',
      _hover: {
        textDecoration: 'none',
        '>div': {
          background: '#2859c0',
          color: 'uikit.0',
        },
      },
      _focusVisible: {
        '>div': {
          background: '#2859c0',
          color: 'uikit.0',
        },
      },
      ...itemAfterStyles,
    };
  };

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
    <Stack>
      <Button
        variant="ghost"
        justifyContent="start"
        borderRadius="0"
        boxShadow="none !important"
        onClick={hideMenu}
      >
        <ChevronLeftIcon />
        {t('sidebar_order_menu_back')}
      </Button>
      {currentMenu.map(
        (item) =>
          item && (
            <Button
              key={item.label}
              as="a"
              target={item.external ? '_blank' : '_top'}
              href={item.url}
              variant="ghost"
              justifyContent="start"
              borderRadius="0"
              boxShadow="none !important"
              onClick={onItemSelect(item)}
            >
              {t(`server_sidebar_${item.label}_title`)}
            </Button>
          ),
      )}
    </Stack>
  ) : (
    <Box role="list" display="flex" flexFlow="row wrap">
      {shopItems
        .filter((item) => !!item)
        .map((item, key) => {
          const props: Record<string, unknown> =
            item.subMenu?.length > 0
              ? {
                  as: 'button',
                  onClick: () => {
                    setShowListMenu(true);
                    setCurrentMenu(item.subMenu);
                  },
                }
              : {
                  as: 'a',
                  href: item.url,
                  target: item.external ? '_blank' : '_top',
                  onClick: onItemSelect(item),
                };
          return (
            <Stack
              {...props}
              key={`shop-item-${key}`}
              sx={itemStyles((key + 1) % 3 !== 0)}
              alignItems="center"
              width="33.33%"
              borderBottom={
                key >= Math.ceil(shopItems.length / 3) * 3 - 3
                  ? ''
                  : '1px solid'
              }
              borderColor="gray.200"
              className={style.popupItem}
            >
              {typeof item.icon === 'string' ? (
                <chakra.div sx={containerIconStyles}>
                  <chakra.div sx={iconStyles}>
                    <chakra.span
                      className={item.icon}
                      sx={glyphIconStyles}
                    ></chakra.span>
                  </chakra.div>
                </chakra.div>
              ) : (
                <chakra.div sx={containerIconStyles}>
                  <item.icon sx={iconStyles} />
                </chakra.div>
              )}
              <chakra.span
                fontWeight="600"
                color="#2859c0"
                display="flex"
                textAlign="center"
                className="mt-0"
              >
                {t(`server_sidebar_${item.label}_title`)}
              </chakra.span>
              {item.external && (
                <span
                  className={`external-link oui-icon oui-icon-external-link ${style.popupItemExternalLink}`}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    fontSize: '0.75rem',
                    marginTop: '0',
                  }}
                ></span>
              )}
            </Stack>
          );
        })}
    </Box>
  );
};

export default OrderPopupContent;
