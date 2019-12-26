export const TUC_SMS_REGEX = {
  // eslint-disable-next-line no-useless-escape
  default7bitGSMAlphabet: /^[@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞ^\{\}\\\[~\]\|€ÆæßÉ!"#¤%&'\(\)\*\+,-\.\/0123456789:;<=>\?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà\n\r\s]*$/,
};

export const TUC_SMS_STOP_CLAUSE = {
  value: '\nSTOP:36111',
};

export default { TUC_SMS_REGEX, TUC_SMS_STOP_CLAUSE };
