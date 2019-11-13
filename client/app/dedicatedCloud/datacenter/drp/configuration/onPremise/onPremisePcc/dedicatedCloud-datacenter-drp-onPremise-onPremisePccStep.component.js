import controller from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.controller';
import template from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.html';

export default {
  bindings: {
    goToPccDashboard: '<',
    goToPreviousStep: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpOnPremiseOnPremisePccStep',
  template,
};
