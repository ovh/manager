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

const CUSTOM_RESOURCE_TYPE = 'custom';

const DELETE_STATEMENT = 'Terminate';

const FEATURE = {
  MAIN: 'iam',
};

const ENTITY = {
  POLICY: 'policy',
  IDENTITY: 'identity',
  RESOURCE_GROUP: 'resourceGroup',
  RESOURCE_TYPE: 'resourceType',
};

const ENTITY_NAME_PATTERN = /^[a-zA-Z0-9-/_+]*$/;

const GUIDE = {
  IAM: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056805',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056797',
    AU:
      'https://help.ovhcloud.com/csm/en-au-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056803',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056802',
    DE:
      'https://help.ovhcloud.com/csm/de-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056810',
    ES:
      'https://help.ovhcloud.com/csm/es-es-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056800',
    FR:
      'https://help.ovhcloud.com/csm/fr-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056808',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056801',
    IN:
      'https://help.ovhcloud.com/csm/asia-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056797',
    IT:
      'https://help.ovhcloud.com/csm/it-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056796',
    PL:
      'https://help.ovhcloud.com/csm/pl-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056807',
    PT:
      'https://help.ovhcloud.com/csm/pt-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056798',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056804',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056799',
    US:
      'https://help.ovhcloud.com/csm/en-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056805',
    WE:
      'https://help.ovhcloud.com/csm/en-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056805',
    WS:
      'https://help.ovhcloud.com/csm/es-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056809',
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
      'https://help.ovhcloud.com/csm/en-account-managing-users?id=kb_article_view&sysparm_article=KB0043055',
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
      'https://help.ovhcloud.com/csm/en-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0042998',
    WE:
      'https://help.ovhcloud.com/csm/en-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0042998',
    WS:
      'https://help.ovhcloud.com/csm/es-customer-connect-saml-sso?id=kb_article_view&sysparm_article=KB0043009',
  },
};

const PAGE_SIZE = 25;

const PREFERENCES_KEY = {
  ADVANCED_MODE: 'IAM_ADVANCED_MODE',
};

const UNAVAILABLE_STATE_NAME = 'app.account.user';

const URN_VERSION = 1;

export {
  ALERT_ID,
  API_ERROR,
  CUSTOM_ACTION_PATTERN,
  CUSTOM_RESOURCE_TYPE,
  DELETE_STATEMENT,
  ENTITY,
  ENTITY_NAME_PATTERN,
  FEATURE,
  GUIDE,
  PAGE_SIZE,
  PREFERENCES_KEY,
  UNAVAILABLE_STATE_NAME,
  URN_VERSION,
};
