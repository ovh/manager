import template from './events.html';
import controller from './events.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.calls.events', {
    url: '/events',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'EventsCtrl',
      },
    },
  });
};
