import illustration from '@/assets/images/sidebar/bare-metal-cloud.png';
import {Node} from '../node';

const baremetalUniverse: Node = {
  id: 'baremetal-cloud',
  translation: 'sidebar_bare_metal_cloud',
  shortTranslation: 'sidebar_bare_metal_cloud_short',
  illustration,
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
    translation: 'sidebar_dedicated_vps',
    features: ['dedicated-server', 'vps', 'managed-bare-metal', 'license'],
    children: [
      {
        id: 'dedicated-servers',
        universe: baremetalUniverse.id,
        translation: 'sidebar_dedicated',
        serviceType: 'DEDICATED_SERVER',
        routing: {
          application: 'dedicated',
          hash: '#/server',
        },
        features: ['dedicated-server'],
      },
      {
        id: 'dedicated-cluster',
        universe: baremetalUniverse.id,
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
