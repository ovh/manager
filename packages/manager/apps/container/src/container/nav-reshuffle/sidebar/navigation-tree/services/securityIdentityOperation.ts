import { Node } from '../node';

const sioUniverse : Node = {
  id: 'security-identity-operations',
  translation: 'sidebar_security_identity_operations',
  shortTranslation: 'sidebar_security_identity_operations_short',
  routing: {
    application: 'iam',
  },
  count: false,
  features: ['iam'],
};

sioUniverse.children = [
  {
    id: 'security-identity-operation-iam',
    universe: sioUniverse.id,
    translation: 'sidebar_security_identity_operations_iam',
    routing: {
      application: 'iam',
      hash: '#/',
    },
  },
  {
    id: 'security-identity-operation-logs',
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
