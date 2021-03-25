import controller from './status.controller';
import template from './template.html';

export default {
  bindings: {
    canResiliate: '<',
    createResiliationTicket: '<',
    services: '<',
    translatedServiceEnum: '<',
    translatedStatusEnum: '<',
    ticketURL: '<',
    message: '<',
    goToResiliation: '<',
    goToDeleteInstances: '<',
  },
  controller,
  template,
};
