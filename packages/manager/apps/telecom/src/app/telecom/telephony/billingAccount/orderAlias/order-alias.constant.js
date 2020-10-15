export const TELEPHONY_NUMBER_OFFER = {
  list: ['geographical', 'no-geographical', 'special', 'international'],
  detail: {
    geographical: {
      id: 'geographical',
      title: 'telephony_order_geographical_title',
      tip: 'telephony_order_geographical_tip',
      description: 'telephony_order_geographical_description',
      clarification: '(&nbsp;01,&nbsp;02,&nbsp;...&nbsp;)',
      state: 'telecom.telephony.billingAccount.orderAlias.geographical',
    },
    'no-geographical': {
      id: 'no-geographical',
      title: 'telephony_order_nogeographical_title',
      tip: 'telephony_order_nogeographical_tip',
      description: 'telephony_order_nogeographical_description',
      clarification: '(&nbsp;09&nbsp;)',
      state: 'telecom.telephony.billingAccount.orderAlias.nongeographical',
    },
    special: {
      id: 'special',
      title: 'telephony_order_special_title',
      tip: 'telephony_order_special_tip',
      description: 'telephony_order_special_description',
      clarification: '(&nbsp;08&nbsp;)',
      state: 'telecom.telephony.billingAccount.orderAlias.special',
    },
    international: {
      id: 'international',
      title: 'telephony_order_international_title',
      tip: 'telephony_order_international_tip',
      description: 'telephony_order_international_description',
      clarification: '(&nbsp;+32,&nbsp;+44,&nbsp;+49,&nbsp;...&nbsp;)',
      state: 'telecom.telephony.billingAccount.orderAlias.international',
    },
  },
  preAmount: [
    {
      label: 'telephony_order_geographical_count_singular',
      value: 1,
    },
    {
      label: 'telephony_order_geographical_count_plurial',
      value: 10,
    },
    {
      label: 'telephony_order_geographical_count_plurial',
      value: 50,
    },
    {
      label: 'telephony_order_geographical_count_plurial',
      value: 100,
    },
  ],
  prefix: {
    fr: '+33',
    be: '+32',
    de: '+49',
    gb: '+44',
    ch: '+41',
    es: '+34',
  },
};

export default {
  TELEPHONY_NUMBER_OFFER,
};
