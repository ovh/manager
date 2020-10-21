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
            es: 'https://docs.ovh.com/es/sms/',
            en: 'https://docs.ovh.com/gb/en/sms/',
            it: 'https://docs.ovh.com/it/sms/',
            pl: 'https://docs.ovh.com/pl/sms/',
          },
        },
        {
          label: 'sms_guides_compose_filters',
          url: {
            fr: 'https://www.ovh.com/fr/g747.{title}',
            es: 'https://docs.ovh.com/es/sms/',
            en: 'https://docs.ovh.com/gb/en/sms/',
            it: 'https://docs.ovh.com/it/sms/',
            pl: 'https://docs.ovh.com/pl/sms/',
          },
        },
        {
          label: 'sms_guides_compose_manager',
          url: {
            fr: 'https://www.ovh.com/fr/g2142.{title}',
            es:
              'https://docs.ovh.com/es/sms/enviar-sms-desde-el-area-de-cliente/',
            en:
              'https://docs.ovh.com/gb/en/sms/send_sms_messages_via_control_panel/',
            it: 'https://docs.ovh.com/it/sms/inviare_sms_dallo_spazio_cliente/',
            pl:
              'https://docs.ovh.com/pl/sms/wysylanie-wiadomosci-sms-z-panelu-klienta/',
          },
        },
        {
          label: 'sms_guides_compose_email',
          url: {
            fr:
              'https://docs.ovh.com/fr/sms/envoyer-sms-depuis-adresse-email/#gestion-des-destinataires',
            es: 'https://docs.ovh.com/es/sms/',
            en:
              'https://docs.ovh.com/gb/en/sms/send-sms-message-via-email-address/',
            it: 'https://docs.ovh.com/it/sms/inviare-sms-da-indirizzo-email/',
            pl:
              'https://docs.ovh.com/pl/sms/wysylanie-wiadomosci-sms-z-adresu-e-mail/',
          },
        },
        {
          label: 'sms_guides_compose_url',
          url: {
            fr: 'https://www.ovh.com/fr/g2153.{title}',
            es: 'https://docs.ovh.com/es/sms/enviar-sms-desde-una-url/',
            en:
              'https://docs.ovh.com/ie/en/sms/send_sms_messages_via_url_-_http2sms/',
            it: 'https://docs.ovh.com/it/sms/inviare_sms_da_un_url_http2sms/',
            pl:
              'https://docs.ovh.com/pl/sms/wysylanie-wiadomosci-sms-z-adresu-url-http2sms/',
          },
        },
        {
          label: 'sms_guides_compose_usa',
          url: {
            fr: 'https://www.ovh.com/fr/g1754.{title}',
            es: 'https://docs.ovh.com/es/sms/envio_de_sms_a_estados_unidos/',
            en: 'https://docs.ovh.com/gb/en/sms/sending-sms-to-usa/',
            it: 'https://docs.ovh.com/it/sms/invio_sms_negli_stati-uniti/',
            pl:
              'https://docs.ovh.com/pl/sms/wysylanie_sms-ow_do_stanow_zjednoczonych',
          },
        },
        {
          label: 'sms_guides_compose_campaign',
          url: {
            fr: 'https://www.ovh.com/fr/g2212.{title}',
            es: 'https://docs.ovh.com/es/sms/crear-una-campana-sms/',
            en: 'https://docs.ovh.com/gb/en/sms/launch_first_sms_campaign/',
            it: 'https://docs.ovh.com/it/sms/la_prima_campagna_sms/',
            pl: 'https://docs.ovh.com/pl/sms/moja-pierwsza-kampania-sms/',
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
            es: 'https://docs.ovh.com/es/sms/historial-de-envios/',
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
            es:
              'https://docs.ovh.com/es/sms/enviar-sms-desde-correo-electronico/',
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
            es:
              'https://docs.ovh.com/es/sms/enviar-sms-con-java-usando-la-api-de-ovhcloud/',
            en:
              'https://docs.ovh.com/gb/en/sms/send_sms_with_ovhcloud_api_in_java/',
            it: 'https://docs.ovh.com/it/sms/inviare_sms_con_lapi_ovh_in_java/',
            pl:
              'https://docs.ovh.com/pl/sms/wysylanie-wiadomosci-sms-api-ovh-java/',
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
            es:
              'https://docs.ovh.com/es/sms/enviar-sms-con-nodejs-usando-la-api-de-ovhcloud/',
            en:
              'https://docs.ovh.com/gb/en/sms/send_sms_with_ovhcloud_api_in_nodejs/',
            it:
              'https://docs.ovh.com/it/sms/inviare_sms_con_lapi_ovh_in_nodejs/',
            pl:
              'https://docs.ovh.com/pl/sms/wysylanie-wiadomosci-sms-api-ovh-nodejs/',
          },
        },
        {
          label: 'sms_guides_api_php',
          url: {
            fr: 'https://www.ovh.com/fr/g1639.{title}',
            es:
              'https://docs.ovh.com/es/sms/enviar-sms-con-php-usando-la-api-de-ovhcloud/',
            en:
              'https://docs.ovh.com/gb/en/sms/send_sms_with_ovhcloud_api_in_php/',
            it: 'https://docs.ovh.com/it/sms/inviare_sms_con_lapi_ovh_in_php/',
            pl:
              'https://docs.ovh.com/pl/sms/wysylanie-wiadomosci-sms-api-ovh-php/',
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
