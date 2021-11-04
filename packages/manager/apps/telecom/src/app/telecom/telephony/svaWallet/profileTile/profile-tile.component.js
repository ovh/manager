import template from './profile-tile.html';
import controller from './profile-tile.controller';

export default {
  template,
  controller,
  bindings: {
    showRepaymentLink: '<',
    svaWallet: '<',
  },
};
