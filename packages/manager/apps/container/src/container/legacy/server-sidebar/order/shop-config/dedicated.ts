import { getOrderURL, ORDER_URLS } from './order.constants';

import {
  OdsIconWrapper,
  PROJECTCLOUD_SVG,
  IP_SVG,
  VPS_SVG,
  NUTANIX_SVG,
  VMWARE_SVG,
  NAS_SVG,
  VEEAM_SVG,
  VRACK_SVG,
  LINECOMMUNICATING_SVG,
  SERVER_SVG,
} from '@ovh-ux/ovh-product-icons/index';
import { OdsIconName } from '@ovhcloud/ods-core';


const dedicatedShopConfig = (
  navigation: any,
  region: string,
  sub: string,
  features: Record<string, string>,
) => [
  features['public-cloud'] && ORDER_URLS[region].publicCloudProjectOrder
    ? {
        label: 'order_item_cloud_project',
        icon: PROJECTCLOUD_SVG,
        url: getOrderURL('publicCloudProjectOrder', region, sub),
        tracking: 'dedicated::orders::public-cloud-project::order',
      }
    : null,
  features['dedicated-server:order'] && ORDER_URLS[region].dedicatedOrder
    ? {
        label: 'order_item_dedicated_server',
        icon: SERVER_SVG,
        url: getOrderURL('dedicatedOrder', region, sub),
        external: true,
        tracking: 'dedicated::orders::dedicated-servers::order',
      }
    : null,
  features.ip
    ? {
        label: 'order_item_ip',
        feature: 'ip',
        icon: IP_SVG,
        url: navigation.getURL('dedicated', '#/ip/agoraOrder?catalogName=ip'),
        tracking: 'dedicated::orders::additional-ip::order',
      }
    : null,
  features.license
    ? {
        label: 'order_item_licence',
        icon: OdsIconWrapper({ name: OdsIconName.PAGE_CERTIFICATE_CONCEPT }),
        url: navigation.getURL('dedicated', '#/configuration/license/order'),
        tracking: 'dedicated::orders::licences::order',
      }
    : null,
  features.kubernetes && ORDER_URLS[region].publicCloudKubernetes
    ? {
        label: 'order_item_kube',
        icon: OdsIconWrapper({ name: OdsIconName.APPLICATION_CONCEPT }),
        url: getOrderURL('publicCloudKubernetes', region, sub),
        external: true,
        tracking: 'dedicated::orders::managed-kubernetes::order',
      }
    : null,
  features.vps && ORDER_URLS[region].vps
    ? {
        label: 'item_vps',
        icon: VPS_SVG,
        url: getOrderURL('vps', region, sub),
        external: true,
        tracking: 'dedicated::orders::vps::order',
      }
    : null,
  features['managed-bare-metal'] && ORDER_URLS[region].managed_bare_metal
    ? {
        label: 'item_managedBaremetal',
        icon: OdsIconWrapper({ name: OdsIconName.SERVER_MANAGED_CONCEPT }),
        url: getOrderURL('managed_bare_metal', region, sub),
        external: true,
        tracking: 'dedicated::orders::mbm::order',
      }
    : null,
  features['dedicated-cloud:order'] && ORDER_URLS[region].dedicated_cloud
    ? {
        label: 'item_dedicatedClouds',
        icon: VMWARE_SVG,
        url: getOrderURL('dedicated_cloud', region, sub),
        external: true,
        tracking: 'dedicated::orders::hpc::order',
      }
    : null,
  features['cloud-disk-array'] && ORDER_URLS[region].cloud_disk_array
    ? {
        label: 'order_item_paas_cda',
        icon: OdsIconWrapper({ name: OdsIconName.CLOUD_SERVER_CONCEPT }),
        url: getOrderURL('cloud_disk_array', region, sub),
        external: true,
        tracking: 'dedicated::orders::cloud-disk-array::order',
      }
    : null,
  features['dedicated-nasha']
    ? {
        label: 'order_item_NASHA',
        icon: NAS_SVG,
        url: navigation.getURL('dedicated', '#/nasha/order'),
        tracking: 'dedicated::orders::nasha::order',
      }
    : null,
  features['veeam-cloud-connect:order'] && ORDER_URLS[region].veeam
    ? {
        label: 'order_item_paas_veeam',
        icon: VEEAM_SVG,
        url: getOrderURL('veeam', region, sub),
        external: true,
        tracking: 'dedicated::orders::veeam-cc::order',
      }
    : null,
  features['veeam-enterprise:order'] && ORDER_URLS[region].veeam_enterprise
    ? {
        label: 'order_item_paas_veeam_enterprise',
        icon: VEEAM_SVG,
        url: getOrderURL('veeam_enterprise', region, sub),
        external: true,
        tracking: 'dedicated::orders::veeam-enterprise::order',
      }
    : null,
  features['vrack:order'] && ORDER_URLS[region].vrack
    ? {
        label: 'item_vrack',
        icon: VRACK_SVG,
        url: getOrderURL('vrack', region, sub),
        external: true,
        tracking: 'dedicated::orders::vrack::order',
      }
    : null,
  features['ip-load-balancer'] && ORDER_URLS[region].load_balancer
    ? {
        label: 'order_item_iplb',
        icon: IP_SVG,
        url: getOrderURL('load_balancer', region, sub),
        external: true,
        tracking: 'dedicated::orders::ip-load-balancer::order',
      }
    : null,
  features['logs-data-platform']
    ? {
        label: 'item_logs',
        icon: OdsIconWrapper({ name: OdsIconName.GRAPH_CONCEPT }),
        url: navigation.getURL('dedicated', '#/dbaas/logs/order'),
        tracking: 'dedicated::orders::logs::order',
      }
    : null,
  features['cloud-connect'] && ORDER_URLS[region].ovh_cloud_connect
    ? {
        label: 'item_cloud_connect',
        icon: LINECOMMUNICATING_SVG,
        url: getOrderURL('ovh_cloud_connect', region, sub),
        external: true,
        tracking: 'dedicated::orders::ovh-cloud-connect::order',
      }
    : null,
  features['dedicated-server:ecoRangeOrder'] &&
  ORDER_URLS[region].dedicatedEcoRangeOrder
    ? {
        label: 'order_item_dedicated_server_eco',
        icon: OdsIconWrapper({ name: OdsIconName.SERVER_CONCEPT }),
        url: getOrderURL('dedicatedEcoRangeOrder', region, sub),
        external: true,
        tracking: 'dedicated::orders::dedicated-servers-eco::order',
      }
    : null,
  features['dedicated-server:nutanixOrder'] &&
  ORDER_URLS[region].dedicatedNutanixOrder
    ? {
        label: 'item_nutanix',
        icon: NUTANIX_SVG,
        url: getOrderURL('dedicatedNutanixOrder', region, sub),
        external: true,
        tracking: 'dedicated::orders::dedicated-servers-nutanix::order',
      }
    : null,
  features['dedicated-cloud:sapHanaOrder'] && ORDER_URLS[region].sap_hana
    ? {
        label: 'order_item_sap_hana',
        icon: VMWARE_SVG,
        url: getOrderURL('sap_hana', region, sub),
        external: true,
        tracking: 'dedicated::orders::sap-hana::order',
      }
    : null,
];

export default dedicatedShopConfig;
