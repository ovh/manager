export const INFO_PROPERTIES = {
  ORGANISATION: 'organisation',
  CORPORATION_TYPE: 'corporationType',
  NAMES: 'names',
  FIRSTNAME: 'firstname',
  NAME: 'name',
  ADDRESS: 'address',
  COMPLEMENTARY_ADDRESS: 'complementaryAddress',
  ZIP: 'zip',
  COUNTRY: 'city.country',
  EMAIL: 'email',
  PHONE: 'phone',
  NATIONAL_IDENTIFICATION_NUMBER: 'nationalIdentifcationNumber',
  NICHANDLE: 'nichandle',
  VAT: 'vat',
};

export const OWNER_INFO_PROPERTIES = {
  ORGANISATION: 'organisation',
  ORGANISATION_NAME: 'organisationName',
  NAME: 'name',
  LASTNAME: 'lastName',
  FIRSTNAME: 'firstName',
  ADDRESS: 'address',
  LINE_1: 'address.line1',
  ZIP: 'address.zip',
  CITY: 'address.city',
  EMAIL: 'email',
  PHONE: 'phone',
  NATIONAL_IDENTIFICATION_NUMBER: 'nationalIdentifcationNumber',
  VAT: 'vat',
};

export const OWNER_NOT_FOUND = 'Not Found';

export const INFO_PROPERTIES_ORGANISATION_ARRAY = [
  {
    name: INFO_PROPERTIES.ORGANISATION,
    values: [INFO_PROPERTIES.ORGANISATION, INFO_PROPERTIES.CORPORATION_TYPE],
  },
  {
    name: INFO_PROPERTIES.NAMES,
    values: [INFO_PROPERTIES.FIRSTNAME, INFO_PROPERTIES.NAME],
  },
  {
    name: INFO_PROPERTIES.ADDRESS,
    values: [
      INFO_PROPERTIES.ADDRESS,
      INFO_PROPERTIES.COMPLEMENTARY_ADDRESS,
      INFO_PROPERTIES.ZIP,
      INFO_PROPERTIES.COUNTRY,
    ],
  },
  {
    name: INFO_PROPERTIES.EMAIL,
    values: [INFO_PROPERTIES.EMAIL],
  },
  {
    name: INFO_PROPERTIES.PHONE,
    values: [INFO_PROPERTIES.PHONE],
  },
  {
    name: INFO_PROPERTIES.NATIONAL_IDENTIFICATION_NUMBER,
    values: [INFO_PROPERTIES.NATIONAL_IDENTIFICATION_NUMBER],
  },
  {
    name: INFO_PROPERTIES.VAT,
    values: [INFO_PROPERTIES.VAT],
  },
];

export const INFO_PROPERTIES_ARRAY = [
  {
    name: INFO_PROPERTIES.NAMES,
    values: [INFO_PROPERTIES.FIRSTNAME, INFO_PROPERTIES.NAME],
  },
  {
    name: INFO_PROPERTIES.ADDRESS,
    values: [
      INFO_PROPERTIES.ADDRESS,
      INFO_PROPERTIES.COMPLEMENTARY_ADDRESS,
      INFO_PROPERTIES.ZIP,
      INFO_PROPERTIES.COUNTRY,
    ],
  },
  {
    name: INFO_PROPERTIES.EMAIL,
    values: [INFO_PROPERTIES.EMAIL],
  },
  {
    name: INFO_PROPERTIES.PHONE,
    values: [INFO_PROPERTIES.PHONE],
  },
];

export const OWNER_INFO_PROPERTIES_ORGANISATION_ARRAY = [
  {
    name: OWNER_INFO_PROPERTIES.ORGANISATION,
    values: [OWNER_INFO_PROPERTIES.ORGANISATION_NAME],
  },
  {
    name: OWNER_INFO_PROPERTIES.NAME,
    values: [OWNER_INFO_PROPERTIES.FIRSTNAME, OWNER_INFO_PROPERTIES.LASTNAME],
  },
  {
    name: OWNER_INFO_PROPERTIES.ADDRESS,
    values: [
      OWNER_INFO_PROPERTIES.LINE_1,
      OWNER_INFO_PROPERTIES.ZIP,
      OWNER_INFO_PROPERTIES.CITY,
    ],
  },
  {
    name: OWNER_INFO_PROPERTIES.EMAIL,
    values: [OWNER_INFO_PROPERTIES.EMAIL],
  },
  {
    name: OWNER_INFO_PROPERTIES.PHONE,
    values: [OWNER_INFO_PROPERTIES.PHONE],
  },
  {
    name: OWNER_INFO_PROPERTIES.NATIONAL_IDENTIFICATION_NUMBER,
    values: [OWNER_INFO_PROPERTIES.NATIONAL_IDENTIFICATION_NUMBER],
  },
  {
    name: OWNER_INFO_PROPERTIES.VAT,
    values: [OWNER_INFO_PROPERTIES.VAT],
  },
];

export const OWNER_INFO_PROPERTIES_ARRAY = [
  {
    name: OWNER_INFO_PROPERTIES.NAME,
    values: [OWNER_INFO_PROPERTIES.FIRSTNAME, OWNER_INFO_PROPERTIES.LASTNAME],
  },
  {
    name: OWNER_INFO_PROPERTIES.ADDRESS,
    values: [
      OWNER_INFO_PROPERTIES.LINE_1,
      OWNER_INFO_PROPERTIES.ZIP,
      OWNER_INFO_PROPERTIES.CITY,
    ],
  },
  {
    name: INFO_PROPERTIES.EMAIL,
    values: [INFO_PROPERTIES.EMAIL],
  },
  {
    name: INFO_PROPERTIES.PHONE,
    values: [INFO_PROPERTIES.PHONE],
  },
];

export const GUIDE_URLS = {
  AU:
    'https://help.ovhcloud.com/csm/en-au-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042979',
  DE:
    'https://help.ovhcloud.com/csm/de-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042983',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042993',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042991',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042992',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042996',
  ES:
    'https://help.ovhcloud.com/csm/es-es-account-manage-contacts?id=kb_article_view&sysparm_article=KB0043001',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-account-manage-contacts?id=kb_article_view&sysparm_article=KB0043000',
  FR:
    'https://help.ovhcloud.com/csm/fr-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042989',
  MA:
    'https://help.ovhcloud.com/csm/fr-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042989',
  SN:
    'https://help.ovhcloud.com/csm/fr-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042989',
  TN:
    'https://help.ovhcloud.com/csm/fr-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042989',
  IT:
    'https://help.ovhcloud.com/csm/it-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042994',
  PL:
    'https://help.ovhcloud.com/csm/pl-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042997',
  PT:
    'https://help.ovhcloud.com/csm/pt-account-manage-contacts?id=kb_article_view&sysparm_article=KB0043004',
  IN:
    'https://help.ovhcloud.com/csm/asia-account-manage-contacts?id=kb_article_view&sysparm_article=KB0029947',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-account-manage-contacts?id=kb_article_view&sysparm_article=KB0042986',
};

export const LEGAL_FORM_INDIVIDUAL = 'individual';

const TRACKING_PREFIX = 'web::domain::domain-name::';

const TRACKING_CATEGORY_AND_THEME = {
  page_category: 'dashboard',
  page_theme: 'Domains',
};

const TRACKING_CONTACT_MANAGEMENT_SUFFIX =
  'domain-name::dashboard::contact-management';

export const CONTACT_MANAGEMENT_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}domain-name::dashboard::contact-management`,
    page: {
      name: `${TRACKING_PREFIX}${TRACKING_CONTACT_MANAGEMENT_SUFFIX}`,
    },
    ...TRACKING_CATEGORY_AND_THEME,
  },
  REASSIGN_CONTACT: {
    name: `${TRACKING_PREFIX}page::button::reset_domain-name-contacts`,
    page: {
      name: `${TRACKING_PREFIX}${TRACKING_CONTACT_MANAGEMENT_SUFFIX}`,
    },
    ...TRACKING_CATEGORY_AND_THEME,
  },
  EDIT_CONTACT: {
    name: `${TRACKING_PREFIX}tile::button::edit_{{contactType}}-contact`,
    page: {
      name: `${TRACKING_PREFIX}${TRACKING_CONTACT_MANAGEMENT_SUFFIX}`,
    },
    ...TRACKING_CATEGORY_AND_THEME,
  },
};

export default {
  INFO_PROPERTIES,
  LEGAL_FORM_INDIVIDUAL,
  INFO_PROPERTIES_ARRAY,
  INFO_PROPERTIES_ORGANISATION_ARRAY,
  OWNER_NOT_FOUND,
  GUIDE_URLS,
  CONTACT_MANAGEMENT_TRACKING,
};
