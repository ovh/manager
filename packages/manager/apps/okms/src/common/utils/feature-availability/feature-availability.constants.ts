import { APP_NAME } from '@/App.constants';

const PRODUCT_KEY_MANAGEMENT_SERVICE = 'key-management-service';
const PRODUCT_SECRET_MANAGER = 'secret-manager';

export const KMS_FEATURES = {
  PRODUCT: `${APP_NAME}:${PRODUCT_KEY_MANAGEMENT_SERVICE}`,
  KMS_USAGE_GUIDE: `${APP_NAME}:${PRODUCT_KEY_MANAGEMENT_SERVICE}:kms-usage-guide`,
  KMIP_CONNECTION_GUIDE: `${APP_NAME}:${PRODUCT_KEY_MANAGEMENT_SERVICE}:kmip-connection-guide`,
  LOGS: `${APP_NAME}:${PRODUCT_KEY_MANAGEMENT_SERVICE}:logs`,
} as const;

export const SECRET_MANAGER_FEATURES = {
  PRODUCT: `${APP_NAME}:${PRODUCT_SECRET_MANAGER}`,
} as const;
