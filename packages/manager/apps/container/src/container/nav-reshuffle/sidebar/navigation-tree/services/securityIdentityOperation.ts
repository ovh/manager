
export default {
  id: 'security-identity-operation',
  translation: 'sidebar_security_identity_operations',
  shortTranslation: 'sidebar_security_identity_operations_short',
  routing: {
    application: 'iam',
  },
  count: false,
  features: ['iam', 'key-management-service', 'logs-data-platform'],
  children: [
    {
      id: 'security-identity',
      translation: 'sidebar_security_identity',
      features: ['iam', 'key-management-service'],
      children: [
        {
          id: 'security-identity-operation-iam',
          translation: 'sidebar_security_identity_operations_iam',
          features: ['iam'],
          routing: {
            application: 'iam',
            hash: '#/',
          },
        },
        {
          id: 'security_identity_operations_kms',
          translation: 'sidebar_security_identity_operations_kms',
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
      translation: 'sidebar_security_operations',
      features:['logs-data-platform'],
      children: [
        {
          id: 'security-identity-operation-logs',
          translation: 'sidebar_security_identity_operations_logs',
          serviceType: 'DBAAS_LOGS',
          features:['logs-data-platform'],
          routing: {
            application: 'dedicated',
            hash: '#/dbaas/logs',
          },
        }
      ]
    }
  ],
};
