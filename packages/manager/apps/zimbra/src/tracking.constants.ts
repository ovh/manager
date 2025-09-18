export const LEVEL2 = {
  EU: {
    config: {
      level2: '0',
    },
  },
  CA: {
    config: {
      level2: '0',
    },
  },
  US: {
    config: {
      level2: '0',
    },
  },
};

export const UNIVERSE = 'Web_solutions';
export const SUB_UNIVERSE = 'Emails';
export const APP_NAME = 'zimbra';

// COMMON/MISC
export const CANCEL = 'cancel';
export const CONFIRM = 'confirm';
export const SKIP = 'skip';
export const EXIT = 'exit';
export const BACK_PREVIOUS_PAGE = 'back_previous-page';
export const TO_BE_DEFINED = 'to-be-defined';

export const ONBOARDING = 'onboarding';
export const ONBOARDING_ORDER_CTA = 'onboarding_order_cta';

export const ONBOARDING_WELCOME = 'onboarding_welcome';
export const ONBOARDING_WELCOME_CONFIGURE_NOW_CTA = 'onboarding_welcome_configure_now_cta';
export const ONBOARDING_WELCOME_CONFIGURE_LATER_CTA = 'onboarding_welcome_configure_later_cta';

export const ONBOARDING_CONFIGURE = 'onboarding_configure';
export const ONBOARDING_CONFIGURE_ORGANIZATION = `${ONBOARDING_CONFIGURE}_organization`;
export const ONBOARDING_CONFIGURE_DOMAIN = `${ONBOARDING_CONFIGURE}_domain`;
export const ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS = `${ONBOARDING_CONFIGURE}_email-accounts`;

export const GENERAL_INFORMATIONS = 'general-informations';

// DOMAIN
export const DOMAIN = 'domain';
export const ADD_DOMAIN = `add_${DOMAIN}`;
export const EDIT_DOMAIN = `edit_${DOMAIN}`;
export const DELETE_DOMAIN = `delete_${DOMAIN}`;
export const VERIFY_DOMAIN = `verify_${DOMAIN}`;
export const AUTO_CONFIGURE_DOMAIN = `auto-configure_${DOMAIN}`;
export const DOMAIN_DIAGNOSTICS = `${DOMAIN}_diagnostics`;
export const DOMAIN_DIAGNOSTICS_REFRESH = `${DOMAIN_DIAGNOSTICS}_refresh`;
export const DOMAIN_DIAGNOSTICS_MX = `${DOMAIN_DIAGNOSTICS}_mx`;
export const DOMAIN_DIAGNOSTICS_SPF = `${DOMAIN_DIAGNOSTICS}_spf`;
export const DOMAIN_DIAGNOSTICS_SRV = `${DOMAIN_DIAGNOSTICS}_srv`;
export const DOMAIN_DIAGNOSTICS_DKIM = `${DOMAIN_DIAGNOSTICS}_dkim`;

// ORGANIZATION
export const ORGANIZATION = 'organization';
export const ADD_ORGANIZATION = `add_${ORGANIZATION}`;
export const EDIT_ORGANIZATION = `edit_${ORGANIZATION}`;
export const DELETE_ORGANIZATION = `delete_${ORGANIZATION}`;
export const SELECT_ORGANIZATION = `select_${ORGANIZATION}`;
export const UNSELECT_ORGANIZATION = `unselect_${ORGANIZATION}`;

// MAILING LIST
export const MAILING_LIST = 'mailing-list';
export const ADD_MAILING_LIST = `add_${MAILING_LIST}`;
export const EDIT_MAILING_LIST = `edit_${MAILING_LIST}`;
export const DELETE_MAILING_LIST = `delete_${MAILING_LIST}`;
export const DEFINE_MEMBERS_MAILING_LIST = `define_members_${MAILING_LIST}`;
export const CONFIGURE_DELEGATION_MAILING_LIST = `configure_delegation_${MAILING_LIST}`;

// REDIRECTION
export const REDIRECTION = 'redirection';
export const ADD_REDIRECTION = `add_${REDIRECTION}`;
export const EDIT_REDIRECTION = `edit_${REDIRECTION}`;
export const DELETE_REDIRECTION = `delete_${REDIRECTION}`;

// ALIAS
export const ALIAS = 'alias';
export const ADD_ALIAS = `add_${ALIAS}`;
export const DELETE_ALIAS = `delete_${ALIAS}`;

// AUTO REPLY
export const AUTO_REPLY = 'auto-reply';
export const ADD_AUTO_REPLY = `add_${AUTO_REPLY}`;
export const DELETE_AUTO_REPLY = `delete_${AUTO_REPLY}`;

// EMAIL ACCOUNT
export const EMAIL_ACCOUNT = 'email-account';
export const ADD_EMAIL_ACCOUNT = `add_${EMAIL_ACCOUNT}`;
export const EDIT_EMAIL_ACCOUNT = `edit_${EMAIL_ACCOUNT}`;
export const GO_EMAIL_ACCOUNT_ALIASES = `go_${EMAIL_ACCOUNT}_${ALIAS}`;
export const DELETE_EMAIL_ACCOUNT = `delete_${EMAIL_ACCOUNT}`;
export const ORDER_ZIMBRA_EMAIL_ACCOUNT = `order_zimbra_${EMAIL_ACCOUNT}`;

// EMAIL ACCOUNT SETTINGS
export const EMAIL_ACCOUNT_AUTO_REPLY = `${EMAIL_ACCOUNT}_${AUTO_REPLY}`;
export const EMAIL_ACCOUNT_ADD_AUTO_REPLY = `${EMAIL_ACCOUNT}_${ADD_AUTO_REPLY}`;
export const EMAIL_ACCOUNT_DELETE_AUTO_REPLY = `${EMAIL_ACCOUNT}_${DELETE_AUTO_REPLY}`;
export const EMAIL_ACCOUNT_REDIRECTION = `${EMAIL_ACCOUNT}_${REDIRECTION}`;
export const EMAIL_ACCOUNT_ADD_REDIRECTION = `${EMAIL_ACCOUNT}_${ADD_REDIRECTION}`;
export const EMAIL_ACCOUNT_EDIT_REDIRECTION = `${EMAIL_ACCOUNT}_${EDIT_REDIRECTION}`;
export const EMAIL_ACCOUNT_DELETE_REDIRECTION = `${EMAIL_ACCOUNT}_${DELETE_REDIRECTION}`;
export const EMAIL_ACCOUNT_ALIAS = `${EMAIL_ACCOUNT}_${ALIAS}`;
export const EMAIL_ACCOUNT_ADD_ALIAS = `${EMAIL_ACCOUNT}_${ADD_ALIAS}`;
export const EMAIL_ACCOUNT_DELETE_ALIAS = `${EMAIL_ACCOUNT}_${DELETE_ALIAS}`;

// SLOTS
export const SLOT = 'slot';
export const CONFIGURE_SLOT = `configure_${SLOT}`;
export const CANCEL_SLOT = `cancel_${SLOT}`;
export const UNDO_CANCEL_SLOT = `undo_cancel_${SLOT}`;
export const UPGRADE_SLOT = `upgrade_${SLOT}`;

// GUIDES
export const GUIDE_WEBMAIL = 'webmail';
export const GUIDE_ADMINISTRATOR = 'administrator-guide';
export const GUIDE_USER = 'user-guide';
export const GUIDE_CNAME = 'cname-guide';
export const GUIDE_DNS_CONFIG = 'dns-configuration-guide';
export const GUIDE_HOW_TO_CONFIGURE = 'how-to-configure-guide';

export const GO_TO = (link: string) => `go-to-${link}`;
