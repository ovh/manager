const APP = 'okms';
const PRODUCT = 'key-management-service';

const KMS_FEATURES = {
  PRODUCT: `${APP}:${PRODUCT}`,
  KMS_USAGE_GUIDE: `${APP}:${PRODUCT}:kms-usage-guide`,
  KMIP_CONNECTION_GUIDE: `${APP}:${PRODUCT}:kmip-connection-guide`,
  LOGS: `${APP}:${PRODUCT}:logs`,
  DISPLAY_CONTACTS: `${APP}:${PRODUCT}:display-contacts-management`,
} as const;

export { KMS_FEATURES };
