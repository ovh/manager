import DedicatedcloudDatacenterZertoStateBadge from './dedicatedcloud-datacenter-zerto-state-badge.html';
import controller from './dedicatedcloud-datacenter-zerto-state-badge.controller';

export default {
  bindings: {
    zertoState: '@',
  },
  controller,
  template: DedicatedcloudDatacenterZertoStateBadge,
  name: 'dedicatedCloudDatacenterZertoStateBadge',
};
