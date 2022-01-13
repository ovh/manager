export const TRACKING_PREFIX = 'hpc::nutanix::cluster::redeploy';

export const REDEPLOY_CONFIG_OPTIONS = {
  INITIAL: 'redeployInitialConfig',
  CUSTOM: 'redeployCustomConfig',
};

export const PRISM_CENTRAL_TYPES = ['alone', 'scale'];

export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const IPV4_BLOCK_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])?$/;

export const CLUSTER_CONFIG_TERMS = {
  PRISM_CENTRAL: 'Prism Central',
  PRISM_CENTRAL_TYPE: 'Type',
  PRISM_CENTRAL_VIP: 'VIP',
  PRISM_CENTRAL_IP: 'IPs',
  PRISM_ELEMENT_VIP: 'Prism Element VIP',
  GATEWAY_CIDR: 'Gateway Cidr',
  REPLICATION_FACTOR: 'Replication Factor',
  ERASURE_CODING: 'Erasure Coding',
  AOS: 'AOS Version',
};

export default {
  TRACKING_PREFIX,
  REDEPLOY_CONFIG_OPTIONS,
  PRISM_CENTRAL_TYPES,
  IPV4_REGEX,
  IPV4_BLOCK_REGEX,
  CLUSTER_CONFIG_TERMS,
};
