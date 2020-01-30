const SMS_URL = {
  hlrTermsOfUse:
    'https://www.ovh.com/fr/support/documents_legaux/version/conditions_particulieres_HLR_2016-04-07.pdf',
  guides: {
    receivers: 'https://www.ovh.com/fr/g2402.liste_de_destinataire_sms',
  },
};

const SMS_GUIDES = {
  sections: [
    {
      label: 'sms_guides_section_compose',
      guides: [
        {
          label: 'sms_guides_compose_faq',
          url: {
            fr: 'https://www.ovh.com/fr/g2169.{title}',
          },
        },
        {
          label: 'sms_guides_compose_filters',
          url: {
            fr: 'https://www.ovh.com/fr/g747.{title}',
          },
        },
        {
          label: 'sms_guides_compose_manager',
          url: {
            fr: 'https://www.ovh.com/fr/g2142.{title}',
          },
        },
        {
          label: 'sms_guides_compose_email',
          url: {
            fr:
              'https://docs.ovh.com/fr/sms/envoyer-sms-depuis-adresse-email/#gestion-des-destinataires',
          },
        },
        {
          label: 'sms_guides_compose_url',
          url: {
            fr: 'https://www.ovh.com/fr/g2153.{title}',
          },
        },
        {
          label: 'sms_guides_compose_usa',
          url: {
            fr: 'https://www.ovh.com/fr/g1754.{title}',
          },
        },
        {
          label: 'sms_guides_compose_campaign',
          url: {
            fr: 'https://www.ovh.com/fr/g2212.{title}',
          },
        },
        {
          label: 'sms_guides_compose_hlr',
          url: {
            fr: 'https://www.ovh.com/fr/g2179.{title}',
          },
        },
      ],
    },
    {
      label: 'sms_guides_section_outgoing',
      guides: [
        {
          label: 'sms_guides_outgoing_faq',
          url: {
            fr: 'http://guides.ovh.com/SmsFaxFaqHistoriqueSms',
          },
        },
      ],
    },
    {
      label: 'sms_guides_section_options',
      guides: [
        {
          label: 'sms_guides_options_callback',
          url: {
            fr: 'http://guides.ovh.com/TelSmsCallBack',
          },
        },
      ],
    },
    {
      label: 'sms_guides_section_users',
      guides: [
        {
          label: 'sms_guides_users_about',
          url: {
            fr: 'https://www.ovh.com/fr/g2144.{title}',
          },
        },
        {
          label: 'sms_guides_users_faq',
          url: {
            fr: 'http://guides.ovh.com/SmsUserFaq',
          },
        },
        {
          label: 'sms_guides_users_add',
          url: {
            fr: 'http://guides.ovh.com/SmsUserAdd',
          },
        },
        {
          label: 'sms_guides_users_quota',
          url: {
            fr: 'http://guides.ovh.com/SmsUserQuota',
          },
        },
      ],
    },
    {
      label: 'sms_guides_section_api',
      guides: [
        {
          label: 'sms_guides_api_cookbook',
          url: {
            fr: 'https://www.ovh.com/fr/g1664.{title}',
          },
        },
        {
          label: 'sms_guides_api_java',
          url: {
            fr: 'https://www.ovh.com/fr/g1670.{title}',
          },
        },
        {
          label: 'sms_guides_api_csharp',
          url: {
            fr: 'https://www.ovh.com/fr/g1654.{title}',
          },
        },
        {
          label: 'sms_guides_api_nodejs',
          url: {
            fr: 'https://www.ovh.com/fr/g1651.{title}',
          },
        },
        {
          label: 'sms_guides_api_php',
          url: {
            fr: 'https://www.ovh.com/fr/g1639.{title}',
          },
        },
      ],
    },
  ],
};

const SMS_ALERTS = {
  sms: {
    bodyMaxLength: 70,
  },
  variables: {
    user: '|USER|',
    remaining: '|REMAINING|',
    alertthreshold: '|ALERTTHRESHOLD|',
    creditsleft: '|CREDITSLEFT|',
  },
};

const SMS_PHONEBOOKS = {
  numberFields: ['homePhone', 'homeMobile', 'workPhone', 'workMobile'],
  emptyFields: {
    group: 'No group',
    numbers: '0033',
  },
};

export default {
  SMS_URL,
  SMS_GUIDES,
  SMS_ALERTS,
  SMS_PHONEBOOKS,
};
