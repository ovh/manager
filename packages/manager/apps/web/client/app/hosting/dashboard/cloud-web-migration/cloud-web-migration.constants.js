export const CLOUD_WEB_MIGRATION_HIT_PREFIX =
  'web::hosting::cloud-web-migration';

export const CLOUD_WEB_MIGRATION_APPROVAL_CODE = 'CLOUDWEB_MIGRATION';

export const CLOUD_WEB_MIGRATION_RESOURCE_TYPE = 'WEB';

export const CUSTOMER_APPROVAL_URL =
  '/engine/api/v2/webhosting/customerApproval';

/* UTC instant the platform stopped recording technical blocks as refusals.
 * Before it, an `approved: false` was written for services whose
 * configuration prevents the automatic migration — no customer refused.
 * Stopgap: the day the API exposes a reason on the approval, this constant
 * and `getOutcome` in the controller are the only things to remove. */
export const CLOUD_WEB_MIGRATION_BLOCKED_BEFORE = '2026-08-27T10:17:13.036429Z';

export default {
  CLOUD_WEB_MIGRATION_BLOCKED_BEFORE,
  CLOUD_WEB_MIGRATION_HIT_PREFIX,
  CLOUD_WEB_MIGRATION_APPROVAL_CODE,
  CLOUD_WEB_MIGRATION_RESOURCE_TYPE,
  CUSTOMER_APPROVAL_URL,
};
