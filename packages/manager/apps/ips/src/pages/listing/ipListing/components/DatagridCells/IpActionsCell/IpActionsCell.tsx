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
import { IpTypeEnum, PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import { ListingContext } from '@/pages/listing/listingContext';
import { isGameFirewallEnabled } from '../enableCellsUtils';
import {
  useGetIpdetails,
  useGetIpGameFirewall,
  useIpHasForcedMitigation,
  useIpHasServicesAttached,
  useGetAttachedServices,
  useIpHasVmac,
  useIpHasAlerts,
} from '@/data/hooks';

export type IpActionsCellParams = {
  ip: string;
  parentIpGroup?: string;
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

export const IpActionsCell = ({ parentIpGroup, ip }: IpActionsCellParams) => {
  const { expiredIps } = useContext(ListingContext);
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
    hasServiceAttached: hasCloudServiceAttachedToIP,
  } = useIpHasServicesAttached({
    ...PRODUCT_PATHS_AND_CATEGORIES.cloud,
    serviceName,
  });

  const {
    hasServiceAttached: hasDedicatedServiceAttachedToIp,
  } = useIpHasServicesAttached({
    ...PRODUCT_PATHS_AND_CATEGORIES.dedicated,
    serviceName,
  });

  // Case only for housing if the service doesnt exist in the product list then its housing service attched to Ip
  const { servicesAttached } = useGetAttachedServices({
    serviceName,
  });

  // Check if Ip as routTo service(serviceName) and if that serviceName is not within attached services(servicesAttached) then its housing
  const hasHousingServiceAttachedToIp =
    Boolean(serviceName) && servicesAttached.length === 0;

  const { isVmacAlreadyExist, isLoading: isVmacLoading } = useIpHasVmac({
    serviceName,
    ip,
    enabled: Boolean(ipDetails) && hasDedicatedServiceAttachedToIp,
  });

  const isIpExpired = expiredIps?.indexOf(ip) !== -1;

  const { hasAlerts } = useIpHasAlerts({
    ip: parentIpGroup || ip,
    subIp: ip,
    enabled: !isIpExpired,
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
    enabled: enabledGetGameFirewall,
  });

  const { hasForcedMitigation } = useIpHasForcedMitigation({
    ip,
    enabled: !isIpExpired,
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
    !!ipDetails?.canBeTerminated &&
      !ipDetails.bringYourOwnIp &&
      [IpTypeEnum.ADDITIONAL, IpTypeEnum.PCC, IpTypeEnum.VRACK].includes(
        ipDetails?.type,
      ) && {
        id: 2,
        label: `${t('terminate', {
          ns: NAMESPACES.ACTIONS,
        })} Additional IP`,
        isLoading,
        onClick: () =>
          navigate(
            `${urls.listingIpTerminate.replace(
              urlDynamicParts.id,
              id,
            )}?${search.toString()}`,
          ),
      },
    !!ipDetails?.canBeTerminated &&
      ipDetails.bringYourOwnIp &&
      [IpTypeEnum.ADDITIONAL, IpTypeEnum.PCC, IpTypeEnum.VRACK].includes(
        ipDetails?.type,
      ) && {
        id: 2,
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
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !hasCloudServiceAttachedToIP &&
      Boolean(ipGameFirewall?.length) && {
        id: 3,
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
        id: 4,
        label: t('listingActionConfigureEdgeNetworkFirewall'),
        onClick: () =>
          navigate(
            urls.configureEdgeNetworkFirewall.replace(urlDynamicParts.id, id),
          ),
      },
    ipaddr.IPv6.isIPv6(ipAddress) &&
      ipDetails?.type === IpTypeEnum.VRACK && {
        id: 5,
        label: t('listingActionManageSubnetInVrack'),
        onClick: () => {
          window.top.location.href = vrackPage;
        },
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      ipDetails?.type === IpTypeEnum.ADDITIONAL && {
        id: 6,
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
        id: 7,
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
        id: 8,
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
      ipDetails?.type === IpTypeEnum.ADDITIONAL &&
      !ipDetails?.bringYourOwnIp && {
        id: 10,
        label: `${t('move', { ns: NAMESPACES.ACTIONS })} Additional IP`,
        onClick: () =>
          navigate(
            `${urls.listingMoveIp.replace(
              urlDynamicParts.id,
              id,
            )}?${search.toString()}`,
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !!hasAlerts?.antihack?.length && {
        id: 11,
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
    ipDetails?.bringYourOwnIp && {
      id: 12,
      label: t('listingActionAggregate'),
      onClick: () =>
        navigate(
          `${urls.aggregate.replace(
            urlDynamicParts.parentId,
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
      isDisabled={isIpExpired}
    />
  );
};
