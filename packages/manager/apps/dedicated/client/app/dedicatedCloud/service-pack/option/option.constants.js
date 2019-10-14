export const OPTION_TYPES = {
  basic: 'basic',
  certification: 'certification',
};

export const OPTIONS = [
  {
    name: 'nsx',
    type: OPTION_TYPES.basic,
  },
  {
    name: 'vrops',
    type: OPTION_TYPES.basic,
  },
  {
    name: 'pcidss',
    type: OPTION_TYPES.certification,
  },
  {
    name: 'hipaa',
    type: OPTION_TYPES.certification,
  },
  {
    name: 'hds',
    type: OPTION_TYPES.certification,
  },
];

export default {
  OPTIONS,
  OPTION_TYPES,
};
