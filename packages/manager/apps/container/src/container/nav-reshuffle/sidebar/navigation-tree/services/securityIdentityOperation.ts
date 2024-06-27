export default {
  id: 'security-identity-operation',
  idAttr: 'security-identity-operation-link',
  translation: 'sidebar_security_identity_operations',
  shortTranslation: 'sidebar_security_identity_operations_short',
  routing: {
    application: 'iam',
  },
  count: false,
  features: ['iam'],
  children: [
    {
      id: 'security-identity-operation-iam',
      idAttr: 'security-identity-operation-iam-link',
      translation: 'sidebar_security_identity_operations_iam',
      routing: {
        application: 'iam',
        hash: '#/',
      },
    },
    {
      id: 'security-identity-operation-logs',
      idAttr: 'security-identity-operation-logs-link',
      translation: 'sidebar_security_identity_operations_logs',
      serviceType: 'DBAAS_LOGS',
      routing: {
        application: 'dedicated',
        hash: '#/dbaas/logs',
      },
    },
  ],
};
