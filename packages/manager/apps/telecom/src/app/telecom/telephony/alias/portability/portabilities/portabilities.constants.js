export const PORTABILITY_STATUS = {
  formSent: 'customerFormSent',
  formReceived: 'customerFormReceived',
};

export const PORTABILITY_STEPS_GUIDE = {
  FR:
    'https://docs.ovh.com/fr/voip/demander-la-portabilite-de-mon-numero/#steps',
  BE: 'https://docs.ovh.com/fr/voip/portabilite-numero-belge/#steps',
};

export const PORTABILITY_COUNTRY = {
  BE: 'belgium',
  FR: 'france',
};

export const PORTABILITY_STEPS_STATUS = {
  todo: 'todo',
  doing: 'doing',
  done: 'done',
  error: 'error',
};

export const REGEX = {
  siret: /^\d{14}$/,
  phoneNumber: /^(?:(?:00|\+)33[1-9]\d{8}|(?:00|\+)32[1-9]\d{7,8}|(?:00|\+)41[1-9]\d{8})$/,
};

export const STREET_NUMBER_EXTRA = [
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'S',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export const PORTABILITY_STREET_NUMBER_EXTRA_ENUM = {
  BE: ['&nbsp;', 'A', 'B', 'C', ...STREET_NUMBER_EXTRA],
  OTHER: [
    '&nbsp;',
    'bis',
    'ter',
    'quater',
    'quinquies',
    'sexto',
    'septimo',
    'octimo',
    'nono',
    'A',
    ...STREET_NUMBER_EXTRA,
  ],
};

export default {
  PORTABILITY_STATUS,
  PORTABILITY_STEPS_GUIDE,
  PORTABILITY_COUNTRY,
  PORTABILITY_STEPS_STATUS,
  REGEX,
};
