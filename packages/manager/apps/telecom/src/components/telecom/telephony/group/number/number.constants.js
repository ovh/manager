export const JSPLUMB_INSTANCE_OPTIONS = {
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
};

export const JSPLUMB_ENDPOINTS_OPTIONS = {
  topLeft: {
    anchor: [0.5, 0.5, -1, -1],
  },
};

export const JSPLUMB_CONNECTIONS_OPTIONS = {
  disabled: {
    cssClass: 'jtk-connector-disabled',
  },
};

export default {
  JSPLUMB_INSTANCE_OPTIONS,
  JSPLUMB_ENDPOINTS_OPTIONS,
  JSPLUMB_CONNECTIONS_OPTIONS,
};
