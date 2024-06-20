import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import { sanitizeMenu, SidebarMenuItem } from '../sidebarMenu';
import Sidebar from '../Sidebar';
import useServiceLoader from "./useServiceLoader";
import dedicatedShopConfig from '../order/shop-config/dedicated';
import OrderTrigger from '../order/OrderTrigger';
import { ShopItem } from '../order/OrderPopupContent';
import  getIcon  from './GetIcon';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export const features = [
  'dedicated-server',
  'vps',
  'managed-bare-metal',
  'dedicated-networks',
  'dedicated-cdn',
  'dedicated-nasha',
  'paas',
  'cloud-disk-array',
  'veeam-cloud-connect',
  'metrics',
  'dedicated-network',
  'vrack:bare-metal-cloud',
  'vrack:hosted-private-cloud',
  'cloud-connect',
  'vrack-services',
  'netapp',
  'exchange:dedicated-dashboard',
  'license',
  'ip',
  'iam',
  'public-cloud',
  'dedicated-server:order',
  'kubernetes',
  'dedicated-cloud:order',
  'dedicated-cloud:sapHanaOrder',
  'veeam-cloud-connect:order',
  'veeam-enterprise:order',
  'vrack:order',
  'ip-load-balancer',
  'logs-data-platform',
  'dedicated-server:ecoRangeOrder',
  'dedicated-server:nutanixOrder',
  'carbon-calculator',
  'network-security',
  'key-management-service'
];

export default function DedicatedSidebar() {
  const [menu, setMenu] = useState<SidebarMenuItem>(undefined);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const shell = useShell();
  const reketInstance = useReket();
  const { loadServices } = useServiceLoader('dedicated');
  const { t, i18n } = useTranslation('sidebar');
  const navigation = shell.getPlugin('navigation');
  const environment = shell.getPlugin('environment').getEnvironment();
  const { ovhSubsidiary, isTrusted } = environment.getUser();
  const region = environment.getRegion();

  const getDedicatedMenu = (feature: Record<string, string>) => {
    const menu = [];

    if (feature['dedicated-server']) {
      menu.push({
        id: 'dedicated-server',
        label: t('sidebar_dedicated'),
        icon: getIcon('ovh-font ovh-font-server'),
        routeMatcher: new RegExp('^/(configuration/)?(server|housing|cluster)'),
        async loader() {
          const clusters = await loadServices('/dedicated/cluster');
          const servers = await loadServices('/dedicated/server');
          const housing = await loadServices('/dedicated/housing');
          return [
            {
              id: 'dedicated-server-all',
              label: t('sidebar_dedicated_all'),
              icon: getIcon('ovh-font ovh-font-server'),
              href: navigation.getURL('dedicated', '#/server'),
              routeMatcher: new RegExp(`/server$`),
              ignoreSearch: true,
              title: t('sidebar_access_list'),
            },
            ...clusters.map((service) => {
              return {
                ...service,
                icon: getIcon('oui-icon oui-icon-cluster_concept'),
                async loader() {
                  return await loadServices(`/dedicated/cluster/${service.serviceName}`);
                },
              }
            }),
            ...housing,
            ...servers,
          ];
        },
      });
    }

    if (feature.vps) {
      menu.push({
        id: 'vps',
        label: t('sidebar_vps'),
        icon: getIcon('ovh-font ovh-font-cloud-root'),
        routeMatcher: new RegExp('^(/iaas)?/vps'),
        async loader() {
          const services = await loadServices('/vps');
          return services.map((service) => ({
            ...service,
            icon: getIcon('ovh-font ovh-font-vps'),
          }));
        },
      });
    }

    if (feature['managed-bare-metal']) {
      menu.push({
        id: 'dedicated-managed-bare-metal',
        label: t('sidebar_dedicated_cloud'),
        icon: getIcon('oui-icon oui-icon-cloud-essential_concept'),
        routeMatcher: new RegExp('^(/configuration)?/managedBaremetal'),
        async loader() {
          const mbm = await loadServices('/dedicatedCloud', 'MBM');
          return mbm.map((service) => ({
            ...service,
            icon: getIcon('oui-icon oui-icon-cloud-essential_concept'),
            routeMatcher: new RegExp(`managedBaremetal/${service.serviceName}`),
            async loader() {
              const services = await loadServices(
                `/dedicatedCloud/${service.serviceName}/datacenter`,
                'MBM',
              );
              return services.map((dc) => {
                const dcId = dc.stateParams.slice(-1)[0];
                return {
                  ...dc,
                  href: navigation.getURL(
                    'dedicated',
                    `#/managedBaremetal/${service.serviceName}/datacenter/${dcId}`,
                  ),
                  routeMatcher: new RegExp(`/datacenter/${dcId}`),
                };
              });
            },
          }));
        },
      });
    }

    if (feature['dedicated-networks']) {
      menu.push({
        id: 'dedicated-nasha-cdn',
        label: t('sidebar_nasha_cdn'),
        icon: getIcon('ovh-font ovh-font-network'),
        routeMatcher: new RegExp(
          '^(/configuration/cdn|/(paas/)?nasha)',
        ),
        async loader() {
          const [cdn, nasha] = await Promise.all([
            feature['dedicated-cdn'] ? loadServices('/cdn/dedicated') : [],
            feature['dedicated-nasha'] ? loadServices('/dedicated/nasha') : [],
          ]);
          return [
            ...cdn.map((cdnItem) => ({
              ...cdnItem,
              icon: getIcon('ovh-font ovh-font-cdn'),
              keywords: 'cdn',
              routeMatcher: new RegExp(
                `^/configuration/cdn/${cdnItem.serviceName}`,
              ),
              async loader() {
                return loadServices(
                  `/cdn/dedicated/${cdnItem.serviceName}/domains`,
                );
              },
            })),
            ...nasha.map((nashaItem) => ({
              ...nashaItem,
              keywords: 'nasha nas-ha',
              icon: getIcon('ovh-font ovh-font-cloudnas'),
              href: navigation.getURL(
                'dedicated',
                `/nasha/${nashaItem.serviceName}`,
              ),
            })),
          ];
        },
      });
    }

    if (feature.paas) {
      menu.push({
        id: 'dedicated-paas',
        label: t('sidebar_platforms_services'),
        icon: getIcon('ovh-font ovh-font-cloud-package'),
        routeMatcher: new RegExp('^(/paas/cda|/cda)'),
        async loader() {
          const [ceph, veeamCloudConnect] = await Promise.all([
            feature['cloud-disk-array'] ? loadServices('/dedicated/ceph') : [],
            feature['veeam-cloud-connect']
              ? loadServices('/veeamCloudConnect')
              : [],
          ]);
          return [
            ...ceph.map((cephItem) => ({
              ...cephItem,
              keywords: 'cda cloud disk array',
              icon: getIcon('ovh-font ovh-font-cloud-disk-array'),
            })),
            ...veeamCloudConnect.map((veeamccItem) => ({
              ...veeamccItem,
              keywords: 'veeamcc veeam cloud connect',
              icon: getIcon('ovh-font ovh-font-veeam'),
            })),
          ];
        },
      });
    }

    if (feature.metrics) {
      menu.push({
        id: 'metrics',
        label: t('sidebar_metrics'),
        icon: getIcon('ovh-font ovh-font-graph'),
        routeMatcher: new RegExp('^/metrics'),
        async loader() {
          return loadServices('/metrics');
        },
      });
    }

    if (feature['logs-data-platform']) {
      menu.push({
        id: 'dbaas-logs',
        label: t('sidebar_logs_db'),
        icon: getIcon('fa fa-bar-chart'),
        routeMatcher: new RegExp('^/dbaas/logs'),
        async loader() {
          const dbaas = await loadServices('/dbaas/logs');
          return [
            {
              id: 'dedicated-dbaas-all',
              label: t('sidebar_account_all'),
              href: navigation.getURL('dedicated', '#/dbaas/logs'),
              ignoreSearch: true,
            },
            ...dbaas,
          ];
        },
      });
    }

    if (feature['dedicated-network']) {
      menu.push({
        id: 'dedicated-network',
        label: t('sidebar_network'),
        icon: getIcon('oui-icon oui-icon-bandwidth_concept'),
        minSearchItems: 0,
        routeMatcher: new RegExp('^(/ip(/|$)|/network-security|/vrack|/cloud-connect|/vrack-services|(/network)?/iplb)'),
        pathMatcher: new RegExp('^(/vrack-services/)'),
        subItems: [
          feature.ip && {
            id: 'dedicated-ip',
            label: t('sidebar_ip_short'),
            icon: getIcon('ovh-font ovh-font-ip'),
            href: navigation.getURL('dedicated', '#/ip'),
            routeMatcher: new RegExp('/ip(/|$)'),
          },
          feature['network-security'] && {
            id: 'dedicated-network-security',
            label: t('sidebar_network_security'),
            icon: getIcon('oui-icon oui-icon-shield_concept'),
            href: navigation.getURL('dedicated', '#/network-security'),
            routeMatcher: new RegExp('^/network-security'),
          },
          feature['ip-load-balancer'] &&
          {
            id: 'ip-loadbalancer',
            label: t('sidebar_pci_load_balancer'),
            icon: getIcon('ovh-font ovh-font-iplb'),
            routeMatcher: new RegExp('^(/network)?/iplb'),
            async loader() {
              const iplb = await loadServices('/ipLoadbalancing');
              return [
                ...iplb.map((iplbItem) => ({
                  ...iplbItem,
                  icon: getIcon('ovh-font ovh-font-iplb'),
                })),
              ];
            },
          },
          feature['vrack:bare-metal-cloud'] && {
            id: 'dedicated-vrack',
            label: t('sidebar_vrack'),
            icon: getIcon('ovh-font ovh-font-vRack'),
            routeMatcher: new RegExp('^/vrack'),
            async loader() {
              return loadServices('/vrack');
            },
          },
          feature['vrack-services'] && {
            id: 'dedicated-vrackservices',
            badge: 'beta',
            label: t('sidebar_vrack_services'),
            icon: getIcon('oui-icon oui-icon-vRack-services_concept'),
            pathMatcher: new RegExp('^/vrack-services'),
            async loader() {
              const appId = 'vrack-services';
              const items = await loadServices('/vrackServices/resource', undefined, appId);

              return [
                {
                  id: 'vrack_services-all',
                  label: t('sidebar_all_vrack_services'),
                  href: navigation.getURL(appId, '#/'),
                  ignoreSearch: true,
                },
                ...items
              ];
            },
          },
          feature['cloud-connect'] && {
            id: 'dedicated-ovhcloudconnect',
            label: t('sidebar_cloud_connect'),
            icon: getIcon('oui-icon oui-icon-line-communicating_concept'),
            routeMatcher: new RegExp('^/cloud-connect'),
            async loader() {
              const services = await loadServices('/ovhCloudConnect');
              return [
                {
                  id: 'cloud-connect-all',
                  label: t('sidebar_service_all'),
                  href: navigation.getURL('dedicated', '#/cloud-connect'),
                  ignoreSearch: true,
                },
                ...services.map((service) => ({
                  ...service,
                  href: navigation.getURL(
                    'dedicated',
                    `#/cloud-connect/${service.serviceName}`,
                  ),
                })),
              ];
            },
          },
        ],
      });
    }

    if (feature.netapp) {
      menu.push({
        id: 'dedicated-storage',
        label: t('sidebar_storage_backup'),
        icon: getIcon('ovh-font ovh-font-cloudnas'),
        routeMatcher: new RegExp('^/netapp'),
        subItems: [
          {
            id: 'dedicated-storage-netapp',
            label: t('sidebar_netapp'),
            icon: getIcon('oui-icon oui-icon-enterprise-file-storage_concept'),
            href: navigation.getURL('dedicated', '#/netapp'),
            routeMatcher: new RegExp('^/netapp'),
            async loader() {
              return loadServices('/storage/netapp');
            },
          },
        ],
      });
    }

    if (feature['exchange:dedicated-dashboard']) {
      menu.push({
        id: 'exchange',
        label: t('sidebar_microsoft_exchange'),
        icon: getIcon('ms-Icon ms-Icon--ExchangeLogo'),
        routeMatcher: new RegExp('/exchange'),
        async loader() {
          const services = await loadServices('/email/exchange');
          return services.map((service) => ({
            ...service,
            icon: getIcon('ms-Icon ms-Icon--ExchangeLogo'),
            routeMatcher: new RegExp(`/exchange/${service.serviceName}`),
          }));
        },
      });
    }

    if (feature.license) {
      menu.push({
        id: 'dedicated-licences',
        label: t('sidebar_licences'),
        icon: getIcon('ovh-font ovh-font-certificate'),
        href: navigation.getURL('dedicated', '#/license'),
        routeMatcher: new RegExp('/license'),
      });
    }

    if (feature['key-management-service']) {
      menu.push({
        id: 'identity-security-operations',
        label: t('sidebar_identity_security_operations'),
        icon: <OsdsIcon name={ODS_ICON_NAME.CLOUD_EYE_CONCEPT} size={ODS_ICON_SIZE.xxs} color={ODS_THEME_COLOR_INTENT.text}/>,
        badge: 'new',
        pathMatcher: new RegExp('^/key-management-service'),
        subItems: [
          {
            id: 'key-management-service',
            label: t('sidebar_key-management-service'),
            href: navigation.getURL('key-management-service', '/'),
            badge: 'beta',
            pathMatcher: new RegExp('^/key-management-service'),
            icon: <OsdsIcon name={ODS_ICON_NAME.KEY_CONCEPT} size={ODS_ICON_SIZE.xxs} color={ODS_THEME_COLOR_INTENT.text}/>
          },
        ],
      });
    }

    return menu;
  };

  const getFeatures = (): Promise<Record<string, string>> =>
    reketInstance.get(`/feature/${features.join(',')}/availability`, {
      requestType: 'aapi',
    });

  const { data: availability } = useQuery({
    queryKey: ['sidebar-dedicated-availability'],
    queryFn: getFeatures,
  });

  useEffect(() => {
    if (availability) {
      setMenu(
        sanitizeMenu({
          id: 'dedicated-sidebar',
          label: '',
          subItems: [...getDedicatedMenu(availability)],
        }),
      );
      setShopItems(
        dedicatedShopConfig(navigation, region, ovhSubsidiary, availability),
      );
    }
  }, [availability, i18n.language]);

  return (
    <>
      {!isTrusted && <OrderTrigger items={shopItems} />}
      <Sidebar menu={menu} />
    </>
  );
}
