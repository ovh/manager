import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-senders.controller';
import template from './telecom-sms-senders.html';

import add from './add';
import blacklisted from './blacklisted';

const moduleName = 'ovhManagerSmsSendersComponent';

angular
  .module(moduleName, [
    'ui.router',
    add,
    blacklisted,
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.senders', {
      url: '/senders',
      views: {
        'smsInnerView@sms': {
          template,
          controller,
          controllerAs: 'SmsSendersCtrl',
        },
      },
      translations: ['.', './add'],
    });
  });

export default moduleName;
