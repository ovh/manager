export const CLUSTER_RESPONSE_MOCK = {
  serviceName: 'cluster-2116.nutanix.ovh.net',
  allowedRedundancyFactor: [2],
  availableVersions: ['6.10', '7.0'],
  targetSpec: {
    name: 'cluster-2116.nutanix.ovh.net',
    version: '6.10',
    prismCentral: { type: 'alone', vip: '172.16.1.100', ips: [] },
    prismElementVip: '172.16.1.99',
    prismSecretId: '00000000-0000-0000-0000-000000000000',
    controlPanelURL: 'https://cluster-2116.nutanix.ovh.net:9440/',
    erasureCoding: false,
    redundancyFactor: 2,
    nodes: [
      {
        server: 'ns31715911.ip-57-129-136.eu',
        cvmIp: '172.16.1.1',
        ahvIp: '172.16.0.1',
        status: 'DEPLOYED',
        possibleActions: [
          {
            action: 'INSTALL',
            isPossible: false,
            reason: '{{ node_already_installed }}',
          },
          { action: 'REINSTALL', isPossible: true, reason: '' },
          {
            action: 'UNINSTALL',
            isPossible: false,
            reason: '{{ node_is_powered_on }}',
          },
          {
            action: 'TERMINATE',
            isPossible: false,
            reason: '{{ node_not_uninstalled }}',
          },
          {
            action: 'POWER_ON',
            isPossible: false,
            reason: '{{ node_is_powered_on }}',
          },
          { action: 'POWER_OFF', isPossible: true, reason: '' },
        ],
      },
      {
        server: 'ns31715909.ip-57-129-136.eu',
        cvmIp: '172.16.1.2',
        ahvIp: '172.16.0.2',
        status: 'DEPLOYED',
        possibleActions: [
          {
            action: 'INSTALL',
            isPossible: false,
            reason: '{{ node_already_installed }}',
          },
          { action: 'REINSTALL', isPossible: true, reason: '' },
          {
            action: 'UNINSTALL',
            isPossible: false,
            reason: '{{ node_is_powered_on }}',
          },
          {
            action: 'TERMINATE',
            isPossible: false,
            reason: '{{ node_not_uninstalled }}',
          },
          {
            action: 'POWER_ON',
            isPossible: false,
            reason: '{{ node_is_powered_on }}',
          },
          { action: 'POWER_OFF', isPossible: true, reason: '' },
        ],
      },
      {
        server: 'ns31715910.ip-57-129-130.eu',
        cvmIp: '172.16.1.3',
        ahvIp: '172.16.0.3',
        status: 'DEPLOYED',
        possibleActions: [
          {
            action: 'INSTALL',
            isPossible: false,
            reason: '{{ node_already_installed }}',
          },
          { action: 'REINSTALL', isPossible: true, reason: '' },
          {
            action: 'UNINSTALL',
            isPossible: false,
            reason: '{{ node_is_powered_on }}',
          },
          {
            action: 'TERMINATE',
            isPossible: false,
            reason: '{{ node_not_uninstalled }}',
          },
          {
            action: 'POWER_ON',
            isPossible: false,
            reason: '{{ node_is_powered_on }}',
          },
          { action: 'POWER_OFF', isPossible: true, reason: '' },
        ],
      },
    ],
    vrack: 'pn-1206211',
    gatewayCidr: '172.16.0.254/22',
    ipfo: '51.77.126.52/30',
    iplb: 'loadbalancer-080153d447748b49c172506ec59eed4a',
    rackAwareness: false,
    infraVlanNumber: 1,
    metadata: {
      initialCommitmentSize: 3,
    },
  },
  status: 'Active',
  iam: {
    displayName: 'cluster-2116.nutanix.ovh.net',
    id: '58711c09-296a-48da-9171-259628802423',
    urn: 'urn:v1:eu:resource:nutanix:cluster-2116.nutanix.ovh.net',
  },
};
