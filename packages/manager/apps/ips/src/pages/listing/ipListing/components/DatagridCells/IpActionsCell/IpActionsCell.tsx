import { useContext, useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import ipaddr from 'ipaddr.js';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { IpTypeEnum } from '@/data/constants';
import {
  useGetAttachedServices,
  useGetIpGameFirewall,
  useGetIpdetails,
  useIpHasAlerts,
  useIpHasVmac,
} from '@/data/hooks';
import {
  canAggregateByoipIp,
  canSliceByoipIp,
  canTerminateByoipIp,
} from '@/pages/byoip/Byoip.utils';
import { ListingContext } from '@/pages/listing/listingContext';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import {
  fromIpToId,
  ipFormatter,
  IAM_ACTION,
  TRANSLATION_NAMESPACES,
} from '@/utils';

import { isGameFirewallAvailable } from '../enableCellsUtils';

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
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.listing,
    NAMESPACES.ACTIONS,
  ]);
  const { trackClick } = useOvhTracking();

  const serviceName = ipDetails?.routedTo?.serviceName;

  const {
    hasCloudServiceAttachedToIP,
    hasDedicatedServiceAttachedToIp,
    hasHousingServiceAttachedToIp,
    hasVrackAttachedToIp,
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
    subIp: parentIpGroup ? ip : undefined,
    enabled: !isIpExpired && !isByoipSlice,
  });

  useEffect(() => {
    if (!!serviceName && hasVrackAttachedToIp) {
      shell.navigation
        .getURL('dedicated', `#/vrack/${serviceName}`, {})
        .then((response) => {
          setVrackPage(response as string);
        });
    }
  }, [serviceName, shell.navigation, hasVrackAttachedToIp]);

  // not expired and additionnal / dedicated Ip linked to a dedicated server
  const availableGetGameFirewall =
    !isIpExpired && !isLoading && isGameFirewallAvailable(ipDetails);

  // Get game firewall info
  const { ipGameFirewall } = useGetIpGameFirewall({
    ip: parentIpGroup || ip,
    ipOnGame: parentIpGroup ? ip : ipAddress,
    enabled: availableGetGameFirewall,
  });

  const items = [
    !parentIpGroup && {
      id: 0,
      label: ipDetails?.description
        ? t('listingActionEditDescription')
        : t('listingActionAddDescription'),
      trackingLabel: ipDetails?.description
        ? 'edit_description'
        : 'add_description',
      iamActions: [IAM_ACTION.ipEdit],
      urn: ipDetails?.iam?.urn,
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
      trackingLabel: 'configure_reverse-dns',
      iamActions: [IAM_ACTION.reverseCreate, IAM_ACTION.reverseDelete],
      urn: ipDetails?.iam?.urn,
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
      !!ipGameFirewall?.ipOnGame && {
        id: 2,
        label: t('listingActionManageGameFirewall'),
        trackingLabel: 'configure_game-firewall',
        onClick: () =>
          navigate(
            `${urls.configureGameFirewall
              .replace(
                urlDynamicParts.parentId,
                parentIpGroup ? fromIpToId(parentIpGroup) : id,
              )
              .replace(
                urlDynamicParts.id,
                fromIpToId(ipGameFirewall.ipOnGame),
              )}?${search.toString()}`,
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !hasHousingServiceAttachedToIp && {
        id: 3,
        label: t('listingActionConfigureEdgeNetworkFirewall'),
        trackingLabel: 'configure_edge-network-firewall',
        onClick: () =>
          navigate(
            `${urls.configureEdgeNetworkFirewall
              .replace(urlDynamicParts.parentId, parentIpGroup ? parentId : id)
              .replace(urlDynamicParts.id, id)}?${search.toString()}`,
          ),
      },
    ipaddr.IPv6.isIPv6(ipAddress) &&
      ipDetails?.type === IpTypeEnum.VRACK && {
        id: 4,
        label: t('listingActionManageSubnetInVrack'),
        trackingLabel: 'manage_subnet-in-vrack',
        onClick: () => {
          window.top.location.href = vrackPage;
        },
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      ipDetails?.type === IpTypeEnum.ADDITIONAL && {
        id: 5,
        label: t('listingActionAddVirtualMac'),
        trackingLabel: 'add_virtual-mac',
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
        trackingLabel: 'view_virtual-mac',
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
        trackingLabel: 'delete_virtual-mac',
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
        trackingLabel: 'move_additional-ip',
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
        trackingLabel: 'unblock_hacked-ip',
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
        trackingLabel: 'unblock_spammed-ip',
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
      trackingLabel: 'slice_bring-your-own-ip',
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
      trackingLabel: 'aggregate_bring-your-own-ip',
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
        trackingLabel: 'terminate_additional-ip',
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
      trackingLabel: 'terminate_bring-your-own-ip',
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
      !ipDetails?.bringYourOwnIp &&
      [
        IpTypeEnum.ADDITIONAL,
        IpTypeEnum.PCC,
        IpTypeEnum.VRACK,
        IpTypeEnum.CLOUD,
        IpTypeEnum.DEDICATED,
      ].includes(ipDetails?.type) && {
        id: 15,
        label: t('listingActionUpdateIpBlockInformation'),
        trackingLabel: 'update_ip-block-information',
        onClick: () =>
          navigate(
            `${urls.ipBlockInformation.replace(
              urlDynamicParts.id,
              parentId,
            )}?${search.toString()}`,
          ),
      },
  ]
    .filter(Boolean)
    .map((item) => ({
      ...item,
      onClick: () => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [
            (item as { trackingLabel: string }).trackingLabel ||
              (item as ActionMenuItem)?.label,
          ],
        });
        (item as ActionMenuItem).onClick?.();
      },
    })) as ActionMenuItem[];

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
