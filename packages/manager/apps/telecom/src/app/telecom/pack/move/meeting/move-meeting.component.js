import controller from './move-meeting.controller';
import template from './move-meeting.html';

export default {
  controller,
  template,
  bindings: {
    productCode: '<',
    eligibilityReference: '<',
    selected: '<',
  },
};
