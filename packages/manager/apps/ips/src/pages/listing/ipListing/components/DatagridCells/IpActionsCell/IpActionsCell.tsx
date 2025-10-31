import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ipaddr from 'ipaddr.js';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId, ipFormatter } from '@/utils';
import { IpTypeEnum } from '@/data/constants';
import { ListingContext } from '@/pages/listing/listingContext';
import { isGameFirewallEnabled } from '../enableCellsUtils';
import {
  useGetIpdetails,
  useGetIpGameFirewall,
  useIpHasForcedMitigation,
  useGetAttachedServices,
  useIpHasVmac,
  useIpHasAlerts,
} from '@/data/hooks';
import {
  canAggregateByoipIp,
  canSliceByoipIp,
  canTerminateByoipIp,
} from '@/pages/byoip/Byoip.utils';

export type IpActionsCellParams = {
  ip: string;
  parentIpGroup?: string;
  isByoipSlice?: boolean;
};
/*
  list of category and path map in order to check if the ip is attached to that category
  categoryAndPathMapping = [
        {
            category: "CLOUD",
            path: "/cloud/project",
        },{
            category: "VRACK",
            path: "/vrack",
        },{
            category: "DEDICATED",
            path: "/dedicated/server"
        },{
            category: "HOUSING",
            path: "/dedicated/housing",
        },{
            category: "PRIVATE_CLOUD",
            path: "/dedicatedCloud"
        },{
            category: "VPS",
            path: "/vps",
        },{
            category: "IP_LOAD_BALANCING",
            path: "/ipLoadbalancing",
        }
    ];

*/

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

export const IpActionsCell = ({
  parentIpGroup,
  ip,
  isByoipSlice = false,
}: IpActionsCellParams) => {
  const {
    expiredIps,
    onGoingCreatedIps,
    onGoingSlicedIps,
    onGoingAggregatedIps,
  } = useContext(ListingContext);
  const { shell } = useContext(ShellContext);
  const [vrackPage, setVrackPage] = useState('');
  const { ipAddress, ipGroup, isGroup } = ipFormatter(ip);
  const parentId = fromIpToId(parentIpGroup || ipGroup);
  const id = fromIpToId(ipAddress);
  const { ipDetails, isLoading } = useGetIpdetails({
    ip: parentIpGroup || ip,
  });
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { t } = useTranslation(['listing', NAMESPACES?.ACTIONS]);

  const serviceName = ipDetails?.routedTo?.serviceName;

  const {
    hasCloudServiceAttachedToIP,
    hasDedicatedServiceAttachedToIp,
    hasHousingServiceAttachedToIp,
  } = useGetAttachedServices({
    serviceName,
  });

  const { isVmacAlreadyExist, isLoading: isVmacLoading } = useIpHasVmac({
    serviceName,
    ip,
    enabled: Boolean(ipDetails) && hasDedicatedServiceAttachedToIp,
  });

  const isIpExpired = expiredIps?.indexOf(ip) !== -1;

  const { hasAlerts } = useIpHasAlerts({
    ip: parentIpGroup || ip,
    subIp: ip,
    enabled: !isIpExpired && !isByoipSlice,
  });

  useEffect(() => {
    if (!serviceName) return;
    const fetchUrl = async () => {
      try {
        const response = await shell.navigation.getURL(
          'dedicated',
          `#/vrack/${serviceName}`,
          {},
        );
        setVrackPage(response as string);
      } catch {
        setVrackPage('#');
      }
    };
    fetchUrl();
  }, [serviceName, shell.navigation]);

  // not expired and additionnal / dedicated Ip linked to a dedicated server
  const enabledGetGameFirewall =
    !isIpExpired && !isLoading && isGameFirewallEnabled(ipDetails);

  // Get game firewall info
  const { ipGameFirewall } = useGetIpGameFirewall({
    ip: parentIpGroup || ipAddress,
    enabled: enabledGetGameFirewall && !isByoipSlice,
  });

  const { hasForcedMitigation } = useIpHasForcedMitigation({
    ip,
    enabled: !isIpExpired && !isByoipSlice,
  });

  const items: ActionMenuItem[] = [
    !parentIpGroup && {
      id: 0,
      label: ipDetails?.description
        ? t('listingActionEditDescription')
        : t('listingActionAddDescription'),
      onClick: () =>
        navigate(
          `${urls.upsertDescription
            .replace(urlDynamicParts.parentId, parentId)
            .replace(
              urlDynamicParts.optionalId,
              isGroup ? '' : id,
            )}?${search.toString()}`,
        ),
    },
    {
      id: 1,
      label: t('listingMenuReverseDns'),
      onClick: () =>
        navigate(
          `${urls.listingConfigureReverseDns
            .replace(urlDynamicParts.parentId, parentId)
            .replace(
              urlDynamicParts.optionalId,
              isGroup ? '' : id,
            )}?${search.toString()}`,
        ),
    },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !hasCloudServiceAttachedToIP &&
      Boolean(ipGameFirewall?.length) && {
        id: 2,
        label: t('listingActionManageGameMitigation'),
        onClick: () =>
          navigate(
            `${urls.configureGameFirewall.replace(
              urlDynamicParts.id,
              id,
            )}?${search.toString()}`,
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !hasForcedMitigation &&
      !hasHousingServiceAttachedToIp && {
        id: 3,
        label: t('listingActionConfigureEdgeNetworkFirewall'),
        onClick: () =>
          navigate(
            `${urls.configureEdgeNetworkFirewall.replace(
              urlDynamicParts.id,
              id,
            )}?${search.toString()}`,
          ),
      },
    ipaddr.IPv6.isIPv6(ipAddress) &&
      ipDetails?.type === IpTypeEnum.VRACK && {
        id: 4,
        label: t('listingActionManageSubnetInVrack'),
        onClick: () => {
          window.top.location.href = vrackPage;
        },
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      ipDetails?.type === IpTypeEnum.ADDITIONAL && {
        id: 5,
        label: t('listingActionAddVirtualMac'),
        onClick: () =>
          navigate(
            `${urls.addVirtualMac
              .replace(urlDynamicParts.id, id)
              .replace(
                urlDynamicParts.service,
                serviceName,
              )}?${search.toString()}`,
          ),
        isDisabled:
          !hasDedicatedServiceAttachedToIp ||
          isVmacAlreadyExist ||
          isVmacLoading,
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      ipDetails?.type === IpTypeEnum.ADDITIONAL &&
      !isVmacLoading &&
      isVmacAlreadyExist &&
      hasDedicatedServiceAttachedToIp && {
        id: 6,
        label: t('listingActionViewVirtualMac'),
        onClick: () =>
          navigate(
            `${urls.viewVirtualMac
              .replace(urlDynamicParts.id, id)
              .replace(
                urlDynamicParts.service,
                serviceName,
              )}?${search.toString()}`,
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !isVmacLoading &&
      isVmacAlreadyExist && {
        id: 7,
        label: t('listingActionDeleteVirtualMac'),
        onClick: () =>
          navigate(
            `${urls.deleteVirtualMac
              .replace(urlDynamicParts.id, id)
              .replace(
                urlDynamicParts.service,
                serviceName,
              )}?${search.toString()}`,
          ),
      },
    ipaddr.IPv4.isIPv4(ipAddress) &&
      ipDetails?.isAdditionalIp &&
      !parentIpGroup &&
      !isByoipSlice && {
        id: 8,
        label: `${t('move', { ns: NAMESPACES.ACTIONS })} Additional IP`,
        onClick: () =>
          navigate(
            `${urls.listingMoveIp.replace(
              urlDynamicParts.id,
              isGroup ? parentId : id,
            )}?${search.toString()}`,
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !!hasAlerts?.antihack?.length && {
        id: 9,
        label: t('listingActionUnblockHackedIP'),
        onClick: () =>
          navigate(
            `${urls.unblockAntiHack
              .replace(urlDynamicParts.id, id)
              .replace(urlDynamicParts.parentId, parentId)
              .replace(
                urlDynamicParts.service,
                serviceName,
              )}?${search.toString()}`,
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !!hasAlerts?.spam?.length && {
        id: 10,
        label: t('listingActionUnblockSpammedIP'),
        onClick: () =>
          navigate(
            `${urls.unblockAntiSpam
              .replace(urlDynamicParts.id, id)
              .replace(urlDynamicParts.parentId, parentId)
              .replace(
                urlDynamicParts.service,
                serviceName,
              )}?${search.toString()}`,
          ),
      },
    canSliceByoipIp({ isByoipSlice, ip, ipDetails }) && {
      id: 11,
      label: t('listingActionSlice'),
      isDisabled:
        onGoingSlicedIps?.includes(ip) || onGoingAggregatedIps?.includes(ip),
      onClick: () =>
        navigate(
          `${urls.slice.replace(
            urlDynamicParts.parentId,
            parentId,
          )}?${search.toString()}`,
        ),
    },
    canAggregateByoipIp({
      isByoipSlice,
      ip,
      parentIpGroup,
      ipDetails,
    }) && {
      id: 12,
      label: t('listingActionAggregate'),
      isDisabled:
        onGoingSlicedIps?.includes(ip) || onGoingAggregatedIps?.includes(ip),
      onClick: () =>
        navigate(
          `${urls.aggregate.replace(
            urlDynamicParts.parentId,
            parentId,
          )}?${search.toString()}`,
        ),
    },
    !!ipDetails?.canBeTerminated &&
      !ipDetails.bringYourOwnIp &&
      !parentIpGroup &&
      [IpTypeEnum.ADDITIONAL, IpTypeEnum.PCC, IpTypeEnum.VRACK].includes(
        ipDetails?.type,
      ) && {
        id: 13,
        label: `${t('terminate', {
          ns: NAMESPACES.ACTIONS,
        })} Additional IP`,
        isLoading,
        onClick: () =>
          navigate(
            `${urls.listingIpTerminate.replace(
              urlDynamicParts.id,
              parentId,
            )}?${search.toString()}`,
          ),
      },
    canTerminateByoipIp({
      ipDetails,
      parentIpGroup,
      isByoipSlice,
    }) && {
      id: 14,
      label: t('listingActionByoipTerminate'),
      isLoading,
      onClick: () =>
        navigate(
          `${urls.listingByoipTerminate.replace(
            urlDynamicParts.id,
            id,
          )}?${search.toString()}`,
        ),
    },
    isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      [
        IpTypeEnum.ADDITIONAL,
        IpTypeEnum.PCC,
        IpTypeEnum.VRACK,
        IpTypeEnum.CLOUD,
        IpTypeEnum.DEDICATED,
      ].includes(ipDetails?.type) && {
        id: 15,
        label: t('listingActionUpdateIpBlockInformation'),
        onClick: () =>
          navigate(
            `${urls.ipBlockInformation.replace(
              urlDynamicParts.id,
              parentId,
            )}?${search.toString()}`,
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
      isDisabled={
        isIpExpired ||
        onGoingCreatedIps?.includes(ip) ||
        onGoingAggregatedIps?.includes(ip) ||
        onGoingSlicedIps?.includes(ip)
      }
    />
  );
};
