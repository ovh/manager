import illustration from '@/assets/images/sidebar/security-identity-operations.png';
import { Node } from '../node';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

const sioUniverse : Node = {
  id: 'security-identity-operation',
  idAttr: 'security-identity-operation-link',
  translation: 'sidebar_security_identity_operations',
  shortTranslation: 'sidebar_security_identity_operations_short',
  illustration,
  svgIcon: OvhProductName.SHIELDCHECK,
  routing: {
    application: 'iam',
  },
  count: false,
  features: ['iam', 'key-management-service', 'logs-data-platform'],
};

sioUniverse.children = [
  {
    id: 'security-identity',
    idAttr: 'security-identity-link',
    translation: 'sidebar_security_identity',
    universe: sioUniverse.id,
    features: ['iam', 'key-management-service'],
    children: [
      {
        id: 'security-identity-operation-iam',
        idAttr: 'security-identity-operation-iam-link',
        translation: 'sidebar_security_identity_operations_iam',
        universe: sioUniverse.id,
        features: ['iam'],
        routing: {
          application: 'iam',
          hash: '#/',
        },
      },
      {
        id: 'security-identity-operations-kms',
        idAttr: 'security-identity-operations-kms-link',
        translation: 'sidebar_security_identity_operations_kms',
        universe: sioUniverse.id,
        features: ['key-management-service'],
        routing: {
          application: 'key-management-service',
          hash: '#/',
        },
      },
    ]
  },
  {
    id: 'security-operations',
    idAttr: 'security-operations-link',
    translation: 'sidebar_security_operations',
    universe: sioUniverse.id,
    features:['logs-data-platform'],
    children: [
      {
        id: 'security-identity-operation-logs',
        idAttr: 'security-identity-operation-logs-link',
        translation: 'sidebar_security_identity_operations_logs',
        universe: sioUniverse.id,
        serviceType: 'DBAAS_LOGS',
        features:['logs-data-platform'],
        routing: {
          application: 'dedicated',
          hash: '#/dbaas/logs',
        },
      }
    ]
  }
];

export default sioUniverse;