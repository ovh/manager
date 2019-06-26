import './deploy.scss';
import controller from './deploy.controller';
import template from './deploy.html';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    manageCluster: '<',
    capabilities: '<',
    publicCloud: '<',
    sshKeys: '<',
    vRack: '<',
    priceCatalog: '<',
    hasDefaultPaymentMethod: '<',
    paymentMethodUrl: '<',
    goToDeploy: '<',
  },
};
