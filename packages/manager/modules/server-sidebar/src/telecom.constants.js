import { TELECOM } from './constants';

export const MANAGER_V4_CONFIG = {
  id: 'managerv4',
  icon: 'ovh-font ovh-font-backToV4',
  app: [TELECOM],
  link: 'https://www.ovh.com/managerv3/telephony2-main.pl',
  target: '_blank',
};

export const SMS_CONFIG = {
  loadOnState: ['sms'],
  id: 'sms',
  types: [
    {
      path: '/sms',
      state: 'sms.service.dashboard',
      stateParams: ['serviceName'],
      app: [TELECOM],
    },
  ],
  icon: 'ovh-font ovh-font-message',
  app: [TELECOM],
  feature: 'sms',
};

export const FREEFAX_CONFIG = {
  loadOnState: ['freefaxes'],
  id: 'fax',
  types: [
    {
      path: '/freefax',
      state: 'freefaxes.freefax',
      stateParams: ['serviceName'],
      app: [TELECOM],
      prefix: 'fax',
    },
  ],
  icon: 'ovh-font ovh-font-print',
  app: [TELECOM],
  feature: 'fax',
};

export const OVERTHEBOX_CONFIG = {
  loadOnState: ['overTheBoxes'],
  id: 'overthebox',
  types: [
    {
      path: '/overTheBox',
      state: 'overTheBoxes.overTheBox.details',
      stateParams: ['serviceName'],
      app: [TELECOM],
    },
  ],
  icon: 'ovh-font ovh-font-overTheBox',
  app: [TELECOM],
  feature: 'overthebox',
};

export const PACK_CONFIG = {
  loadOnState: ['telecom.packs'],
  id: 'pack',
  types: [
    {
      path: '/pack/xdsl',
      state: 'telecom.packs.pack',
      stateParams: ['packName'],
      app: [TELECOM],
      types: [
        {
          path: '/pack/xdsl/:packName/xdslAccess/services',
          state: 'telecom.packs.pack.xdsl.line',
          stateParams: ['packName', 'serviceName', 'number'],
          app: [TELECOM],
        },
      ],
    },
  ],
  icon: 'ovh-font ovh-font-telecom-ethernet',
  app: [TELECOM],
  feature: 'pack',
};

const TELEPHONY_SERVICES_DATA = {
  alias: {
    state: 'telecom.telephony.billingAccount.alias.details',
    prefix: 'number',
  },

  sip: {
    state: 'telecom.telephony.billingAccount.line.dashboard',
    prefix: 'line',
  },

  siptrunk: {
    state: 'telecom.telephony.billingAccount.line.dashboard',
    prefix: 'trunk',
  },

  plugAndFax: {
    state: 'telecom.telephony.billingAccount.line.dashboard',
    prefix: 'plug_fax',
  },

  fax: {
    state: 'telecom.telephony.billingAccount.fax.dashboard',
    prefix: 'fax',
  },

  carrierSip: {
    state: 'telecom.telephony.billingAccount.carrierSip.dashboard',
    prefix: 'carrier_sip',
  },
};

export const TELEPHONY_CONFIG = {
  loadOnState: ['telecom.telephony'],
  id: 'telephony',
  types: [
    {
      path: '/telephony',
      state: 'telecom.telephony.billingAccount',
      stateParams: ['billingAccount'],
      app: [TELECOM],
      types: [
        {
          path: '/telephony/:billingAccount/services',
          stateParams: ['billingAccount', 'serviceName'],
          app: [TELECOM],
          getPrefix: ({ type }) =>
            `server_sidebar_item_telephony_prefix_${TELEPHONY_SERVICES_DATA[type].prefix}`,
          getState: ({ type }) => TELEPHONY_SERVICES_DATA[type].state,
        },
      ],
    },
  ],
  icon: 'ovh-font ovh-font-phone',
  app: [TELECOM],
  feature: 'telephony',
};

export const TASKS_CONFIG = {
  id: 'tasks',
  icon: 'ovh-font ovh-font-tasks',
  app: [TELECOM],
  state: 'task',
};

export const TELECOM_SIDEBAR_CONFIG = [
  MANAGER_V4_CONFIG,
  PACK_CONFIG,
  TELEPHONY_CONFIG,
  SMS_CONFIG,
  FREEFAX_CONFIG,
  OVERTHEBOX_CONFIG,
  TASKS_CONFIG,
];

export const NUMBER_ORDER_CONFIG = {
  id: 'number',
  title: 'number',
  icon: 'ovh-font ovh-font-hashtag',
  state: 'telecom.orders.alias',
  app: [TELECOM],
  feature: 'telephony',
};

export const DOMAIN_ORDER_CONFIG = {
  id: 'domain',
  title: 'domain',
  icon: 'ovh-font ovh-font-domain',
  linkId: 'domain',
  target: '_blank',
  external: true,
  onClick: 'orders::domain-name::order',
  app: [TELECOM],
};

export const PACK_ORDER_CONFIG = {
  id: 'internet',
  title: 'internet',
  icon: 'ovh-font ovh-font-telecom-ethernet',
  feature: 'pack',
  children: [
    {
      title: 'internet_xdsl',
      linkId: 'internet_xdsl',
      target: '_blank',
      external: true,
      onClick: 'orders::xdsl::order',
    },
    {
      title: 'internet_fiber',
      linkId: 'internet_fiber',
      target: '_blank',
      external: true,
      onClick: 'orders::fibre::order',
    },
    {
      title: 'internet_sdsl',
      linkId: 'internet_sdsl',
      target: '_blank',
      external: true,
      onClick: 'orders::sdsl::order',
    },
    {
      title: 'internet_adsl_creation',
      linkId: 'internet_adsl_creation',
      target: '_blank',
      external: true,
      onClick: 'orders::adsl-new::order',
    },
    {
      title: 'internet_otb',
      linkId: 'internet_otb',
      target: '_blank',
      external: true,
    },
  ],
};

export const TELEPHONY_ORDER_CONFIG = {
  id: 'telephony',
  title: 'telephony',
  icon: 'ovh-font ovh-font-phone',
  app: [TELECOM],
  feature: 'telephony',
  children: [
    {
      title: 'telephony_voip',
      linkId: 'telephony_voip',
      target: '_blank',
      external: true,
      onClick: 'orders::telephony::voip::order',
      app: [TELECOM],
    },
    {
      title: 'telephony_siptrunk',
      linkId: 'telephony_siptrunk',
      target: '_blank',
      external: true,
      onClick: 'orders::telephony::sip-trunk::order',
      app: [TELECOM],
    },
    {
      title: 'telephony_siptrunk_call',
      linkId: 'telephony_siptrunkCall',
      target: '_blank',
      external: true,
      onClick: 'orders::telephony::sip-trunk-included::order',
      app: [TELECOM],
    },
    {
      title: 'telephony_accessories',
      state: 'telecom.orders.accessories',
      app: [TELECOM],
    },
  ],
};

export const EMAIL_ORDER_CONFIG = {
  id: 'email',
  title: 'email',
  icon: 'ovh-font ovh-font-mail',
  app: [TELECOM],
  children: [
    {
      title: 'email_exchange',
      linkId: 'email_exchange',
      target: '_blank',
      external: true,
      onClick: 'orders::email::email-microsoft-exchange::order',
      app: [TELECOM],
    },
    {
      title: 'email_sharepoint',
      linkId: 'email_sharepoint',
      target: '_blank',
      external: true,
      tracker: 'orders::email::microsoft-sharepoint::order',
      app: [TELECOM],
    },
  ],
};

export const OFFICE_ORDER_CONFIG = {
  id: 'office365',
  title: 'office365',
  icon: 'ms-Icon ms-Icon--OfficeLogo',
  app: [TELECOM],
  children: [
    {
      title: 'office365_business',
      linkId: 'office365_business',
      target: '_blank',
      external: true,
      onClick: 'orders::office365::licences-office::order',
      app: [TELECOM],
    },
    {
      title: 'office365_sharepoint',
      linkId: 'office365_sharepoint',
      target: '_blank',
      external: true,
      tracker: 'orders::office365::microsoft-sharepoint::order',
      app: [TELECOM],
    },
  ],
};

export const SMS_ORDER_CONFIG = {
  id: 'order-sms',
  title: 'sms',
  icon: 'ovh-font ovh-font-message',
  app: [TELECOM],
  feature: 'sms',
  children: [
    {
      title: 'sms',
      state: 'sms.order',
      app: [TELECOM],
      feature: 'sms:order',
    },
    {
      title: 'sms_hlr',
      linkId: 'smsHlr',
      target: '_blank',
      external: true,
      tracker: 'orders::sms::hlr::order',
      app: [TELECOM],
      feature: 'sms:hlr',
    },
  ],
};

// fax
export const FREEFAX_ORDER_CONFIG = {
  id: 'order-fax',
  title: 'fax',
  feature: 'fax',
  icon: 'ovh-font ovh-font-print',
  linkId: 'faxOrder',
  external: true,
  target: '_blank',
  app: [TELECOM],
  tracker: 'orders::freefax::order',
};

export const TELECOM_ORDER_SIDEBAR_CONFIG = [
  NUMBER_ORDER_CONFIG,
  DOMAIN_ORDER_CONFIG,
  PACK_ORDER_CONFIG,
  TELEPHONY_ORDER_CONFIG,
  EMAIL_ORDER_CONFIG,
  OFFICE_ORDER_CONFIG,
  SMS_ORDER_CONFIG,
  FREEFAX_ORDER_CONFIG,
];

export default { TELECOM_SIDEBAR_CONFIG, TELECOM_ORDER_SIDEBAR_CONFIG };
