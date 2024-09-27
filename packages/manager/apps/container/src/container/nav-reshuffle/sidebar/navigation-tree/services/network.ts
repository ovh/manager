import illustration from '@/assets/images/sidebar/network.png';
import { Node } from '../node';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

const networkUniverse: Node = {
  id: 'network',
  idAttr: 'network-link',
  translation: 'sidebar_network',
  shortTranslation: 'sidebar_network_short',
  illustration,
  svgIcon: OvhProductName.NETWORKV2,
  features: [
    'vrack:bare-metal-cloud',
    'ip',
    'veeam-cloud-connect',
    'ip-load-balancer',
    'dedicated-cdn',
    'network-security',
    'vrack-services',
  ],
};

networkUniverse.children = [
  {
    id: 'vrack',
    idAttr: 'vrack-link',
    universe: networkUniverse.id,
    translation: 'sidebar_vrack',
    serviceType: 'VRACK',
    routing: {
      application: 'dedicated',
      hash: '#/vrack',
    },
    features: ['vrack:bare-metal-cloud'],
  },
  {
    id: 'ip',
    idAttr: 'ip-link',
    universe: networkUniverse.id,
    translation: 'sidebar_ip',
    serviceType: 'IP_SERVICE',
    routing: {
      application: 'dedicated',
      hash: '#/ip',
    },
    features: ['ip'],
  },
  {
    id: 'dedicated-network-security',
    idAttr: 'dedicated-network-security-link',
    universe: networkUniverse.id,
    translation: 'sidebar_network_security',
    serviceType: 'NETWORK_SECURITY',
    routing: {
      application: 'dedicated',
      hash: '#/network-security',
    },
    features: ['network-security'],
  },
  {
    id: 'ovhvrack-services',
    idAttr: 'ovhvrack-services-link',
    universe: networkUniverse.id,
    translation: 'sidebar_vrack_services',
    serviceType: 'VRACKSERVICES',
    badge: 'beta',
    routing: {
      application: 'vrack-services',
      hash: '#/',
    },
    features: ['vrack-services'],
  },
  {
    id: 'ovhcloud-connect',
    idAttr: 'ovhcloud-connect-link',
    universe: networkUniverse.id,
    translation: 'sidebar_cloud_connect',
    serviceType: 'OVHCLOUDCONNECT',
    routing: {
      application: 'dedicated',
      hash: '#/cloud-connect',
    },
    features: ['cloud-connect'],
  },
  {
    id: 'iplb',
    idAttr: 'iplb-link',
    universe: networkUniverse.id,
    translation: 'sidebar_iplb',
    serviceType: 'IPLOADBALANCING',
    routing: {
      application: 'dedicated',
      hash: '#/iplb',
    },
    features: ['ip-load-balancer'],
  },
  {
    id: 'cdn',
    idAttr: 'cdn-link',
    universe: networkUniverse.id,
    translation: 'sidebar_cdn',
    serviceType: 'CDN_DEDICATED',
    routing: {
      application: 'dedicated',
      hash: '#/configuration/cdn',
    },
    features: ['dedicated-cdn'],
  },
];

export default networkUniverse;
