import illustration from '@/assets/images/sidebar/hosted-private-cloud.png';
export default {
  id: 'hosted-private-cloud',
  idAttr: 'hosted-private-cloud-link',
  translation: 'sidebar_hpc',
  shortTranslation: 'sidebar_hpc_short',
  illustration,
  features: ['hosted-private-cloud'],
  children: [
    {
      id: 'hpc-platforms',
      idAttr: 'hpc-platforms-link',
      translation: 'sidebar_platforms',
      features: ['dedicated-cloud', 'nutanix', 'license'],
      children: [
        {
          id: 'vm-ware',
          idAttr: 'vm-ware-link',
          translation: 'sidebar_vmware',
          serviceType: 'DEDICATEDCLOUD_VMWARE',
          routing: {
            application: 'dedicated',
            hash: '#/dedicated_cloud',
          },
          features: ['dedicated-cloud'],
        },
        {
          id: 'nutanix',
          idAttr: 'nutanix-link',
          translation: 'sidebar_nutanix',
          serviceType: 'NUTANIX',
          routing: {
            application: 'dedicated',
            hash: '#/nutanix',
          },
          features: ['nutanix'],
        },
        {
          id: 'hpc-licences',
          idAttr: 'hpc-licences-link',
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
      id: 'hpc-storage-backup',
      idAttr: 'hpc-storage-backup-link',
      translation: 'sidebar_storage_backup',
      features: ['veeam-enterprise', 'veeam-cloud-connect'],
      children: [
        {
          id: 'veeam-enterprise',
          idAttr: 'veeam-enterprise-link',
          translation: 'sidebar_veeam_enterprise',
          serviceType: 'VEEAM_VEEAMENTERPRISE',
          routing: {
            application: 'dedicated',
            hash: '#/veeam-enterprise',
          },
          features: ['veeam-enterprise'],
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
