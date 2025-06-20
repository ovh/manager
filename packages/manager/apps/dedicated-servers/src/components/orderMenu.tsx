import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsPopover, OdsButton, OdsLink } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import useLinkUtils, { UrlLinks } from '@/hooks/useLinkUtils';
import { orderLinks } from '@/data/constants/orderLinks';

export const OrderMenu: React.FC = () => {
  const { t } = useTranslation('dedicated-servers');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const { trackClick } = useOvhTracking();
  const links = useLinkUtils<UrlLinks>(orderLinks);

  const linkHandler = (link: string) => (e: React.MouseEvent) => {
    trackClick({
      actionType: 'action',
      actions: ['page', 'button', 'order_dedicated-server'],
    });
    window.open(link);
    e.preventDefault();
  };

  return (
    <div className="w-min">
      <OdsButton
        icon={ODS_ICON_NAME.plus}
        size={ODS_BUTTON_SIZE.sm}
        id={`server-orders-action`}
        variant="outline"
        label={tCommon('order')}
      />
      <OdsPopover
        triggerId="server-orders-action"
        position={ODS_POPOVER_POSITION.bottomStart}
      >
        <OdsLink
          color="primary"
          className="block"
          href="#"
          target="_blank"
          icon={ODS_ICON_NAME.externalLink}
          onClick={linkHandler(links.dedicatedOrder as string)}
          label={t('server_order_dedicated')}
        />
        <OdsLink
          color="primary"
          className="block"
          href="#"
          target="_blank"
          icon={ODS_ICON_NAME.externalLink}
          onClick={linkHandler(links.dedicatedEcoRangeOrder as string)}
          label={t('server_order_eco')}
        />
      </OdsPopover>
    </div>
  );
};

export default OrderMenu;
