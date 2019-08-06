import template from './country-flag.html';
import controller from './country-flag.controller';

export default {
  name: 'countryFlag',
  template,
  controller,
  bindings: {
    country: '<',
    label: '@',
  },
};
