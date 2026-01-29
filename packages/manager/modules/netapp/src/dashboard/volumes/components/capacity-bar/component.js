import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    space: '<',
    usedData: '<',
    availableData: '<',
    overflow: '<',
    usedReserve: '<',
    availableReserve: '<',
    reserveSpace: '<',
  },
  template,
  controller,
};
