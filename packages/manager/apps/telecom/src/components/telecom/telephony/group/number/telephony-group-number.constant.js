angular
  .module('managerApp')
  .constant('TELPHONY_NUMBER_JSPLUMB_INSTANCE_OPTIONS', {
    PaintStyle: {
      strokeWidth: 2,
      stroke: '#122844',
    },
    HoverPaintStyle: {
      strokeWidth: 4,
    },
    ConnectionsDetachable: false,
    EndpointStyle: {
      fillStyle: 'transparent',
    },
    Anchors: ['Center'],
    MaxConnections: -1,
    Connector: ['TucTwoSegments', { radius: 30 }],
  })
  .constant('TELEPHONY_NUMBER_JSPLUMB_ENDPOINTS_OPTIONS', {
    topLeft: {
      anchor: [0.5, 0.5, -1, -1],
    },
  })
  .constant('TELEPHONY_NUMBER_JSPLUMB_CONNECTIONS_OPTIONS', {
    disabled: {
      cssClass: 'jtk-connector-disabled',
    },
  });
