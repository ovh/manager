import illustration from '@/assets/images/sidebar/security-identity-operations.png';
import { Node } from '../node';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

const sioUniverse : Node = {
  id: 'security-identity-operation',
  idAttr: 'security-identity-operation-link',
  translation: 'sidebar_security_identity_operations',
  shortTranslation: 'sidebar_security_identity_operations_short',
  illustration,
  svgIcon: OvhProductName.SECURITYIDENTITYOPERATION,
  routing: {
    application: 'iam',
  },
  count: false,
  features: ['iam', 'key-management-service'],
};

sioUniverse.children = [
  {
    id: 'security-identity',
    idAttr: 'security-identity-link',
    translation: 'sidebar_security_identity',
    children: [
      {
        id: 'security-identity-operation-iam',
        idAttr: 'security-identity-operation-iam-link',
        translation: 'sidebar_security_identity_operations_iam',
        universe: sioUniverse.id,
        routing: {
          application: 'iam',
          hash: '#/',
        },
      },
      {
        id: 'security_identity_operations_kms',
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
    children: [
      {
        id: 'security-identity-operation-logs',
        idAttr: 'security-identity-operation-logs-link',
        translation: 'sidebar_security_identity_operations_logs',
        serviceType: 'DBAAS_LOGS',
        routing: {
          application: 'dedicated',
          hash: '#/dbaas/logs',
        },
      }
    ]
  }
];
