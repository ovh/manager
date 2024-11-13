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
};

export const INFO_PROPERTIES_ARRAY = [
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
    name: INFO_PROPERTIES.NICHANDLE,
    values: [INFO_PROPERTIES.NICHANDLE],
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

export default {
  INFO_PROPERTIES,
  LEGAL_FORM_INDIVIDUAL,
  INFO_PROPERTIES_ARRAY,
  GUIDE_URL: GUIDE_URLS,
};
