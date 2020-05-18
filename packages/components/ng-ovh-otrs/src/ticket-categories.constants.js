export const TICKET_CATEGORIES = {
  LIST: {
    WEB: [
      'cdn',
      'domain',
      'exchange',
      'hosting',
      'mail',
      'ssl',
      'vps',
      'web-billing',
      'web-other',
    ],
    TELECOM: [
      'adsl',
      'voip',
      'fax',
      'sms',
      'telecom-billing',
      'telecom-other',
    ],
    DEDICATED: [
      'dedicated',
      'dedicatedcloud',
      'housing',
      'dedicated-other',
      'dedicated-billing',
    ],
    CLOUD: [
      'publiccloud',
    ],
  },
  DEFAULT: 'billing',
};

export default { TICKET_CATEGORIES };
