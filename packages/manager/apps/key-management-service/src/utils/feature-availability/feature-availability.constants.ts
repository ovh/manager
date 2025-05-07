const APP = 'key-management-service';

const KMS_FEATURE = 'key-management-service';

const KMS_FEATURES = {
  KMS_USAGE_GUIDE: `${APP}:${KMS_FEATURE}:kms-usage-guide`,
  KMIP_CONNECTION_GUIDE: `${APP}:${KMS_FEATURE}:kmip-connection-guide`,
  LOGS: `${APP}:${KMS_FEATURE}:logs`,
} as const;

export { KMS_FEATURES };
