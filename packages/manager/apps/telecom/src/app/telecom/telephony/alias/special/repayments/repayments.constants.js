export const CALLED_FEES_PREFIX = {
  fr: ['0033805'],
  be: ['0032800'],
};

export const GROUP_REPAYMENTS_PREFIX = {
  fr: ['0033806', '003381', '003382', '003389'],
  be: [
    '003278',
    '003270',
    '0032900',
    '0032902',
    '0032903',
    '0032904',
    '0032905',
    '0032906',
    '0032907',
  ],
};

export const SPECIAL_NUMBER_PREFIX = {
  france: ['00338'],
  belgium: ['0032800', '003278', '0032900', '003270'],
};

export const LIMIT = 500;

export default {
  CALLED_FEES_PREFIX,
  GROUP_REPAYMENTS_PREFIX,
  SPECIAL_NUMBER_PREFIX,
  LIMIT,
};
