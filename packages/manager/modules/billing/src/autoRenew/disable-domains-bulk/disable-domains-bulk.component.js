import controller from './disable-domains-bulk.controller';
import template from './disable-domains-bulk.html';

export default {
  bindings: {
    disableDomainsBulk: '<',
    goToAutorenew: '<',
  },
  controller,
  template,
};
