const APP = 'key-management-service';

const FEATURES = {
  APP,
  KMS_USAGE_GUIDE: `${APP}:kms-usage-guide`,
  KMIP_CONNECTION_GUIDE: `${APP}:kmip-connection-guide`,
} as const;

export { FEATURES };
