export default [
  {
    subitems: [
      {
        title: 'pack',
        path: '/pack/xdsl',
        url: '#/pack',
        paramName: 'serviceName',
        application: 'telecom',
      },
      {
        title: 'over_the_box',
        path: '/overTheBox',
        url: '#/overTheBoxes',
        paramName: 'serviceName',
        application: 'telecom',
      },
    ],
    title: 'internet',
  },
  {
    subitems: [
      {
        title: 'telephony_lines',
        path: '/telephony',
        url: '#/telephony',
        paramName: 'billingAccount',
        application: 'telecom',
      },
      {
        title: 'sms',
        path: '/sms',
        url: '#/sms',
        paramName: 'serviceName',
        application: 'telecom',
      },
      {
        title: 'freefax',
        path: '/freefax',
        url: '#/freefax',
        paramName: 'serviceName',
        application: 'telecom',
      },
    ],
    title: 'telephony',
  },
];
