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
import { getOrderURL, ORDER_URLS } from './order.constants';

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
        url: getOrderURL('publicCloudProjectOrder', region, sub),
        tracking: 'dedicated::orders::public-cloud-project::order',
      }
    : null,
  features['dedicated-server:order'] && ORDER_URLS[region].dedicatedOrder
    ? {
        label: 'order_item_dedicated_server',
        icon: OVHFontServer,
        url: getOrderURL('dedicatedOrder', region, sub),
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
        url: getOrderURL('publicCloudKubernetes', region, sub),
        external: true,
        tracking: 'dedicated::orders::managed-kubernetes::order',
      }
    : null,
  features.vps && ORDER_URLS[region].vps
    ? {
        label: 'item_vps',
        icon: OVHFontServer2,
        url: getOrderURL('vps', region, sub),
        external: true,
        tracking: 'dedicated::orders::vps::order',
      }
    : null,
  features['managed-bare-metal'] && ORDER_URLS[region].managed_bare_metal
    ? {
        label: 'item_managedBaremetal',
        icon: CloudEssentialIcon,
        url: getOrderURL('managed_bare_metal', region, sub),
        external: true,
        tracking: 'dedicated::orders::mbm::order',
      }
    : null,
  features['dedicated-cloud:order'] && ORDER_URLS[region].dedicated_cloud
    ? {
        label: 'item_dedicatedClouds',
        icon: OVHFontDedicatedCloud,
        url: getOrderURL('dedicated_cloud', region, sub),
        external: true,
        tracking: 'dedicated::orders::hpc::order',
      }
    : null,
  features['cloud-disk-array'] && ORDER_URLS[region].cloud_disk_array
    ? {
        label: 'order_item_paas_cda',
        icon: OVHFontCDA,
        url: getOrderURL('cloud_disk_array', region, sub),
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
        url: getOrderURL('veeam', region, sub),
        external: true,
        tracking: 'dedicated::orders::veeam-cc::order',
      }
    : null,
  features['veeam-enterprise:order'] && ORDER_URLS[region].veeam_enterprise
    ? {
        label: 'order_item_paas_veeam_enterprise',
        icon: OVHFontVeeam,
        url: getOrderURL('veeam_enterprise', region, sub),
        external: true,
        tracking: 'dedicated::orders::veeam-enterprise::order',
      }
    : null,
  features['vrack:order'] && ORDER_URLS[region].vrack
    ? {
        label: 'item_vrack',
        icon: OVHFontVRack,
        url: getOrderURL('vrack', region, sub),
        external: true,
        tracking: 'dedicated::orders::vrack::order',
      }
    : null,
  features['ip-load-balancer'] && ORDER_URLS[region].load_balancer
    ? {
        label: 'order_item_iplb',
        icon: OVHFontIP,
        url: getOrderURL('load_balancer', region, sub),
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
        url: getOrderURL('ovh_cloud_connect', region, sub),
        external: true,
        tracking: 'dedicated::orders::ovh-cloud-connect::order',
      }
    : null,
  features['dedicated-server:ecoRangeOrder'] &&
  ORDER_URLS[region].dedicatedEcoRangeOrder
    ? {
        label: 'order_item_dedicated_server_eco',
        icon: ServerIcon,
        url: getOrderURL('dedicatedEcoRangeOrder', region, sub),
        external: true,
        tracking: 'dedicated::orders::dedicated-servers-eco::order',
      }
    : null,
  features['dedicated-server:nutanixOrder'] &&
  ORDER_URLS[region].dedicatedNutanixOrder
    ? {
        label: 'item_nutanix',
        icon: 'oui-icon oui-icon-nutanix_concept_tm',
        url: getOrderURL('dedicatedNutanixOrder', region, sub),
        external: true,
        tracking: 'dedicated::orders::dedicated-servers-nutanix::order',
      }
    : null,
  features['dedicated-cloud:sapHanaOrder'] && ORDER_URLS[region].sap_hana
    ? {
        label: 'order_item_sap_hana',
        icon: OVHFontDedicatedCloud,
        url: getOrderURL('sap_hana', region, sub),
        external: true,
        tracking: 'dedicated::orders::sap-hana::order',
      }
    : null,
];

export default dedicatedShopConfig;
