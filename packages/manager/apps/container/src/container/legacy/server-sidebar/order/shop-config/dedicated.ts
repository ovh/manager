import {
  OVHFontPublicCloud,
  OVHFontServer,
  OVHFontIP,
  OVHFontCertificate,
  OVHFontK8s,
  OVHFontServer2,
  CloudEssentialIcon,
  OVHFontDedicatedCloud,
  OVHFontCDA,
  OVHFontCloudNAS,
  OVHFontVeeam,
  OVHFontVRack,
  LineCommunicatingIcon,
  ServerIcon,
} from '@ovh-ux/manager-themes';
import { ORDER_URLS } from './order.constants';

const dedicatedShopConfig = (
  navigation: any,
  region: string,
  sub: string,
  features: Record<string, string>,
) => [
  features['public-cloud'] && ORDER_URLS[region].publicCloudProjectOrder
    ? {
        label: 'order_item_cloud_project',
        icon: OVHFontPublicCloud,
        url: ORDER_URLS[region].publicCloudProjectOrder[sub],
        tracking: 'dedicated::orders::public-cloud-project::order',
      }
    : null,
  features['dedicated-server:order'] && ORDER_URLS[region].dedicatedOrder
    ? {
        label: 'order_item_dedicated_server',
        icon: OVHFontServer,
        url: ORDER_URLS[region].dedicatedOrder[sub],
        external: true,
        tracking: 'dedicated::orders::dedicated-servers::order',
      }
    : null,
  features.ip
    ? {
        label: 'order_item_ip',
        feature: 'ip',
        icon: OVHFontIP,
        url: navigation.getURL('dedicated', '#/ip/agoraOrder?catalogName=ip'),
        tracking: 'dedicated::orders::additional-ip::order',
      }
    : null,
  features.license
    ? {
        label: 'order_item_licence',
        icon: OVHFontCertificate,
        url: navigation.getURL('dedicated', '#/configuration/license/order'),
        tracking: 'dedicated::orders::licences::order',
      }
    : null,
  features.kubernetes && ORDER_URLS[region].publicCloudKubernetes
    ? {
        label: 'order_item_kube',
        icon: OVHFontK8s,
        url: ORDER_URLS[region].publicCloudKubernetes[sub],
        external: true,
        tracking: 'dedicated::orders::managed-kubernetes::order',
      }
    : null,
  features.vps && ORDER_URLS[region].vps
    ? {
        label: 'item_vps',
        icon: OVHFontServer2,
        url: ORDER_URLS[region].vps[sub],
        external: true,
        tracking: 'dedicated::orders::vps::order',
      }
    : null,
  features['managed-bare-metal'] && ORDER_URLS[region].managed_bare_metal
    ? {
        label: 'item_managedBaremetal',
        icon: CloudEssentialIcon,
        url: ORDER_URLS[region].managed_bare_metal[sub],
        external: true,
        tracking: 'dedicated::orders::mbm::order',
      }
    : null,
  features['dedicated-cloud:order'] && ORDER_URLS[region].dedicated_cloud
    ? {
        label: 'item_dedicatedClouds',
        icon: OVHFontDedicatedCloud,
        url: ORDER_URLS[region].dedicated_cloud[sub],
        external: true,
        tracking: 'dedicated::orders::hpc::order',
      }
    : null,
  features['cloud-disk-array'] && ORDER_URLS[region].cloud_disk_array
    ? {
        label: 'order_item_paas_cda',
        icon: OVHFontCDA,
        url: ORDER_URLS[region].cloud_disk_array[sub],
        external: true,
        tracking: 'dedicated::orders::cloud-disk-array::order',
      }
    : null,
  features['dedicated-nasha']
    ? {
        label: 'order_item_NASHA',
        icon: OVHFontCloudNAS,
        url: navigation.getURL('dedicated', '#/nasha/order'),
        tracking: 'dedicated::orders::nasha::order',
      }
    : null,
  features['veeam-cloud-connect:order'] && ORDER_URLS[region].veeam
    ? {
        label: 'order_item_paas_veeam',
        icon: OVHFontVeeam,
        url: ORDER_URLS[region].veeam[sub],
        external: true,
        tracking: 'dedicated::orders::veeam-cc::order',
      }
    : null,
  features['veeam-enterprise:order'] && ORDER_URLS[region].veeam_enterprise
    ? {
        label: 'order_item_paas_veeam_enterprise',
        icon: OVHFontVeeam,
        url: ORDER_URLS[region].veeam_enterprise[sub],
        external: true,
        tracking: 'dedicated::orders::veeam-enterprise::order',
      }
    : null,
  features['vrack:order'] && ORDER_URLS[region].vrack
    ? {
        label: 'item_vrack',
        icon: OVHFontVRack,
        url: ORDER_URLS[region].vrack[sub],
        external: true,
        tracking: 'dedicated::orders::vrack::order',
      }
    : null,
  features['ip-load-balancer'] && ORDER_URLS[region].load_balancer
    ? {
        label: 'order_item_iplb',
        icon: OVHFontIP,
        url: ORDER_URLS[region].load_balancer[sub],
        external: true,
        tracking: 'dedicated::orders::ip-load-balancer::order',
      }
    : null,
  features['logs-data-platform']
    ? {
        label: 'item_logs',
        icon: 'fa fa-bar-chart',
        url: navigation.getURL('dedicated', '#/dbaas/logs/order'),
        tracking: 'dedicated::orders::logs::order',
      }
    : null,
  features['cloud-connect'] && ORDER_URLS[region].ovh_cloud_connect
    ? {
        label: 'item_cloud_connect',
        icon: LineCommunicatingIcon,
        url: ORDER_URLS[region].ovh_cloud_connect[sub],
        external: true,
        tracking: 'dedicated::orders::ovh-cloud-connect::order',
      }
    : null,
  features['dedicated-server:ecoRangeOrder'] &&
  ORDER_URLS[region].dedicatedEcoRangeOrder
    ? {
        label: 'order_item_dedicated_server_eco',
        icon: ServerIcon,
        url: ORDER_URLS[region].dedicatedEcoRangeOrder[sub],
        external: true,
        tracking: 'dedicated::orders::dedicated-servers-eco::order',
      }
    : null,
  features['dedicated-server:nutanixOrder'] &&
  ORDER_URLS[region].dedicatedNutanixOrder
    ? {
        label: 'item_nutanix',
        icon: 'oui-icon oui-icon-nutanix_concept_tm',
        url: ORDER_URLS[region].dedicatedNutanixOrder[sub],
        external: true,
        tracking: 'dedicated::orders::dedicated-servers-nutanix::order',
      }
    : null,
];

export default dedicatedShopConfig;
