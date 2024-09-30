import illustration from '@/assets/images/sidebar/telecom.png';
import { Node } from '../node';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

const telecomUniverse: Node = {
  id: 'telecom',
  idAttr: 'telecom-link',
  translation: 'sidebar_telecom',
  shortTranslation: 'sidebar_telecom_short',
  illustration,
  svgIcon: OvhProductName.PHONE,
  features: ['telecom'],
  routing: {
    application: 'telecom',
    hash: '#/',
  },
};

telecomUniverse.children = [
  {
    id: 'internet',
    idAttr: 'internet-link',
    universe: telecomUniverse.id,
    translation: 'sidebar_internet',
    features: ['pack', 'overthebox'],
    children: [
      {
        id: 'packs',
        idAttr: 'packs-link',
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
        idAttr: 'otb-link',
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
    idAttr: 'telephony-link',
    universe: telecomUniverse.id,
    translation: 'sidebar_telephony',
    features: ['telephony', 'sms', 'fax'],
    children: [
      {
        id: 'voipgroup',
        idAttr: 'voipgroup-link',
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
        idAttr: 'sms-link',
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
        idAttr: 'fax-link',
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
    idAttr: 'telecom-operations-link',
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
