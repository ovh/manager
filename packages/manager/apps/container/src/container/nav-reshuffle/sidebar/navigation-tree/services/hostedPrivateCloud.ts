import illustration from '@/assets/images/sidebar/hosted-private-cloud.png';
import { NodeTag, Node } from '../node';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

const hostedPrivateCloudUniverse: Node = {
  id: 'hosted-private-cloud',
  idAttr: 'hosted-private-cloud-link',
  translation: 'sidebar_hpc',
  shortTranslation: 'sidebar_hpc_short',
  illustration,
  svgIcon: OvhProductName.HOSTEDPRIVATECLOUD,
  features: ['hosted-private-cloud'],
};

hostedPrivateCloudUniverse.children = [
  {
    id: 'hpc-platforms',
    idAttr: 'hpc-platforms-link',
    universe: hostedPrivateCloudUniverse.id,
    translation: 'sidebar_platforms',
    features: ['dedicated-cloud', 'nutanix', 'license'],
    children: [
      {
        id: 'vm-ware',
        idAttr: 'vm-ware-link',
        universe: hostedPrivateCloudUniverse.id,
        translation: 'sidebar_vmware_vsphere',
        serviceType: 'DEDICATEDCLOUD_VMWARE',
        routing: {
          application: 'dedicated',
          hash: '#/dedicated_cloud',
        },
        features: ['dedicated-cloud'],
      },
      {
        id: 'hpc-managed-vcd',
        universe: hostedPrivateCloudUniverse.id,
        translation: 'sidebar_vmware_vcd',
        serviceType: 'MANAGED_VCD',
        tag: NodeTag.NEW,
        routing: {
          application: 'hpc-vmware-managed-vcd',
          hash: '#/',
        },
        features: ['hpc-vmware-managed-vcd'],
      },
      {
        id: 'nutanix',
        idAttr: 'nutanix-link',
        universe: hostedPrivateCloudUniverse.id,
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
        universe: hostedPrivateCloudUniverse.id,
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
    universe: hostedPrivateCloudUniverse.id,
    translation: 'sidebar_storage_backup',
    features: ['veeam-enterprise', 'veeam-cloud-connect'],
    children: [
      {
        id: 'veeam-enterprise',
        idAttr: 'veeam-enterprise-link',
        universe: hostedPrivateCloudUniverse.id,
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
        universe: hostedPrivateCloudUniverse.id,
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
];

export default hostedPrivateCloudUniverse;
