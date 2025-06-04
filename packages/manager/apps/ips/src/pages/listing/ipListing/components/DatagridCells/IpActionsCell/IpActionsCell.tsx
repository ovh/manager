import React from 'react';
import { useTranslation } from 'react-i18next';
import ipaddr from 'ipaddr.js';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate } from 'react-router-dom';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId, ipFormatter } from '@/utils';
import { useGetIpdetails } from '@/data/hooks/ip';
import { IpTypeEnum } from '@/data/api';

export type IpActionsCellParams = {
  ip: string;
};

export const IpActionsCell = ({ ip }: IpActionsCellParams) => {
  const id = fromIpToId(ip);
  const { ip: ipAddress, isGroup } = ipFormatter(ip);
  const { ipDetails, isLoading } = useGetIpdetails({ ip });
  const navigate = useNavigate();
  const { t: tcommon } = useTranslation([NAMESPACES?.ACTIONS]);
  const items: ActionMenuItem[] = [
    (ipaddr.IPv6.isIPv6(ipAddress) || !isGroup) && {
      id: 0,
      label: 'Configurer le reverse DNS',
      onClick: () =>
        navigate(urls.configureReverseDns.replace(urlDynamicParts.id, id)),
    },
    !isLoading &&
      !!ipDetails?.canBeTerminated &&
      (ipDetails?.type === IpTypeEnum.ADDITIONAL ||
        ipDetails?.type === IpTypeEnum.PCC ||
        ipDetails?.type === IpTypeEnum.VRACK) && {
        id: 1,
        label: `${tcommon('delete')} Additional IP`,
        onClick: () =>
          navigate(urls.listingTerminate.replace(urlDynamicParts.id, id)),
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
