import angular from 'angular';

import controller from './telecom-sms-sms-templates.controller';
import template from './telecom-sms-sms-templates.html';

const moduleName = 'ovhManagerSmsSmsTemplates';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.sms.templates', {
    url: '/templates',
    views: {
      'smsView@sms.service': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state, $transition$) => () =>
        $state.go($transition$.from().name || '^'),
    },
    translations: { value: ['.'], format: 'json' },
  });
});

export default moduleName;
