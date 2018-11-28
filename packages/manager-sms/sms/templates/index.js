import angular from 'angular';

import controller from './telecom-sms-sms-templates.controller';
import template from './telecom-sms-sms-templates.html';

const moduleName = 'ovhManagerSmsSmsTemplates';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms.templates', {
    url: '/templates',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
