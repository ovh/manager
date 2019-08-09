import template from '../../common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.html';
import controller from '../../common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.controller';

export default {
  template,
  controller,
  bindings: {
    datacenters: '<datacenterList',
  },
};
