import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import ipaddr from 'ipaddr.js';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId, ipFormatter } from '@/utils';
import { IpTypeEnum } from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';
import { isGameFirewallEnabled } from '../enableCellsUtils';
import {
  useGetIpdetails,
  useGetIpGameFirewall,
  useIpHasForcedMitigation,
  useIpHasServicesAttached,
  useGetAttachedServices,
  useIpHasVmac,
  useGetIpMitigationWithoutIceberg,
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

/*
    If its not permanent mitigation then display listingManageMitigation_DEFAULT_to_PERMANENT
    If its permanent mitigation(PERMANENT) And mitigation state is Ok then display listingManageMitigation_PERMANENT_to_AUTO
    If its permanent mitigation(PERMANENT) OR mitigation state is Ok And if mitigation is auto (FORCED) then enable listingManageMitigation_stats
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
  const { t } = useTranslation(['listing', NAMESPACES?.ACTIONS]);
  const isAdmin = useContext(ShellContext)
    .environment?.getUser()
    .auth?.roles?.includes('ADMIN');

  const serviceName = ipDetails?.routedTo?.serviceName;
  const {
    hasServiceAttached: hasCloudServiceAttachedToIP,
  } = useIpHasServicesAttached({
    path: '/cloud/project',
    category: 'CLOUD',
    serviceName,
  });

  const {
    hasServiceAttached: hasDedicatedServiceAttachedToIp,
  } = useIpHasServicesAttached({
    path: '/dedicated/server',
    category: 'DEDICATED',
    serviceName,
  });

  // Case only for housing if the service doesnt exist in the product list then its housing service attched to Ip
  const { servicesAttached } = useGetAttachedServices({
    serviceName,
  });

  // Check if Ip as routTo service(serviceName) and if that serviceName is not within attached services(servicesAttached) then its housing
  const hasHousingServiceAttachedToIp =
    Boolean(serviceName) && servicesAttached.length === 0;

  const { isVmacAlreadyExist } = useIpHasVmac({
    serviceName,
    ip,
    enabled: Boolean(ipDetails) && hasDedicatedServiceAttachedToIp,
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

  const goToVrackPage = () => {
    window.top.location.href = vrackPage;
  };

  const isIpExpired = expiredIps?.indexOf(ip) !== -1;

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
  const {
    ipMitigation,
    isLoading: isMitigationLoading,
  } = useGetIpMitigationWithoutIceberg({
    ip: ipAddress,
    enabled: !isIpExpired,
  });

  const isDefaultMitigation = Object.keys(ipMitigation).length === 0;

  const disableManageMitigationAction =
    ipMitigation?.state === 'creationPending' ||
    ipMitigation?.state === 'removalPending';

  const items: ActionMenuItem[] = [
    !parentIpGroup && {
      id: 0,
      label: ipDetails?.description
        ? t('listingActionEditDescription')
        : t('listingActionAddDescription'),
      onClick: () =>
        navigate(
          urls.upsertDescription
            .replace(urlDynamicParts.parentId, parentId)
            .replace(urlDynamicParts.optionalId, isGroup ? '' : id),
        ),
    },
    {
      id: 1,
      label: t('listingMenuReverseDns'),
      onClick: () =>
        navigate(
          urls.listingConfigureReverseDns
            .replace(urlDynamicParts.parentId, parentId)
            .replace(urlDynamicParts.optionalId, isGroup ? '' : id),
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
          navigate(urls.listingIpTerminate.replace(urlDynamicParts.id, id)),
      },
    !!ipDetails?.canBeTerminated &&
      ipDetails.bringYourOwnIp &&
      isAdmin &&
      [IpTypeEnum.ADDITIONAL, IpTypeEnum.PCC, IpTypeEnum.VRACK].includes(
        ipDetails?.type,
      ) && {
        id: 2,
        label: t('listingActionByoipTerminate'),
        isLoading,
        onClick: () =>
          navigate(urls.listingByoipTerminate.replace(urlDynamicParts.id, id)),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !hasCloudServiceAttachedToIP &&
      Boolean(ipGameFirewall?.length) && {
        id: 3,
        label: t('listingActionManageGameMitigation'),
        onClick: () =>
          navigate(urls.configureGameFirewall.replace(urlDynamicParts.id, id)),
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
        onClick: () => goToVrackPage(),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      ipDetails?.type === IpTypeEnum.ADDITIONAL && {
        id: 6,
        label: t('listingActionAddVirtualMac'),
        onClick: () =>
          navigate(
            urls.addVirtualMac
              .replace(urlDynamicParts.id, id)
              .replace(urlDynamicParts.service, serviceName),
          ),
        isDisabled: !hasDedicatedServiceAttachedToIp || isVmacAlreadyExist,
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      ipDetails?.type === IpTypeEnum.ADDITIONAL &&
      isVmacAlreadyExist &&
      hasDedicatedServiceAttachedToIp && {
        id: 7,
        label: t('listingActionViewVirtualMac'),
        onClick: () =>
          navigate(
            urls.viewVirtualMac
              .replace(urlDynamicParts.id, id)
              .replace(urlDynamicParts.service, serviceName),
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      isVmacAlreadyExist && {
        id: 8,
        label: t('listingActionDeleteVirtualMac'),
        onClick: () =>
          navigate(
            urls.deleteVirtualMac
              .replace(urlDynamicParts.id, id)
              .replace(urlDynamicParts.service, serviceName),
          ),
      },
    !isGroup &&
      ipaddr.IPv4.isIPv4(ipAddress) &&
      !hasHousingServiceAttachedToIp &&
      ipMitigation && {
        id: 9,
        label: isDefaultMitigation
          ? t('listingManageMitigation_DEFAULT_to_PERMANENT')
          : t('listingManageMitigation_PERMANENT_to_AUTO'),
        onClick: () =>
          navigate(urls.manageIpMitigation.replace(urlDynamicParts.id, id)),
        isDisabled: isMitigationLoading || disableManageMitigationAction,
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
