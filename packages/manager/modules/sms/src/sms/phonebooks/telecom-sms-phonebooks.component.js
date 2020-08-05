import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-ui-validate';

import controller from './telecom-sms-phonebooks.controller';
import template from './telecom-sms-phonebooks.html';

import create from './create';

const moduleName = 'ovhManagerSmsPhonebooksComponent';

angular
  .module(moduleName, ['ui.router', 'ui.validate', create])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.phonebooks', {
      url: '/phonebooks',
      views: {
        smsInnerView: {
          template,
          controller,
          controllerAs: 'PhonebooksCtrl',
        },
      },
      params: {
        bookKey: null,
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_phonebooks_phonebook_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .factory('TelecomSmsPhoneBooksNumber', () => ({
    isValid: (number) =>
      !!(
        number &&
        number.match(/^\+?(\d|\.| |#|-)+$/) &&
        number.length < 26 &&
        number.length > 2
      ),
  }));

export default moduleName;
