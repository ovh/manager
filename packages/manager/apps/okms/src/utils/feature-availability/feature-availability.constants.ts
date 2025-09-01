const APP = 'key-management-service';

const KMS_FEATURES = {
  APP,
  KMS_USAGE_GUIDE: `${APP}:kms-usage-guide`,
  KMIP_CONNECTION_GUIDE: `${APP}:kmip-connection-guide`,
  LOGS: `${APP}:logs`,
  DISPLAY_CONTACTS: `${APP}:display-contacts-management`,
} as const;

export { KMS_FEATURES };
