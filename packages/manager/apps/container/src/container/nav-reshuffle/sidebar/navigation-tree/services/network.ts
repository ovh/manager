import illustration from '@/assets/images/sidebar/network.png';
export default {
  id: 'network',
  translation: 'sidebar_network',
  shortTranslation: 'sidebar_network_short',
  illustration,
  features: [
    'vrack:bare-metal-cloud',
    'ip',
    'veeam-cloud-connect',
    'ip-load-balancer',
    'dedicated-cdn',
    'network-security',
  ],
  children: [
    {
      id: 'vrack',
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
      translation: 'sidebar_network_security',
      serviceType: 'NETWORK_SECURITY',
      badge: 'beta',
      routing: {
        application: 'dedicated',
        hash: '#/network-security',
      },
      features: ['network-security'],
    },
    {
      id: 'ovhcloud-connect',
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
      translation: 'sidebar_cdn',
      serviceType: 'CDN_DEDICATED',
      routing: {
        application: 'dedicated',
        hash: '#/configuration/cdn',
      },
      features: ['dedicated-cdn'],
    },
  ],
};
