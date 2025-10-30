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
import ExportCsv from './exportCsv';

export const OrderMenu: React.FC<{ flattenData: any }> = ({ flattenData }) => {
  const { t } = useTranslation('dedicated-servers');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const { trackClick } = useOvhTracking();
  const links = useLinkUtils<UrlLinks>(orderLinks);

  const linkHandler = (trackName: string, link: string) => (
    e: React.MouseEvent,
  ) => {
    trackClick({
      actionType: 'action',
      actions: ['page', 'button', trackName],
    });
    window.open(link);
    e.preventDefault();
  };

  return (
    <div className="w-min">
      <div className="flex">
        <OdsButton
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          className="mr-3"
          id={`server-orders-action`}
          variant="outline"
          label={tCommon('order')}
        />
        <ExportCsv flattenData={flattenData} />
      </div>
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
          onClick={linkHandler(
            'order_dedicated-server',
            links.dedicatedOrder as string,
          )}
          label={t('server_order_dedicated')}
        />
        <OdsLink
          color="primary"
          className="block"
          href="#"
          target="_blank"
          icon={ODS_ICON_NAME.externalLink}
          onClick={linkHandler(
            'order_eco-dedicated-server',
            links.dedicatedEcoRangeOrder as string,
          )}
          label={t('server_order_eco')}
        />
      </OdsPopover>
    </div>
  );
};

export default OrderMenu;
