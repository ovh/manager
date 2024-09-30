import illustration from '@/assets/images/sidebar/bare-metal-cloud.png';
import { Node } from '../node';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

const baremetalUniverse: Node = {
  id: 'baremetal-cloud',
  idAttr: 'baremetal-cloud-link',
  translation: 'sidebar_bare_metal_cloud',
  shortTranslation: 'sidebar_bare_metal_cloud_short',
  illustration,
  svgIcon: OvhProductName.SERVERV2,
  features: ['bare-metal-cloud'],
  routing: {
    application: 'dedicated',
    hash: '#/',
  },
};

baremetalUniverse.children = [
  {
    id: 'bmc-dedicated-vps',
    universe: baremetalUniverse.id,
    idAttr: 'bmc-dedicated-vps-link',
    translation: 'sidebar_dedicated_vps',
    features: ['dedicated-server', 'vps', 'managed-bare-metal', 'license'],
    children: [
      {
        id: 'dedicated-servers',
        universe: baremetalUniverse.id,
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
        id: 'dedicated-servers',
        universe: baremetalUniverse.id,
        idAttr: 'dedicated-servers-link',
        serviceType: 'DEDICATED_CLUSTER',
        hidden: true,
        routing: {
          application: 'dedicated',
          hash: '#/cluster',
        },
        features: ['dedicated-server'],
      },
      {
        id: 'dedicated-housing',
        universe: baremetalUniverse.id,
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
        universe: baremetalUniverse.id,
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
        universe: baremetalUniverse.id,
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
        universe: baremetalUniverse.id,
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
    universe: baremetalUniverse.id,
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
        universe: baremetalUniverse.id,
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
        universe: baremetalUniverse.id,
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
        universe: baremetalUniverse.id,
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
        universe: baremetalUniverse.id,
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
];

export default baremetalUniverse;
