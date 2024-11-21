import React, { useEffect, useState } from 'react';
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
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import infinityCLoud from '@/assets/images/sidebar/infinity-cloud.png';
import hycuLogo from '@/assets/images/sidebar/hycu-logo.svg';
import veeamBackupLogo from '@/assets/images/sidebar/veeam-backup-logo.png';

const features = [
  'dedicated-cloud',
  'hpc-vmware-managed-vcd',
  'dedicated-cloud:sapHanaOrder',
  'nutanix',
  'veeam-enterprise',
  'dedicated-network',
  'cloud-connect',
  'netapp',
  'ip',
  'public-cloud',
  'dedicated-server:order',
  'license',
  'kubernetes',
  'vps',
  'managed-bare-metal',
  'dedicated-cloud:order',
  'cloud-disk-array',
  'dedicated-nasha',
  'veeam-backup',
  'veeam-cloud-connect:order',
  'veeam-enterprise:order',
  'hycu',
  'vrack:bare-metal-cloud',
  'vrack:order',
  'vrack-services',
  'ip-load-balancer',
  'logs-data-platform',
  'dedicated-server:ecoRangeOrder',
  'dedicated-server:nutanixOrder',
  'network-security',
  'key-management-service'
];

export default function HostedPrivateCloudSidebar() {
  const [menu, setMenu] = useState<SidebarMenuItem>(undefined);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const shell = useShell();
  const { loadServices } = useServiceLoader('dedicated');
  const { t, i18n } = useTranslation('sidebar');
  const navigation = shell.getPlugin('navigation');
  const environment = shell.getPlugin('environment').getEnvironment();
  const { ovhSubsidiary, isTrusted } = environment.getUser();
  const region = environment.getRegion();

  const getHPCMenu = (feature: Record<string, boolean>) => {
    const menu = [];

    if (feature['dedicated-cloud']) {
      menu.push({
        id: 'hpc-dedicated-cloud',
        label: t('sidebar_vmware_vsphere'),
        icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
        routeMatcher: new RegExp(`^(/configuration)?/dedicated_cloud`),
        async loader() {
          const mbm = await loadServices('/dedicatedCloud', 'EPCC');
          return [
            {
              id: 'dedicated-vmware-all',
              label: t('sidebar_vmware_all'),
              href: navigation.getURL('dedicated', '#/dedicated_cloud'),
              icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
              ignoreSearch: true,
            },
            ...mbm.map((service) => ({
              ...service,
              icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
              routeMatcher: new RegExp(
                `^(/configuration)?/dedicated_cloud/${service.serviceName}`,
              ),
              async loader() {
                return loadServices(
                  `/dedicatedCloud/${service.serviceName}/datacenter`,
                  'EPCC',
                );
              },
            })),
          ];
        },
      });
    }

    if (feature['hpc-vmware-managed-vcd']) {
      menu.push({
        id: 'hpc-managed-vcd',
        label: t('sidebar_vmware_vcd'),
        icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
        pathMatcher: new RegExp(`^/hpc-vmware-managed-vcd`),
        async loader() {
          const app = 'hpc-vmware-managed-vcd'
          const services = await loadServices('/vmwareCloudDirector/organization', null, app);
          const icon = getIcon('ovh-font ovh-font-dedicatedCloud');
          return [
            {
              id: 'dedicated-vmware-vcd-all',
              label: t('sidebar_vmware_all'),
              href: navigation.getURL(app, '/'),
              icon,
              ignoreSearch: true,
            },
            ...services.map((service) => ({
              ...service,
              icon,
              pathMatcher: new RegExp(
                `^/hpc-vmware-managed-vcd/${service.serviceName}`,
              ),
            })),
          ];
        },
      });
    }

    if (feature.nutanix) {
      menu.push({
        id: 'nutanix',
        label: t('sidebar_nutanix'),
        icon: getIcon('oui-icon oui-icon-nutanix_concept nutanix-icon_small'),
        routeMatcher: new RegExp(`^/nutanix`),
        async loader() {
          const nutanix = await loadServices('/nutanix');
          return [
            {
              id: 'hpc-nutanix-all',
              label: t('sidebar_cluster_all'),
              icon: getIcon(
                'oui-icon oui-icon-nutanix_concept nutanix-icon_small',
              ),
              href: navigation.getURL('dedicated', '#/nutanix'),
              ignoreSearch: true,
            },
            ...nutanix.map((service) => ({
              ...service,
              icon: getIcon(
                'oui-icon oui-icon-nutanix_concept nutanix-icon_small',
              ),
              async loader() {
                return loadServices(`/nutanix/${service.serviceName}`);
              },
            })),
          ];
        },
      });
    }

    if (feature['veeam-enterprise']) {
      menu.push({
        id: 'veeam-enterprise',
        label: t('sidebar_platforms_services'),
        icon: getIcon('ovh-font ovh-font-cloud-package'),
        routeMatcher: new RegExp(`^(/paas)?/veeam-enterprise`),
        async loader() {
          const services = await loadServices('/veeam/veeamEnterprise');
          return services.map((service) => ({
            ...service,
            icon: getIcon('ovh-font ovh-font-veeam'),
          }));
        },
      });
    }

    if (feature['dedicated-network']) {
      menu.push({
        id: 'hpc-network',
        label: t('sidebar_network'),
        icon: getIcon('oui-icon oui-icon-bandwidth_concept'),
        minSearchItems: 0,
        routeMatcher: new RegExp('^(/ip(/|$)|/network-security|(/network)?/iplb|/vrack|/cloud-connect|/vrack-services)'),
        pathMatcher: new RegExp('^(/vrack-services/)'),
        subItems: [
          feature.ip && {
            id: 'hpc-ip',
            label: t('sidebar_ip_short'),
            icon: getIcon('ovh-font ovh-font-ip'),
            href: navigation.getURL('dedicated', '#/ip'),
            routeMatcher: new RegExp('/ip(/|$)'),
          },
          feature['network-security'] && {
            id: 'hpc-network-security',
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
            id: 'hpc-vrack',
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
                  label: t('sidebar_service_all'),
                  href: navigation.getURL(appId, '#/'),
                  ignoreSearch: true,
                },
                ...items
              ];
            },
          },
          feature['cloud-connect'] && {
            id: 'hpc-ovhcloudconnect',
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

    if (feature['hycu'] || feature['veeam-backup']) {
      menu.push({
        id: 'hpc-storage-backup',
        label: t('sidebar_storage_backup'),
        icon: <img className="mb-1 mr-1 w-6 aspect-square" alt="" src={infinityCLoud} />,
        pathMatcher: new RegExp('^/(hycu|veeam-backup)'),
        badge: 'new',
        subItems: [
          (feature['veeam-backup']) && {
            id: 'hpc-veeam-backup',
            label: t('sidebar_veeam_backup'),
            icon: <img alt="" src={veeamBackupLogo} />,
            pathMatcher: new RegExp('^/veeam-backup'),
            async loader() {
              const appId = 'veeam-backup';
              const items = await loadServices('/vmwareCloudDirector/backup', null, appId);

              return [
                {
                  id: 'veeam-backup-all',
                  label: t('sidebar_all_veeam_backup'),
                  href: navigation.getURL(appId, '#/'),
                  ignoreSearch: true,
                },
                ...items
              ];
            },
          },
          (feature['hycu']) && {
            id: 'hpc-hycu',
            label: t('sidebar_hycu'),
            icon: <img alt="" src={hycuLogo} className="mb-1 w-6 aspect-square" />,
            pathMatcher: new RegExp('^/hycu'),
            badge: "new",
            async loader() {
              const appId = 'hycu';
              const items = await loadServices('/license/hycu');

              return [
                {
                  id: 'hycu-all',
                  label: t('sidebar_all_hycu'),
                  href: navigation.getURL(appId, '#/'),
                  ignoreSearch: true,
                },
                ...items.map((service) => ({
                  ...service,
                  href: navigation.getURL(appId, `#/${service.serviceName}`),
                }))
              ];
            },
          }
        ]
      });
    }

    if (feature['key-management-service']) {
      const keyIcon = <OsdsIcon name={ODS_ICON_NAME.KEY_CONCEPT} size={ODS_ICON_SIZE.xxs} color={ODS_THEME_COLOR_INTENT.text}/>
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
            icon: keyIcon,
            async loader() {
              const app = 'key-management-service';
              const services = await loadServices('/okms/resource', undefined, app);

              return [
                {
                  id: 'key-management-service-all',
                  label: t('sidebar_service_all'),
                  href: navigation.getURL(app, '/'),
                  ignoreSearch: true,
                  icon: keyIcon,
                },
                ...services.map((service) => ({
                  ...service,
                  pathMatcher: new RegExp(
                    `^/key-management-service/${service.serviceName}`,
                  ),
                })),
              ];
            },
          },
        ],
      });
    }
    return menu;
  };

  const {data: availability} = useFeatureAvailability(features);

  useEffect(() => {
    if (availability) {
      setMenu(
        sanitizeMenu({
          id: 'hpc-sidebar',
          label: '',
          subItems: [...getHPCMenu(availability)],
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
