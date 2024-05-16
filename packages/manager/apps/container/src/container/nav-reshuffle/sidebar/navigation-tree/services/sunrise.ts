export default {
  id: 'sunrise',
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
      translation: 'sidebar_sunrise_infra',
      routing: {
        application: 'sunrise',
        hash: '#/horizon-view',
      },
    },
    {
      id: 'telephony',
      translation: 'sidebar_sunrise_contact_center',
      routing: {
        application: 'sunrise',
        hash: '#/telephony',
      },
    },
    {
      id: 'csp2',
      translation: 'sidebar_sunrise_office',
      routing: {
        application: 'sunrise',
        hash: '#/csp2',
      },
    },
    {
      id: 'sslGateway',
      translation: 'sidebar_sunrise_ssl_gateway',
      routing: {
        application: 'sunrise',
        hash: '#/sslGateway',
      },
    },
  ],
};
