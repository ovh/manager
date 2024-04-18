import illustration from '@/assets/images/sidebar/bare-metal-cloud.png';
export default {
  id: 'baremetal-cloud',
  translation: 'sidebar_bare_metal_cloud',
  shortTranslation: 'sidebar_bare_metal_cloud_short',
  illustration,
  features: ['bare-metal-cloud'],
  routing: {
    application: 'dedicated',
    hash: '#/',
  },
  children: [
    {
      id: 'bmc-dedicated-vps',
      translation: 'sidebar_dedicated_vps',
      features: ['dedicated-server', 'vps', 'managed-bare-metal', 'license'],
      children: [
        {
          id: 'dedicated-servers',
          translation: 'sidebar_dedicated',
          serviceType: 'DEDICATED_SERVER',
          routing: {
            application: 'dedicated',
            hash: '#/server',
          },
          features: ['dedicated-server'],
        },
        {
          id: 'dedicated-housing',
          translation: 'sidebar_dedicated_housing',
          serviceType: 'DEDICATED_HOUSING',
          routing: {
            application: 'dedicated',
            hash: '#/housing',
          },
          hideIfEmpty: true,
          features: ['dedicated-server'],
        },
        {
          id: 'vps',
          translation: 'sidebar_vps',
          serviceType: 'VPS',
          routing: {
            application: 'dedicated',
            hash: '#/vps',
          },
          features: ['vps'],
        },
        {
          id: 'managed-bare-metal',
          translation: 'sidebar_dedicated_cloud',
          serviceType: 'DEDICATEDCLOUD',
          routing: {
            application: 'dedicated',
            hash: '#/managedBaremetal',
          },
          features: ['managed-bare-metal'],
        },
        {
          id: 'dedicated-licences',
          translation: 'sidebar_licences',
          serviceType: 'LICENSE',
          routing: {
            application: 'dedicated',
            hash: '#/license',
          },
          features: ['license'],
        },
      ],
    },
    {
      id: 'bmc-storage-backup',
      translation: 'sidebar_storage_backup',
      features: [
        'dedicated-nasha',
        'netapp',
        'cloud-disk-array',
        'veeam-cloud-connect',
      ],
      children: [
        {
          id: 'nasha',
          translation: 'sidebar_nasha',
          serviceType: 'DEDICATED_NASHA',
          routing: {
            application: 'dedicated',
            hash: '#/nasha',
          },
          features: ['dedicated-nasha'],
        },
        {
          id: 'netapp',
          translation: 'sidebar_netapp',
          serviceType: 'STORAGE_NETAPP',
          routing: {
            application: 'dedicated',
            hash: '#/netapp',
          },
          features: ['netapp'],
        },
        {
          id: 'cloud-disk-array',
          translation: 'sidebar_cda',
          serviceType: 'DEDICATED_CEPH',
          routing: {
            application: 'dedicated',
            hash: '#/cda',
          },
          features: ['cloud-disk-array'],
        },
        {
          id: 'veeam-cloud-connect',
          translation: 'sidebar_veeamcc',
          serviceType: 'VEEAMCLOUDCONNECT',
          routing: {
            application: 'dedicated',
            hash: '#/veeam',
          },
          features: ['veeam-cloud-connect'],
        },
      ],
    },
  ],
};
