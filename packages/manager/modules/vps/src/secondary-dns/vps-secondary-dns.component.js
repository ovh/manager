import controller from './vps-secondary-dns.controller';
import template from './vps-secondary-dns.html';

export default {
  bindings: {
    goToAddSecondaryDns: '<',
    goToDeleteSecondaryDns: '<',
  },
  controller,
  name: 'ovhManagerVpsSecondaryDns',
  template,
};
