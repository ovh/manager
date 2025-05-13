import controller from './billingDateRange.controller';
import template from './billingDateRange.html';

export default /* @ngInject */ function billingDateRangeDirective() {
  return {
    restrict: 'A',
    scope: {
      onChange: '=?',
    },
    bindToController: true,
    controllerAs: '$ctrl',
    controller,
    replace: false,
    template,
  };
}
