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
};

const ENTITY = {
  POLICY: 'policy',
  IDENTITY: 'identity',
  RESOURCE_GROUP: 'resourceGroup',
  RESOURCE_TYPE: 'resourceType',
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
      'https://support.us.ovhcloud.com/hc/en-us/articles/14378994761747-How-to-Enable-SSO-Connections-with-your-OVHcloud-Account',
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

const TAG = {
  // Policy creation
  ADD_POLICY: 'dedicated::account::iam::add-policy',
  ADD_POLICY__CANCEL: 'dedicated::account::iam::add-policy::cancel',
  ADD_POLICY__CONFIRM: 'dedicated::account::iam::add-policy::confirm',
  ADD_POLICY__REMOVE_PRODUCT_TYPE:
    'dedicated::account::iam::add-policy::remove-product-type',

  // Resource group creation
  ADD_RESOURCE_GROUP: 'dedicated::account::iam::add-group-ressources',
  ADD_RESOURCE_GROUP__CANCEL:
    'dedicated::account::iam::add-group-ressources::cancel',
  ADD_RESOURCE_GROUP__CONFIRM:
    'dedicated::account::iam::add-group-ressources::confirm',
  ADD_RESOURCE_GROUP__REMOVE_PRODUCT_TYPE:
    'dedicated::account::iam::add-group-ressources::remove-product-type',

  // Entities deletion
  DELETE_POLICY: 'dedicated::account::iam::delete-policy',
  DELETE_POLICY__CANCEL: 'dedicated::account::iam::delete-policy::cancel',
  DELETE_POLICY__CONFIRM: 'dedicated::account::iam::delete-policy::confirm',
  DELETE_RESOURCE_GROUP: 'dedicated::account::iam::delete-group-ressources',
  DELETE_RESOURCE_GROUP__CANCEL:
    'dedicated::account::iam::delete-group-ressources::cancel',
  DELETE_RESOURCE_GROUP__CONFIRM:
    'dedicated::account::iam::delete-group-ressources::confirm',

  // Policy edition
  EDIT_POLICY: 'dedicated::account::iam::edit-policy',
  EDIT_POLICY__CANCEL: 'dedicated::account::iam::edit-policy::cancel',
  EDIT_POLICY__CONFIRM: 'dedicated::account::iam::edit-policy::confirm',
  EDIT_POLICY__REMOVE_PRODUCT_TYPE:
    'dedicated::account::iam::edit-policy::remove-product-type',

  // Resource group edition
  EDIT_RESOURCE_GROUP: 'dedicated::account::iam::edit-group-ressources',
  EDIT_RESOURCE_GROUP__CANCEL:
    'dedicated::account::iam::edit-group-ressources::cancel',
  EDIT_RESOURCE_GROUP__CONFIRM:
    'dedicated::account::iam::edit-group-ressources::confirm',
  EDIT_RESOURCE_GROUP__REMOVE_PRODUCT_TYPE:
    'dedicated::account::iam::edit-group-ressources::remove-product-type',

  // Onboarding
  ONBOARDING: 'dedicated::account::iam::onboarding',
  ONBOARDING__ADD_POLICY: 'dedicated::account::iam::onboarding::add-policy',
  ONBOARDING__ADD_USER: 'dedicated::account::iam::onboarding::add-user',

  // List of policies
  POLICIES: 'dedicated::account::iam::policies',
  POLICIES__ADD: 'dedicated::account::iam::policies::add',
  POLICIES__DELETE: 'dedicated::account::iam::policies::delete',
  POLICIES__EDIT: 'dedicated::account::iam::policies::edit',

  // List of policies - banners
  POLICIES__CREATE_POLICY_CONFIRM_BANNER__ERROR:
    'iam::policies::create-policy-confirm-banner::error',
  POLICIES__CREATE_POLICY_CONFIRM_BANNER__SUCCESS:
    'iam::policies::create-policy-confirm-banner::success',
  POLICIES__DELETE_POLICY_CONFIRM_BANNER__ERROR:
    'iam::policies::delete-policy-confirm-banner::error',
  POLICIES__DELETE_POLICY_CONFIRM_BANNER__SUCCESS:
    'iam::policies::delete-policy-confirm-banner::success',
  POLICIES__EDIT_POLICY_CONFIRM_BANNER__ERROR:
    'iam::policies::edit-policy-confirm-banner::error',
  POLICIES__EDIT_POLICY_CONFIRM_BANNER__SUCCESS:
    'iam::policies::edit-policy-confirm-banner::success',

  // List of resource groups
  RESOURCE_GROUPS: 'dedicated::account::iam::group-ressources',
  RESOURCE_GROUPS__ADD: 'dedicated::account::iam::group-ressources::add',
  RESOURCE_GROUPS__DELETE: 'dedicated::account::iam::group-ressources::delete',
  RESOURCE_GROUPS__EDIT: 'dedicated::account::iam::group-ressources::edit',

  // List of resource groups - banners
  RESOURCE_GROUPS__ADD_GROUP_CONFIRM_BANNER__ERROR:
    'iam::group-ressources::add-group-confirm-banner::error',
  RESOURCE_GROUPS__ADD_GROUP_CONFIRM_BANNER__SUCCESS:
    'iam::group-ressources::add-group-confirm-banner::success',
  RESOURCE_GROUPS__DELETE_GROUP_CONFIRM_BANNER__ERROR:
    'iam::group-ressources::delete-group-confirm-banner::error',
  RESOURCE_GROUPS__DELETE_GROUP_CONFIRM_BANNER__SUCCESS:
    'iam::group-ressources::delete-group-confirm-banner::success',
  RESOURCE_GROUPS__EDIT_GROUP_CONFIRM_BANNER__ERROR:
    'iam::group-ressources::edit-group-confirm-banner::error',
  RESOURCE_GROUPS__EDIT_GROUP_CONFIRM_BANNER__SUCCESS:
    'iam::group-ressources::edit-group-confirm-banner::success',

  // Commons
  ADD_ACTION_MANUALLY_SUCCESS: 'add-manually-success',
  ADD_ACTION_MANUALLY: 'add-manually',
  DISABLE_ADVANCED_MODE: 'dedicated::account::iam::disable-advanced-mode',
  DISABLE_ALLOW_ALL_ACTIONS: 'disable-allow-all-actions',
  ENABLE_ADVANCED_MODE: 'dedicated::account::iam::enable-advanced-mode',
  ENABLE_ALLOW_ALL_ACTIONS: 'enable-allow-all-actions',
  GUIDE: (guideKey) => `dedicated::account::iam::guide-${guideKey}`,
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
  PREFERENCES_KEY,
  TAG,
  UNAVAILABLE_STATE_NAME,
  URN_VERSION,
  WILDCARD,
  ACTION_DESCRIPTION_UNDEFINED,
};
