import illustration from '@/assets/images/sidebar/telecom.png';
export default {
  id: 'telecom',
  translation: 'sidebar_telecom',
  shortTranslation: 'sidebar_telecom_short',
  illustration,
  features: ['telecom'],
  routing: {
    application: 'telecom',
    hash: '#/',
  },
  children: [
    {
      id: 'internet',
      translation: 'sidebar_internet',
      features: ['pack', 'overthebox'],
      children: [
        {
          id: 'packs',
          translation: 'sidebar_packs_xdsl',
          serviceType: 'PACK_XDSL',
          routing: {
            application: 'telecom',
            hash: '#/pack',
          },
          features: ['pack'],
        },
        {
          id: 'otb',
          translation: 'sidebar_otb',
          serviceType: 'OVERTHEBOX',
          routing: {
            application: 'telecom',
            hash: '#/overTheBox',
          },
          features: ['overthebox'],
        },
      ],
    },
    {
      id: 'telephony',
      translation: 'sidebar_telephony',
      features: ['telephony', 'sms', 'fax'],
      children: [
        {
          id: 'voipgroup',
          translation: 'sidebar_telephony_voip_groups',
          serviceType: 'TELEPHONY',
          routing: {
            application: 'telecom',
            hash: '#/telephony',
          },
          features: ['telephony'],
        },
        {
          id: 'sms',
          translation: 'sidebar_telephony_sms',
          serviceType: 'SMS',
          routing: {
            application: 'telecom',
            hash: '#/sms',
          },
          features: ['sms'],
        },
        {
          id: 'fax',
          translation: 'sidebar_telephony_fax',
          serviceType: 'FREEFAX',
          routing: {
            application: 'telecom',
            hash: '#/freefax',
          },
          features: ['fax'],
        },
      ],
    },
    {
      id: 'telecom-operations',
      translation: 'sidebar_telecom_operations',
      routing: {
        application: 'telecom',
        hash: '#/task',
      },
      count: false,
    },
  ],
};
