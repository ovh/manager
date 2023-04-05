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

const DELETE_STATEMENT = 'Terminate';

const FEATURE = {
  MAIN: 'iam',
};

const ENTITY = {
  POLICY: 'policy',
  IDENTITY: 'identity',
  RESOURCE_GROUP: 'resourceGroup',
};
const URN_VERSION = 1;

const ENTITY_NAME_PATTERN = /^[a-zA-Z0-9-/_+]*$/;

// TODO wait for other guide specifications
const GUIDE = {
  IAM: {
    FR: 'https://docs.ovh.com/fr/customer/IAM/',
  },
  USERS: {
    ASIA: 'https://docs.ovh.com/asia/en/customer/managing-users/',
    AUS: 'https://docs.ovh.com/au/en/customer/managing-users/',
    CA: 'https://docs.ovh.com/ca/en/customer/managing-users/',
    DE: 'https://docs.ovh.com/de/customer/benutzer-verwalten/',
    ES: 'https://docs.ovh.com/es/customer/gestion-de-usuarios/',
    FR: 'https://docs.ovh.com/fr/customer/gestion-utilisateurs/',
    GB: 'https://docs.ovh.com/gb/en/customer/managing-users/',
    IE: 'https://docs.ovh.com/ie/en/customer/managing-users/',
    IT: 'https://docs.ovh.com/it/customer/gestisci_gli_utenti/',
    PL: 'https://docs.ovh.com/pl/customer/zarzadzanie_uzytkownikami/',
    PT: 'https://docs.ovh.com/pt/customer/gestao-utilizadores/',
    SG: 'https://docs.ovh.com/sg/en/customer/managing-users/',
    US: 'https://docs.ovh.com/us/en/customer/managing-users/',
    WS: 'https://docs.ovh.com/us/es/customer/gestion-de-usuarios/',
  },
  SAMLSSO: {
    ASIA: 'https://docs.ovh.com/asia/en/customer/connect-saml-sso/',
    AUS: 'https://docs.ovh.com/au/en/customer/connect-saml-sso/',
    CA: 'https://docs.ovh.com/ca/en/customer/connect-saml-sso/',
    DE: 'https://docs.ovh.com/de/customer/connect-saml-sso/',
    ES: 'https://docs.ovh.com/es/customer/conect-saml-sso/',
    FR: 'https://docs.ovh.com/fr/customer/connect-saml-sso/',
    GB: 'https://docs.ovh.com/gb/en/customer/connect-saml-sso/',
    IE: 'https://docs.ovh.com/ie/en/customer/connect-saml-sso/',
    IT: 'https://docs.ovh.com/it/customer/connect-saml-sso/',
    PL: 'https://docs.ovh.com/pl/customer/connect-saml-sso/',
    PT: 'https://docs.ovh.com/pt/customer/connect-saml-sso/',
    SG: 'https://docs.ovh.com/sg/en/customer/connect-saml-sso/',
    US: 'https://docs.ovh.com/us/en/customer/connect-saml-sso/',
    WS: 'https://docs.ovh.com/us/es/customer/conect-saml-sso/',
  },
};

GUIDE.IAM.DEFAULT = GUIDE.IAM.FR;
GUIDE.USERS.DEFAULT = GUIDE.USERS.US;
GUIDE.SAMLSSO.DEFAULT = GUIDE.SAMLSSO.US;

const UNAVAILABLE_STATE_NAME = 'app.account.user';

export {
  ALERT_ID,
  API_ERROR,
  DELETE_STATEMENT,
  ENTITY,
  ENTITY_NAME_PATTERN,
  FEATURE,
  GUIDE,
  UNAVAILABLE_STATE_NAME,
  URN_VERSION,
};
