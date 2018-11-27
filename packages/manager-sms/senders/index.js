import angular from 'angular';
import controller from './telecom-sms-senders.controller';
import template from './telecom-sms-senders.html';

import add from './add';
import blacklisted from './blacklisted';

const moduleName = 'ovhManagerSmsSenders';

angular.module(moduleName, [
  add,
  blacklisted,
]).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.senders', {
    url: '/senders',
    views: {
      'smsInnerView@telecom.sms': {
        template,
        controller,
        controllerAs: 'SmsSendersCtrl',
      },
    },
    translations: ['.', './add'],
  });
});

export default moduleName;
