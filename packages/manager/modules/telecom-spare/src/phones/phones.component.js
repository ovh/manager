import controller from './phones.controller';
import template from './phones.html';

export default {
  bindings: {
    deleteSpare: '<',
    replaceSpare: '<',
    phones: '<',
    goToPhones: '<',
    spare: '<',
  },
  controller,
  template,
};
