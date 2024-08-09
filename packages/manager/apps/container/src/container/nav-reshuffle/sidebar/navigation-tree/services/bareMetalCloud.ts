import illustration from '@/assets/images/sidebar/bare-metal-cloud.png';
export default {
  id: 'baremetal-cloud',
  idAttr: 'baremetal-cloud-link',
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
      idAttr: 'bmc-dedicated-vps-link',
      translation: 'sidebar_dedicated_vps',
      features: ['dedicated-server', 'vps', 'managed-bare-metal', 'license'],
      children: [
        {
          id: 'dedicated-servers',
          idAttr: 'dedicated-servers-link',
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
          idAttr: 'dedicated-housing-link',
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
          idAttr: 'vps-link',
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
          idAttr: 'managed-bare-metal-link',
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
          idAttr: 'dedicated-licences-link',
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
      idAttr: 'bmc-storage-backup-link',
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
          idAttr: 'nasha-link',
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
          idAttr: 'netapp-link',
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
          idAttr: 'cloud-disk-array-link',
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
          idAttr: 'veeam-cloud-connect-link',
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
