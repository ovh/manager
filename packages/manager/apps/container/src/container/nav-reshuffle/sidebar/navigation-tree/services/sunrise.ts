export default {
  id: 'sunrise',
  idAttr: 'sunrise-link',
  translation: 'sidebar_sunrise',
  shortTranslation: 'sidebar_sunrise_short',
  routing: {
    application: 'sunrise',
  },
  count: false,
  features: ['sunrise'],
  children: [
    {
      id: 'horizon-view',
      idAttr: 'horizon-view-link',
      translation: 'sidebar_sunrise_infra',
      routing: {
        application: 'sunrise',
        hash: '#/horizon-view',
      },
    },
    {
      id: 'telephony',
      idAttr: 'telephony-link',
      translation: 'sidebar_sunrise_contact_center',
      routing: {
        application: 'sunrise',
        hash: '#/telephony',
      },
    },
    {
      id: 'csp2',
      idAttr: 'csp2-link',
      translation: 'sidebar_sunrise_office',
      routing: {
        application: 'sunrise',
        hash: '#/csp2',
      },
    },
    {
      id: 'sslGateway',
      idAttr: 'sslGateway-link',
      translation: 'sidebar_sunrise_ssl_gateway',
      routing: {
        application: 'sunrise',
        hash: '#/sslGateway',
      },
    },
  ],
};
