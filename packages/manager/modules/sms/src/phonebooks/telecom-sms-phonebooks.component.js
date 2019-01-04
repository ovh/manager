import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-phonebooks.controller';
import template from './telecom-sms-phonebooks.html';

import create from './create';

const moduleName = 'ovhManagerSmsPhonebooksComponent';

angular
  .module(moduleName, [
    'ui.router',
    create,
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.phonebooks', {
      url: '/phonebooks',
      views: {
        'smsInnerView@sms': {
          template,
          controller,
          controllerAs: 'PhonebooksCtrl',
        },
      },
      params: {
        bookKey: null,
      },
      translations: ['.'],
    });
  })
  .factory('TelecomSmsPhoneBooksNumber', () => ({
    isValid: number => !!(number
        && number.match(/^\+?(\d|\.| |#|-)+$/)
        && number.length < 26
        && number.length > 2),
  }));

export default moduleName;
