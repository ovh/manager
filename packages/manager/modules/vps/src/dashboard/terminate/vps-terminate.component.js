import controller from './vps-terminate.controller';
import template from './vps-terminate.html';

export default {
  bindings: {
    cancel: '<',
    confirm: '<',
    degressivityInformation: '<',
    hasManualRefund: '<',
    isActionAvailable: '<',
    serviceName: '<',
    supportTicketLink: '<',
  },
  controller,
  name: 'ovhManagerVpsTerminate',
  template,
};
