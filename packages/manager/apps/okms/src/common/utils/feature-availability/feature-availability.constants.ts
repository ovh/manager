const APP = 'okms';
const PRODUCT_KEY_MANAGEMENT_SERVICE = 'key-management-service';
const PRODUCT_SECRET_MANAGER = 'secret-manager';

export const KMS_FEATURES = {
  PRODUCT: `${APP}:${PRODUCT_KEY_MANAGEMENT_SERVICE}`,
  KMS_USAGE_GUIDE: `${APP}:${PRODUCT_KEY_MANAGEMENT_SERVICE}:kms-usage-guide`,
  KMIP_CONNECTION_GUIDE: `${APP}:${PRODUCT_KEY_MANAGEMENT_SERVICE}:kmip-connection-guide`,
  LOGS: `${APP}:${PRODUCT_KEY_MANAGEMENT_SERVICE}:logs`,
} as const;

export const SECRET_MANAGER_FEATURES = {
  PRODUCT: `${APP}:${PRODUCT_SECRET_MANAGER}`,
} as const;
