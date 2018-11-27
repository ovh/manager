import angular from 'angular';
import controller from './telecom-sms-sms.controller';
import template from './telecom-sms-sms.html';

import compose from './compose';
import hlr from './hlr';

const moduleName = 'ovhManagerSmsSms';

angular.module(moduleName, [
  compose,
  hlr,
]).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms', {
    url: '/sms',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'TelecomSmsSmsCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
