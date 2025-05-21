import React from 'react';
import ipaddr from 'ipaddr.js';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId, ipFormatter } from '@/utils';

export type IpActionsCellParams = {
  ip: string;
};

export const IpActionsCell = ({ ip }: IpActionsCellParams) => {
  const id = fromIpToId(ip);
  const { ip: ipAddress, isGroup } = ipFormatter(ip);
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    (ipaddr.IPv6.isIPv6(ipAddress) || !isGroup) && {
      id: 0,
      label: 'Configurer le reverse DNS',
      onClick: () =>
        navigate(urls.configureReverseDns.replace(urlDynamicParts.id, id)),
    },
  ].filter(Boolean);

  return (
    <ActionMenu
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
      id={`actions-${id}`}
    />
  );
};
