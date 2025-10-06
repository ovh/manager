const ALERT_ID = 'iam_alert';

const API_ERROR = {
  POLICY: {
    NAME: [
      'INVALID_FORMAT',
      'INVALID_PARAMETER',
      'MISSING_PARAMETER',
      'PARAMETER_TOO_LONG',
      'POLICY_ALREADY_EXISTS',
    ],
  },
};

const CUSTOM_ACTION_PATTERN = /(^\*)|(\*$)/;

const CUSTOM_ACTION_SAMPLE = 'vps:apiovh:automatedBackup/*';

const CUSTOM_ACTION_WILDCARD_PATTERN = /^[^\d]*\*$/;

const CUSTOM_RESOURCE_TYPE = 'custom';

const WILDCARD = '*';

const DELETE_STATEMENT = 'Terminate';

const ACTION_DESCRIPTION_UNDEFINED = 'missing description';

const FEATURE = {
  MAIN: 'iam',
  IDENTITIES: 'identity-access-management:identities',
  POLICIES: 'identity-access-management:policies',
  APIKEYS: 'identity-access-management:api-keys',
};

const ENTITY = {
  POLICY: 'policy',
  IDENTITY: 'identity',
  RESOURCE_GROUP: 'resourceGroup',
  RESOURCE_TYPE: 'resourceType',
  API_KEY: 'apiKey',
};

const ENTITY_NAME_PATTERN = /^[a-zA-Z0-9-/_+]*$/;
const ENTITY_DESCRIPTION_PATTERN = /^[a-zA-Z0-9-/_+ ]*$/;

const IDENTITY_TYPE = {
  USER: 'user',
  GROUP: 'group',
  ACCOUNT: 'account',
  SERVICE_ACCOUNT: 'credential',
};

const GUIDE = {
  IAM: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058729',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058720',
    AU:
      'https://help.ovhcloud.com/csm/en-au-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058722',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058724',
    DE:
      'https://help.ovhcloud.com/csm/de-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058723',
    ES:
      'https://help.ovhcloud.com/csm/es-es-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058728',
    FR:
      'https://help.ovhcloud.com/csm/fr-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058730',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058725',
    IN:
      'https://help.ovhcloud.com/csm/asia-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058720',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058732',
    IT:
      'https://help.ovhcloud.com/csm/it-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058734',
    PL:
      'https://help.ovhcloud.com/csm/pl-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058733',
    PT:
      'https://help.ovhcloud.com/csm/pt-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058731',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058735',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058726',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/19185780752019-Using-IAM-Policies-with-the-OVHcloud-Control-Panel',
    WE:
      'https://help.ovhcloud.com/csm/en-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058729',
    WS:
      'https://help.ovhcloud.com/csm/es-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058727',
  },
  USERS: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-account-managing-users?id=kb_article_view&sysparm_article=KB0043055',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-account-managing-users?id=kb_article_view&sysparm_article=KB0043053',
    AU:
      'https://help.ovhcloud.com/csm/en-au-account-managing-users?id=kb_article_view&sysparm_article=KB0043056',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-account-managing-users?id=kb_article_view&sysparm_article=KB0043050',
    DE:
      'https://help.ovhcloud.com/csm/de-account-managing-users?id=kb_article_view&sysparm_article=KB0043054',
    ES:
      'https://help.ovhcloud.com/csm/es-es-account-managing-users?id=kb_article_view&sysparm_article=KB0043340',
    FR:
      'https://help.ovhcloud.com/csm/fr-account-managing-users?id=kb_article_view&sysparm_article=KB0043058',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-account-managing-users?id=kb_article_view&sysparm_article=KB0030017',
    IN:
      'https://help.ovhcloud.com/csm/asia-account-managing-users?id=kb_article_view&sysparm_article=KB0043053',
    IT:
      'https://help.ovhcloud.com/csm/it-account-managing-users?id=kb_article_view&sysparm_article=KB0043350',
    PL:
      'https://help.ovhcloud.com/csm/pl-account-managing-users?id=kb_article_view&sysparm_article=KB0043060',
    PT:
      'https://help.ovhcloud.com/csm/pt-account-managing-users?id=kb_article_view&sysparm_article=KB0043348',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-account-managing-users?id=kb_article_view&sysparm_article=KB0043059',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-account-managing-users?id=kb_article_view&sysparm_article=KB0043057',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/360000589270-How-to-Manage-Authorized-Users',
    WE:
      'https://help.ovhcloud.com/csm/en-account-managing-users?id=kb_article_view&sysparm_article=KB0043055',
    WS:
      'https://help.ovhcloud.com/csm/es-account-managing-users?id=kb_article_view&sysparm_article=KB0043061',
  },
  SAMLSSO: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0042998',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0042995',
    AU:
      'https://help.ovhcloud.com/csm/en-au-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043006',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0029959',
    DE:
      'https://help.ovhcloud.com/csm/de-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043007',
    ES:
      'https://help.ovhcloud.com/csm/es-es-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043003',
    FR:
      'https://help.ovhcloud.com/csm/fr-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043306',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043008',
    IN:
      'https://help.ovhcloud.com/csm/asia-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0042995',
    IT:
      'https://help.ovhcloud.com/csm/it-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043005',
    PL:
      'https://help.ovhcloud.com/csm/pl-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043011',
    PT:
      'https://help.ovhcloud.com/csm/pt-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043010',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043018',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043002',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/16487540178195-Enabling-Active-Directory-Federation-Services-AD-FS-SSO-Connections-with-OVHcloud',
    WE:
      'https://help.ovhcloud.com/csm/en-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0042998',
    WS:
      'https://help.ovhcloud.com/csm/es-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043009',
  },
  APIKEY: {
    ASIA:
      'https://help.ovhcloud.com/csm/asia-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042776',
    AU:
      'https://help.ovhcloud.com/csm/en-au-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042780',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0029722',
    DE:
      'https://help.ovhcloud.com/csm/de-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042781',
    ES:
      'https://help.ovhcloud.com/csm/es-es-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042785',
    FR:
      'https://help.ovhcloud.com/csm/fr-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042789',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042784',
    IN:
      'https://help.ovhcloud.com/csm/asia-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042776',
    IT:
      'https://help.ovhcloud.com/csm/it-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042788',
    MA:
      'https://help.ovhcloud.com/csm/fr-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042789',
    PL:
      'https://help.ovhcloud.com/csm/pl-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042799',
    PT:
      'https://help.ovhcloud.com/csm/pt-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042798',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042783',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042779',
    SN:
      'https://help.ovhcloud.com/csm/fr-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042789',
    TN:
      'https://help.ovhcloud.com/csm/fr-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042789',
    US:
      'https://help.ovhcloud.com/csm/en-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042777',
    WE:
      'https://help.ovhcloud.com/csm/en-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042777',
    WS:
      'https://help.ovhcloud.com/csm/es-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042793',
  },
  LOGS: {
    FR:
      'https://help.ovhcloud.com/csm/fr-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060437',
    DE:
      'https://help.ovhcloud.com/csm/de-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060440',
    ES:
      'https://help.ovhcloud.com/csm/es-es-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060443',
    WE:
      'https://help.ovhcloud.com/csm/en-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060439',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060446',
    IT:
      'https://help.ovhcloud.com/csm/it-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060433',
    PL:
      'https://help.ovhcloud.com/csm/pl-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060448',
    PT:
      'https://help.ovhcloud.com/csm/pt-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060438',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060447',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060445',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060436',
    WS:
      'https://help.ovhcloud.com/csm/es-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060434',
    AU:
      'https://help.ovhcloud.com/csm/en-au-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060442',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060444',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/28789800400659-Generating-OVHcloud-Account-Logs-with-Logs-Data-Platform',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060435',
  },
};

GUIDE.LOGS.SN = GUIDE.LOGS.FR;
GUIDE.LOGS.TN = GUIDE.LOGS.FR;
GUIDE.LOGS.MA = GUIDE.LOGS.FR;

const AUTH_CREATE_TOKEN_API = 'api/createToken';

const PAGE_SIZE = 25;

const TAG = {
  // Commons
  ADD_ACTION_MANUALLY_SUCCESS: 'add-manually-success',
  ADD_ACTION_MANUALLY: 'add-manually',
  DISABLE_ALLOW_ALL_ACTIONS: 'disable-allow-all-actions',
  ENABLE_ALLOW_ALL_ACTIONS: 'enable-allow-all-actions',
  GUIDE: (guideKey) => `identity-security-operation::guide-${guideKey}`,
  REMOVE_PRODUCT_TYPE_CANCEL: 'remove-product-type-cancel',
  REMOVE_PRODUCT_TYPE_CONFIRM: 'remove-product-type-confirm',
};

const UNAVAILABLE_STATE_NAME = 'app.account.user';

const URN_VERSION = 1;

const OVH_MANAGED_PERMISSIONS_GROUP = 'permissionsGroup:ovh';

export {
  ALERT_ID,
  API_ERROR,
  CUSTOM_ACTION_PATTERN,
  CUSTOM_ACTION_SAMPLE,
  CUSTOM_ACTION_WILDCARD_PATTERN,
  CUSTOM_RESOURCE_TYPE,
  DELETE_STATEMENT,
  ENTITY,
  ENTITY_DESCRIPTION_PATTERN,
  ENTITY_NAME_PATTERN,
  IDENTITY_TYPE,
  FEATURE,
  GUIDE,
  OVH_MANAGED_PERMISSIONS_GROUP,
  PAGE_SIZE,
  TAG,
  UNAVAILABLE_STATE_NAME,
  URN_VERSION,
  WILDCARD,
  ACTION_DESCRIPTION_UNDEFINED,
  AUTH_CREATE_TOKEN_API,
};
