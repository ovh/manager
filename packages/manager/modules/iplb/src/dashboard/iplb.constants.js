export default {
  metricsUrl: 'https://opentsdb-in.gra1-ovh.metrics.ovh.net/api',
  graphs: ['conn', 'reqm'],
  graphParams: {
    '1h-ago': {
      downsample: '1m',
    },
    '3h-ago': {
      downsample: '3m',
    },
    '6h-ago': {
      downsample: '5m',
    },
    '12h-ago': {
      downsample: '10m',
    },
    '1d-ago': {
      downsample: '30m',
    },
    '1w-ago': {
      downsample: '6h',
    },
    '1n-ago': {
      downsample: '12h',
    },
    '6n-ago': {
      downsample: '3d',
    },
    '1y-ago': {
      downsample: '7d',
    },
  },
  graphScales: {
    lb1: [
      '1h-ago',
      '3h-ago',
      '6h-ago',
      '12h-ago',
      '1d-ago',
      '1w-ago',
      '1n-ago',
    ],
    lb2: [
      '1h-ago',
      '6h-ago',
      '12h-ago',
      '1d-ago',
      '1w-ago',
      '1n-ago',
      '6n-ago',
      '1y-ago',
    ],
  },
  protocols: ['http', 'https', 'tcp', 'tls', 'udp'],
  balances: ['roundrobin', 'first', 'leastconn', 'source', 'uri'],
  stickinesses: ['none', 'cookie', 'sourceIp'],
  probeTypes: ['', 'http', 'mysql', 'pgsql', 'smtp', 'tcp', 'oco'],
  probeMethods: ['GET', 'HEAD', 'OPTIONS'],
  probeMatches: ['default', 'status', 'contains', 'matches'],
  portLimit: 49151,
  lbWeightMax: 256,
  sslTypes: ['free', 'dv', 'ev'],
  organisationTypes: [
    'Private Organisation',
    'Government Entity',
    'Business Entity',
  ],
  sslOrders: {
    comodoEv: {
      planCode: 'sslgateway-advanced',
      duration: 'P1M',
      configuration: {},
      option: [
        {
          planCode: 'sslgateway-ssl-ev-single',
          configuration: {},
          duration: 'P1Y',
          quantity: 1,
        },
      ],
      quantity: 1,
      productId: 'sslGateway',
    },
    comodoDv: {
      planCode: 'sslgateway-advanced',
      duration: 'P1M',
      configuration: {},
      option: [],
      quantity: 1,
      productId: 'sslGateway',
    },
    free: {
      planCode: 'sslgateway-free',
      duration: 'P1M',
      configuration: {},
      option: [],
      quantity: 1,
      productId: 'sslGateway',
    },
  },
};
