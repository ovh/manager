import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import { sanitizeMenu, SidebarMenuItem } from '../sidebarMenu';
import Sidebar from '../Sidebar';
import { useServiceLoader } from './useServiceLoader';
import dedicatedShopConfig from '../order/shop-config/dedicated';
import OrderTrigger from '../order/OrderTrigger';
import { ShopItem } from '../order/OrderPopupContent';

function getIcon(iconClass: string): JSX.Element {
  return <span className={`${iconClass} mr-1`} aria-hidden="true" />;
}

const features = [
  'dedicated-cloud',
  'anthos',
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
  'veeam-cloud-connect:order',
  'veeam-enterprise:order',
  'vrack:bare-metal-cloud',
  'vrack:order',
  'ip-load-balancer',
  'logs-data-platform',
  'dedicated-server:ecoRangeOrder',
  'dedicated-server:nutanixOrder',
];

export default function HostedPrivateCloudSidebar() {
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

  const getHPCMenu = (feature: Record<string, string>) => {
    const menu = [];

    if (feature['dedicated-cloud']) {
      menu.push({
        id: 'hpc-dedicated-cloud',
        label: t('sidebar_vmware'),
        icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
        routeMatcher: new RegExp(`^(/configuration)?/dedicated_cloud`),
        async loader() {
          const mbm = await loadServices('/dedicatedCloud', 'EPCC');
          return mbm.map((service) => ({
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
          }));
        },
      });
    }

    if (feature.anthos) {
      menu.push({
        id: 'anthos',
        label: t('sidebar_anthos'),
        icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
        routeMatcher: new RegExp(`^/anthos`),
        async loader() {
          const anthos = await loadServices('/dedicated/anthos/tenants');
          return [
            {
              id: 'dedicated-anthos-all',
              label: t('sidebar_anthos_all'),
              href: navigation.getURL('dedicated', '#/anthos'),
              icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
              ignoreSearch: true,
            },
            ...anthos.map((service) => ({
              ...service,
              icon: getIcon('ovh-font ovh-font-dedicatedCloud'),
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
        routeMatcher: new RegExp('^(/vrack|/cloud-connect)'),
        subItems: [
          feature['vrack:bare-metal-cloud'] && {
            id: 'hpc-vrack',
            label: t('sidebar_vrack'),
            icon: getIcon('ovh-font ovh-font-vRack'),
            routeMatcher: new RegExp('^/vrack'),
            async loader() {
              return loadServices('/vrack');
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

    if (feature.ip) {
      menu.push({
        id: 'hpc-ip',
        label: t('sidebar_ip_short'),
        icon: getIcon('ovh-font ovh-font-ip'),
        href: navigation.getURL('dedicated', '#/ip'),
        routeMatcher: new RegExp('/ip(/|$)'),
      });
    }

    return menu;
  };

  const getFeatures = (): Promise<Record<string, string>> =>
    reketInstance.get(`/feature/${features.join(',')}/availability`, {
      requestType: 'aapi',
    });

  const { data: availability } = useQuery(
    ['sidebar-hpc-availability'],
    getFeatures,
  );

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
