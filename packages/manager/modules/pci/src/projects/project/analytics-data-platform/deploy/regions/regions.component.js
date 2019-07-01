import controller from './regions.controller';
import template from './regions.html';

export default {
  template,
  controller,
  bindings: {
    regionsByDatacenter: '<',
    regionsByContinent: '<',
    onDataChange: '&',
  },
};
