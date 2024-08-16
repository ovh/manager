import illustration from '@/assets/images/sidebar/security-identity-operations.png';
import { Node } from '../node';

const sioUniverse : Node = {
  id: 'security-identity-operation',
  idAttr: 'security-identity-operation-link',
  translation: 'sidebar_security_identity_operations',
  shortTranslation: 'sidebar_security_identity_operations_short',
  illustration,
  routing: {
    application: 'iam',
  },
  count: false,
  features: ['iam'],
};

sioUniverse.children = [
  {
    id: 'security-identity-operation-iam',
    idAttr: 'security-identity-operation-iam-link',
    universe: sioUniverse.id,
    translation: 'sidebar_security_identity_operations_iam',
    routing: {
      application: 'iam',
      hash: '#/',
    },
  },
  {
    id: 'security-identity-operation-logs',
    idAttr: 'security-identity-operation-logs-link',
    universe: sioUniverse.id,
    translation: 'sidebar_security_identity_operations_logs',
    serviceType: 'DBAAS_LOGS',
    routing: {
      application: 'dedicated',
      hash: '#/dbaas/logs',
    },
  },
];

export default sioUniverse;
