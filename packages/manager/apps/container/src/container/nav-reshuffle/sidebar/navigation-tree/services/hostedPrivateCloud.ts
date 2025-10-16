import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import illustration from '@/assets/images/sidebar/hosted-private-cloud.png';
import { Node, NodeTag } from '../node';

const hostedPrivateCloudUniverse: Node = {
  id: 'hosted-private-cloud',
  idAttr: 'hosted-private-cloud-link',
  translation: 'sidebar_hpc',
  shortTranslation: 'sidebar_hpc_short',
  illustration,
  svgIcon: OvhProductName.LOCKCLOSE,
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
          application: 'hpc-vmware-public-vcf-aas',
          hash: '#/',
        },
        features: ['hpc-vmware-public-vcf-aas'],
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
      {
        id: 'sap-features-hub',
        idAttr: 'sap-features-hub-link',
        universe: hostedPrivateCloudUniverse.id,
        translation: 'sidebar_sap_features_hub',
        serviceType: 'SAP_FEATURES_HUB',
        routing: {
          application: 'sap-features-hub',
          hash: '#/',
        },
        features: ['sap-features-hub'],
      },
    ],
  },
  {
    id: 'hpc-storage-backup',
    idAttr: 'hpc-storage-backup-link',
    universe: hostedPrivateCloudUniverse.id,
    translation: 'sidebar_storage_backup',
    features: ['veeam-enterprise'],
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
        id: 'hycu',
        idAttr: 'hycu-link',
        universe: hostedPrivateCloudUniverse.id,
        translation: 'sidebar_hycu',
        serviceType: 'HYCU',
        tag: NodeTag.NEW,
        routing: {
          application: 'hycu',
          hash: '#/',
        },
        features: ['hycu'],
      },
      {
        id: 'veeam-backup',
        idAttr: 'veeam-backup-link',
        universe: hostedPrivateCloudUniverse.id,
        translation: 'sidebar_veeam_backup',
        serviceType: 'VEEAMBACKUP',
        tag: NodeTag.NEW,
        routing: {
          application: 'veeam-backup',
          hash: '#/',
        },
        features: ['veeam-backup'],
      },
    ],
  },
  {
    id: 'hpc-ovhcloud-backup',
    idAttr: 'hpc-ovhcloud-backup-link',
    universe: hostedPrivateCloudUniverse.id,
    translation: 'sidebar_ovhcloud_backup',
    features: ['backup-services'],
    children: [
      {
        id: 'backup-services',
        idAttr: 'backup-services-link',
        universe: hostedPrivateCloudUniverse.id,
        translation: 'sidebar_backup_services',
        serviceType: 'BACKUP_SERVICES',
        routing: {
          application: 'backup-services',
          hash: '#/',
        },
        features: ['backup-services'],
      },
    ],
  },
];

export default hostedPrivateCloudUniverse;
 