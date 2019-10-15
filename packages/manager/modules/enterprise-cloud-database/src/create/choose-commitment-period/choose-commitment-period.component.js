import controller from './choose-commitment-period.controller';
import template from './choose-commitment-period.html';

export default {
  bindings: {
    allowEdit: '<',
    commitmentPeriods: '<',
    enterpriseDb: '<',
    onChange: '&',
    user: '<',
    databasePrice: '<',
  },
  controller,
  template,
};
