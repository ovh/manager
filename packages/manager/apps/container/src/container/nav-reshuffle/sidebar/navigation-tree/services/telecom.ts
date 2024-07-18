import illustration from '@/assets/images/sidebar/telecom.png';
import { Node } from '../node';

const telecomUniverse: Node = {
  id: 'telecom',
  translation: 'sidebar_telecom',
  shortTranslation: 'sidebar_telecom_short',
  illustration,
  features: ['telecom'],
  routing: {
    application: 'telecom',
    hash: '#/',
  },
};

telecomUniverse.children = [
  {
    id: 'internet',
    universe: telecomUniverse.id,
    translation: 'sidebar_internet',
    features: ['pack', 'overthebox'],
    children: [
      {
        id: 'packs',
        universe: telecomUniverse.id,
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
        universe: telecomUniverse.id,
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
    universe: telecomUniverse.id,
    translation: 'sidebar_telephony',
    features: ['telephony', 'sms', 'fax'],
    children: [
      {
        id: 'voipgroup',
        universe: telecomUniverse.id,
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
        universe: telecomUniverse.id,
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
        universe: telecomUniverse.id,
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
    universe: telecomUniverse.id,
    translation: 'sidebar_telecom_operations',
    routing: {
      application: 'telecom',
      hash: '#/task',
    },
    count: false,
  },
];

export default telecomUniverse;
