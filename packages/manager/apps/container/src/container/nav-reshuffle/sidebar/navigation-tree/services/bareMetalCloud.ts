import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import illustration from '@/assets/images/sidebar/bare-metal-cloud.png';
import { Node } from '../node';

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
    features: ['dedicated-server', 'vps', 'dedicated-servers:container', 'managed-bare-metal', 'license'],
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
        hideIfFeatures: ['dedicated-servers:container'],
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
        hideIfFeatures: ['dedicated-servers:container'],
      },
      {
        id: 'dedicated-servers-react',
        universe: baremetalUniverse.id,
        idAttr: 'dedicated-servers-link',
        translation: 'sidebar_dedicated',
        serviceType: 'DEDICATED_SERVER',
        routing: {
          application: 'dedicated-servers',
          hash: '#/',
          pathMatcher: /(\/dedicated\/(configuration|server))|\/dedicated-servers/,
          
        },
        features: ['dedicated-servers:container'],
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
    ],
  },
];

export default baremetalUniverse;
