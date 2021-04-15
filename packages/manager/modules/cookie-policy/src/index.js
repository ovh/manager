import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import service from './service';

const moduleName = 'ovhManagerCookiePolicy';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .service('cookiePolicy', service)
  .run(
    /* @ngInject */ (cookiePolicy) => {
      cookiePolicy.checkConsent();
    },
  );

export default moduleName;
