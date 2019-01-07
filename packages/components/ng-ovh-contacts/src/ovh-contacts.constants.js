export const CONTACT_TO_NIC_FIELDS_MAPPING = {
  organisationName: 'organisation',
  lastName: 'name',
  gender: 'sex',
  address: {
    line1: 'address',
    province: 'area',
  },
};

export const ENUMS_TO_TRANSFORM = [{
  path: 'address.country',
  sort: true,
}, {
  path: 'address.province',
  sort: true,
  dependsOfCountry: true,
}, {
  path: 'phoneCountry',
  sort: true,
}];

export const GET_LIST_DEFAULT_OPTIONS = {
  avoidDuplicates: true,
  customFilter: null,
};

export const PREDIFINED_CONTACT_PROFILES = {
  billing: [
    'lastName',
    'firstName',
    'address.line1',
    'address.zip',
    'address.city',
    'address.country',
    'address.province',
    'email',
    'phone',
  ],
};

export default {
  CONTACT_TO_NIC_FIELDS_MAPPING,
  ENUMS_TO_TRANSFORM,
  GET_LIST_DEFAULT_OPTIONS,
  PREDIFINED_CONTACT_PROFILES,
};
