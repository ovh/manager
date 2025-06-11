import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate } from 'react-router-dom';
import ipaddr from 'ipaddr.js';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId, ipFormatter } from '@/utils';
import { IpTypeEnum } from '@/data/api';
import {
  useGetIpdetails,
  useGetProductService,
  useGetGameMitigation,
} from '@/data/hooks';

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
  const { ipDetails, isLoading } = useGetIpdetails({ ip });
  const navigate = useNavigate();
  const { t } = useTranslation(['listing', NAMESPACES?.ACTIONS]);

  const productServices = useGetProductService({
    path: '/cloud/project',
    category: 'CLOUD',
  });
  const gameMitigationDetails = useGetGameMitigation({ ip: ipAddress });

  const hasServiceAttached = useMemo(
    () =>
      !!ipDetails?.routedTo?.serviceName &&
      productServices?.services?.some(
        (service) => ipDetails.routedTo.serviceName === service.serviceName,
      ),
    [ipDetails?.routedTo?.serviceName, productServices],
  );

  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: t('listingMenuReverseDns'),
      onClick: () =>
        navigate(
          urls.listingConfigureReverseDns
            .replace(urlDynamicParts.parentId, parentId)
            .replace(urlDynamicParts.optionalId, isGroup ? '' : id),
        ),
    },
    !!ipDetails?.canBeTerminated &&
      [IpTypeEnum.ADDITIONAL, IpTypeEnum.PCC, IpTypeEnum.VRACK].includes(
        ipDetails?.type,
      ) && {
        id: 1,
        label: `${t('delete', { ns: NAMESPACES.ACTIONS })} Additional IP`,
        isLoading,
        onClick: () =>
          navigate(urls.listingTerminate.replace(urlDynamicParts.id, id)),
      },
    {
      id: 2,
      label: ipDetails?.description
        ? t('listingActionEditDescription')
        : t('listingActionAddDescription'),
      onClick: () =>
        navigate(urls.listingUpsertDescription.replace(urlDynamicParts.id, id)),
    },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !hasServiceAttached &&
      Boolean(gameMitigationDetails?.result?.length) && {
        id: 3,
        label: t('listingActionManageGameMitigation'),
        onClick: () =>
          navigate(
            urls.listingConfigureGameFirewall.replace(urlDynamicParts.id, id),
          ),
      },
  ].filter(Boolean);

  return (
    <ActionMenu
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
      id={`actions-${parentId}-${isGroup ? 'block' : id}`}
    />
  );
};
