import angular from 'angular';

import controller from './telecom-sms-phonebooks-create.controller';
import template from './telecom-sms-phonebooks-create.html';

const moduleName = 'ovhModuleSmsPhonebooksCreate';

angular
  .module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.phonebooks.create', {
      url: '/create',
      views: {
        'smsView@sms.service': {
          template,
          controller,
          controllerAs: 'PhonebooksCreateCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_phonebooks_create'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
