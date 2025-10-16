import DedicatedcloudDatacenterZertoSiteStateBadge from './dedicatedcloud-datacenter-zerto-site-state-badge.html';
import controller from './dedicatedcloud-datacenter-zerto-site-state-badge.controller';

export default {
  bindings: {
    zertoMultiSites: '<',
  },
  controller,
  template: DedicatedcloudDatacenterZertoSiteStateBadge,
  name: 'dedicatedCloudDatacenterZertoSiteStateBadge',
};
