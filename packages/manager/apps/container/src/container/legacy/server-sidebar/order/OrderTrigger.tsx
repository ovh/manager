import { Button, chakra, Portal, useDisclosure } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { ChevronDownIcon } from '@ovh-ux/manager-themes';
import { useTranslation } from 'react-i18next';
import OrderPopupContent, { ShopItem } from './OrderPopupContent';
import OrderResponsivePopup from './OrderResponsivePopup';
import style from '../index.module.scss';

const OrderTrigger = ({ items }: { items: ShopItem[] }) => {
  const { t } = useTranslation('server-sidebar-order');
  const { isOpen, onClose, onToggle } = useDisclosure();
  const buttonRef = useRef();

  return (
    <chakra.div
      w="full"
      display="flex"
      px="4"
      pt="4"
      ref={buttonRef}
      className={style.orderButton}
    >
      <Button
        w="auto"
        backgroundColor={isOpen ? '' : '#2859c0'}
        flex={1}
        onClick={onToggle}
        h="2.5rem"
        display="flex"
        justifyContent="space-between"
        variant={isOpen ? 'secondary' : 'primary'}
        disabled={!items?.length}
        sx={
          isOpen
            ? {
                color: '#2859c0',
                _hover: {
                  backgroundColor: 'white',
                },
                _active: {
                  backgroundColor: 'white',
                },
              }
            : {}
        }
      >
        <span className="ovh-font ovh-font-cart m-1" aria-hidden="true" />
        <chakra.span paddingInlineStart="2" flex="1" textAlign="left">
          {t('sidebar_menu_order_actions')}
        </chakra.span>
        <ChevronDownIcon margin="1" />
      </Button>
      <Portal>
        {isOpen && (
          <OrderResponsivePopup button={buttonRef.current} onClose={onClose}>
            <OrderPopupContent shopItems={items} onSelect={onClose} />
          </OrderResponsivePopup>
        )}
      </Portal>
    </chakra.div>
  );
};

export default OrderTrigger;
