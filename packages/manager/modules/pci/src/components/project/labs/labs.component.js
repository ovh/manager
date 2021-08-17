import template from './labs.html';

export default {
  template,
  bindings: {
    lab: '<',
    onAccept: '&',
    onContractClick: '&',
  },
};
