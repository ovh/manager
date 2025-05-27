import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import illustration from '@/assets/images/sidebar/security-identity-operations.png';
import { Node, NodeTag } from '../node';

const sioUniverse: Node = {
  id: 'security-identity-operation',
  idAttr: 'security-identity-operation-link',
  translation: 'sidebar_security_identity_operations',
  shortTranslation: 'sidebar_security_identity_operations_short',
  illustration,
  svgIcon: OvhProductName.SHIELDCHECK,
  routing: {
    application: 'iam',
  },
  hasService: false,
  features: ['key-management-service', 'logs-data-platform', 'identity-access-management'],
};

sioUniverse.children = [
  {
    id: 'iam',
    idAttr: 'iam-link',
    translation: 'sidebar_security_identity_operations_iam',
    universe: sioUniverse.id,
    features: ['identity-access-management'],
    children: [
      {
        id: 'iam-identities',
        idAttr: 'iam-identities-link',
        translation: 'sidebar_security_identity_operations_iam_identities',
        universe: sioUniverse.id,
        features: ['identity-access-management:identities'],
        routing: {
          application: 'iam',
          hash: '#/identities',
        },
      },
      {
        id: 'iam-policies',
        idAttr: 'iam-policies-link',
        translation: 'sidebar_security_identity_operations_iam_policies',
        universe: sioUniverse.id,
        features: ['identity-access-management:policies'],
        routing: {
          application: 'iam',
          hash: '#/policies',
        },
      },
      {
        id: 'iam-api-keys',
        idAttr: 'iam-api-keys-link',
        translation: 'sidebar_security_identity_operations_iam_api-keys',
        universe: sioUniverse.id,
        features: ['identity-access-management:api-keys'],
        routing: {
          application: 'iam',
          hash: '#/api-keys',
        },
      },
      {
        id: 'iam-logs',
        idAttr: 'iam-logs-link',
        translation: 'sidebar_security_identity_operations_iam_logs',
        universe: sioUniverse.id,
        tag: NodeTag.BETA,
        features: ['identity-access-management:logs'],
        routing: {
          application: 'iam',
          hash: '#/logs',
        },
      },
    ]
  },
  {
    id: 'security-identity',
    idAttr: 'security-identity-link',
    translation: 'sidebar_security_identity',
    universe: sioUniverse.id,
    features: ['key-management-service'],
    children: [
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
      {
        id: 'security-identity-operations-sms',
        idAttr: 'security-identity-operations-sms-link',
        translation: 'sidebar_security_identity_operations_sms',
        universe: sioUniverse.id,
        features: ['key-management-service:secret-management-service'],
        routing: {
          application: 'key-management-service',
          hash: '#/secret-management-service',
        },
      },
    ],
  },
  {
    id: 'security-operations',
    idAttr: 'security-operations-link',
    translation: 'sidebar_security_operations',
    universe: sioUniverse.id,
    features: ['logs-data-platform'],
    children: [
      {
        id: 'security-identity-operation-logs',
        idAttr: 'security-identity-operation-logs-link',
        translation: 'sidebar_security_identity_operations_logs',
        universe: sioUniverse.id,
        serviceType: 'DBAAS_LOGS',
        features: ['logs-data-platform'],
        routing: {
          application: 'dedicated',
          hash: '#/dbaas/logs',
        },
      },
    ],
  },
];

export default sioUniverse;
