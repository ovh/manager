import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsPopover, OdsButton, OdsLink } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';
import useLinkUtils, { UrlLinks } from '@/hooks/useLinkUtils';
import { orderLinks } from '@/data/constants/orderLinks';

export const OrderMenu: React.FC = () => {
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('dedicated-servers');
  const { trackClick } = useOvhTracking();
  const links = useLinkUtils<UrlLinks>(orderLinks);

  return (
    <div className="w-min">
      <OdsButton
        icon={ODS_ICON_NAME.plus}
        size={ODS_BUTTON_SIZE.sm}
        id={`server-orders-action`}
        variant="outline"
        label={t('commander')}
      ></OdsButton>
      <OdsPopover
        triggerId={`server-orders-action`}
        withArrow={false}
        position={ODS_POPOVER_POSITION.bottomStart}
      >
        <div>
          <OdsLink
            color="primary"
            href="#"
            target="_blank"
            icon={ODS_ICON_NAME.externalLink}
            onClick={(e) => {
              window.open(links.dedicatedOrder as string);
              e.preventDefault();
            }}
            label={t('server_order_dedicated')}
          ></OdsLink>
        </div>
        <div>
          <OdsLink
            color="primary"
            href="#"
            target="_blank"
            icon={ODS_ICON_NAME.externalLink}
            onClick={(e) => {
              window.open(links.dedicatedEcoRangeOrder as string);
              e.preventDefault();
            }}
            label={t('server_order_eco')}
          ></OdsLink>
        </div>
      </OdsPopover>
    </div>
  );
};

export default OrderMenu;
