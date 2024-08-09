import illustration from '@/assets/images/sidebar/telecom.png';
export default {
  id: 'telecom',
  idAttr: 'telecom-link',
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
      idAttr: 'internet-link',
      translation: 'sidebar_internet',
      features: ['pack', 'overthebox'],
      children: [
        {
          id: 'packs',
          idAttr: 'packs-link',
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
          idAttr: 'otb-link',
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
      idAttr: 'telephony-link',
      translation: 'sidebar_telephony',
      features: ['telephony', 'sms', 'fax'],
      children: [
        {
          id: 'voipgroup',
          idAttr: 'voipgroup-link',
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
          idAttr: 'sms-link',
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
          idAttr: 'fax-link',
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
      idAttr: 'telecom-operations-link',
      translation: 'sidebar_telecom_operations',
      routing: {
        application: 'telecom',
        hash: '#/task',
      },
      count: false,
    },
  ],
};
