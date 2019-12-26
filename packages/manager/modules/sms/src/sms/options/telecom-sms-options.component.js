import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-options.controller';
import template from './telecom-sms-options.html';

import manage from './manage';
import recredit from './recredit';
import response from './response';
import blacklist from './blacklist';

const moduleName = 'ovhManagerSmsOptionsComponent';

angular
  .module(moduleName, ['ui.router', blacklist, manage, recredit, response])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.options', {
      url: '/options',
      views: {
        smsInnerView: {
          template,
          controller,
          controllerAs: 'TelecomSmsOptionsCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    });
  });

export default moduleName;
