import template from './dedicatedCloud-datacenter-zerto-drp.html';

export default {
  bindings: {
    configurationState: '<',
    vraState: '<',
    ltrState: '<',
  },
  name: 'dedicatedCloudDatacenterZertoDrp',
  template,
};
