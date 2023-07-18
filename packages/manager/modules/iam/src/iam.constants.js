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

const TAG = {
  ADD_POLICY: 'dedicated::account::iam::add-policy',
  ADD_POLICY__ADD_MANUALLY: 'dedicated::account::iam::add-policy::add-manually',
  ADD_POLICY__ADD_MANUALLY_ERROR:
    'dedicated::account::iam::add-policy::add-manually-error',
  ADD_POLICY__ADD_MANUALLY_SUCCESS:
    'dedicated::account::iam::add-policy::add-manually-success',
  ADD_POLICY__CANCEL: 'dedicated::account::iam::add-policy::cancel',
  ADD_POLICY__CONFIRM: 'dedicated::account::iam::add-policy::confirm',
  ADD_POLICY__DISABLE_ALLOW_ALL_ACTIONS:
    'dedicated::account::iam::add-policy::disable-allow-all-actions',
  ADD_POLICY__ENABLE_ALLOW_ALL_ACTIONS:
    'dedicated::account::iam::add-policy::enable-allow-all-actions',
  // OK
  ADD_POLICY__GUIDE: (guideKey) =>
    `dedicated::account::iam::add-policy::guide-${guideKey}`,
  ADD_RESOURCE_GROUP: 'dedicated::account::iam::add-group-ressources',
  ADD_RESOURCE_GROUP__CANCEL:
    'dedicated::account::iam::add-group-ressources::cancel',
  ADD_RESOURCE_GROUP__CONFIRM:
    'dedicated::account::iam::add-group-ressources::confirm',
  // OK
  ADD_RESOURCE_GROUP__GUIDE: (guideKey) =>
    `dedicated::account::iam::add-group-ressources::guide-${guideKey}`,
  DELETE_POLICY: 'dedicated::account::iam::delete-policy',
  DELETE_POLICY__CANCEL: 'dedicated::account::iam::delete-policy::cancel',
  DELETE_POLICY__CONFIRM: 'dedicated::account::iam::delete-policy::confirm',
  DELETE_RESOURCE_GROUP: 'dedicated::account::iam::delete-group-ressources',
  DELETE_RESOURCE_GROUP__CANCEL:
    'dedicated::account::iam::delete-group-ressources::cancel',
  DELETE_RESOURCE_GROUP__CONFIRM:
    'dedicated::account::iam::delete-group-ressources::confirm',
  EDIT_POLICY: 'dedicated::account::iam::edit-policy',
  EDIT_POLICY__CANCEL: 'dedicated::account::iam::edit-policy::cancel',
  EDIT_POLICY__CONFIRM: 'dedicated::account::iam::edit-policy::confirm',
  EDIT_RESOURCE_GROUP: 'dedicated::account::iam::edit-group-ressources',
  EDIT_RESOURCE_GROUP__CANCEL:
    'dedicated::account::iam::edit-group-ressources::cancel',
  EDIT_RESOURCE_GROUP__CONFIRM:
    'dedicated::account::iam::edit-group-ressources::confirm',
  IDENTITIES: 'dedicated::account::iam::manage-identities',
  IDENTITIES__ADD_USERS:
    'dedicated::account::iam::manage-identities::add-users',
  IDENTITIES__CANCEL: 'dedicated::account::iam::manage-identities::cancel',
  IDENTITIES__CONFIRM: 'dedicated::account::iam::manage-identities::confirm',
  // OK
  IDENTITIES__GUIDE: (guideKey) =>
    `dedicated::account::iam::manage-identities::guide-${guideKey}`,
  IDENTITIES__REMOVE_USER:
    'dedicated::account::iam::manage-identities::remove-user',
  IDENTITIES__REMOVE_USER_CANCEL:
    'dedicated::account::iam::manage-identities::remove-user-cancel',
  IDENTITIES__REMOVE_USER_CONFIRM:
    'dedicated::account::iam::manage-identities::remove-user-confirm',
  ONBOARDING: 'dedicated::account::iam::onboarding',
  ONBOARDING__ADD_POLICY: 'dedicated::account::iam::onboarding::add-policy',
  ONBOARDING__ADD_USER: 'dedicated::account::iam::onboarding::add-user',
  // OK
  ONBOARDING__DOCUMENTATION: (guideKey) =>
    `dedicated::account::iam::onboarding::documentation::${guideKey}`,
  POLICIES: 'dedicated::account::iam::policies',
  POLICIES__ADD: 'dedicated::account::iam::policies::add',
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
  POLICIES__EDIT_POLICY_CONFIRM_BANNER__SUCCESS_ERROR:
    'iam::policies::edit-policy-confirm-banner::success-error',
  // OK
  POLICIES__GUIDE: (guideKey) =>
    `dedicated::account::iam::policies::guide-${guideKey}`,
  POLICIES__IDENTITIES_CONFIRM_BANNER__ERROR:
    'iam::policies::manage-identities-confirm-banner::error',
  POLICIES__IDENTITIES_CONFIRM_BANNER__SUCCESS:
    'iam::policies::manage-identities-confirm-banner::success',
  POLICIES__TABLE_OPTION_MENU__DELETE:
    'dedicated::account::iam::policies::table-option-menu::delete',
  POLICIES__TABLE_OPTION_MENU__EDIT:
    'dedicated::account::iam::policies::table-option-menu::edit',
  POLICIES__TABLE_OPTION_MENU__IDENTITIES:
    'dedicated::account::iam::policies::table-option-menu::manage-identities',
  RESOURCE_GROUPS: 'dedicated::account::iam::group-ressources',
  RESOURCE_GROUPS__ADD: 'dedicated::account::iam::group-ressources::add',
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
  // OK
  RESOURCE_GROUPS__GUIDE: (guideKey) =>
    `dedicated::account::iam::group-ressources::guide-${guideKey}`,
  RESOURCE_GROUPS__TABLE_OPTION_MENU__DELETE:
    'dedicated::account::iam::group-ressources::table-option-menu::delete',
  RESOURCE_GROUPS__TABLE_OPTION_MENU__EDIT:
    'dedicated::account::iam::group-ressources::table-option-menu::edit',
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
  TAG,
  UNAVAILABLE_STATE_NAME,
  URN_VERSION,
};
