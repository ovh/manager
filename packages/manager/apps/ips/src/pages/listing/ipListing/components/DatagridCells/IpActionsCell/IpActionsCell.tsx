import React from 'react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId, ipFormatter } from '@/utils';

export type IpActionsCellParams = {
  ip: string;
  parentIpGroup?: string;
};

/*
  6 use cases possible:
  single IPv4 <=> parentIpGroup = undefined, ip = ipv4, isGroup = false, ipGroup = ip/32
    display => ip + nothing

  single IPv6 <=> parentIpGroup = undefined, ip = ipv6, isGroup = false, ipGroup = ip/128
    display => ip + nothing

  single IPv4 inside block <=> parentIpGroup = ipv4/range, ip = ipv4, isGroup = false, ipGroup = ip/32
    display => ip + parent IP

  single IPv6 inside block <=> parentIpGroup = ipv6/range, ip = ipv6, isGroup = false, ipGroup = ip/128
    display => ip + parent IP

  block IPv4 <=> parentIpGroup = undefined, ip = ipv4/range, isGroup = true, ipGroup = ip/range
    display => nothing + parent IP

  block IPv6 <=> parentIpGroup = undefined, ip = ipv4/range, isGroup = true, ipGroup = ip/range
    display => nothing + parent IP
 */
export const IpActionsCell = ({ parentIpGroup, ip }: IpActionsCellParams) => {
  const { ipAddress, ipGroup, isGroup } = ipFormatter(ip);
  const parentId = fromIpToId(parentIpGroup || ipGroup);
  const id = fromIpToId(ipAddress);
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: 'Configurer le reverse DNS',
      onClick: () =>
        navigate(
          urls.configureReverseDns
            .replace(urlDynamicParts.parentId, parentId)
            .replace(urlDynamicParts.optionalId, isGroup ? '' : id),
        ),
    },
  ];

  return (
    <ActionMenu
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
      id={`actions-${parentId}-${id}`}
    />
  );
};
