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

export const LEGAL_FORM_INDIVIDUAL = 'individual';

export default {
  INFO_PROPERTIES,
  LEGAL_FORM_INDIVIDUAL,
  INFO_PROPERTIES_ARRAY,
};
