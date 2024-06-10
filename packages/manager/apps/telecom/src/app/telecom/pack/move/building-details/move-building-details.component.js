import controller from './move-building-details.controller';
import template from './move-building-details.html';

export default {
  controller,
  template,
  bindings: {
    building: '<',
    isMultiOtpAvailable: '<',
  },
};
