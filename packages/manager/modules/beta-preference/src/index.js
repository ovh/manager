import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-user-pref';
import 'angular-translate';

import component from './component';
import service from './service';

const moduleName = 'ovhManagerBetaPreference';

angular
  .module(moduleName, [
    'ngOvhUserPref',
    'ovhManagerCore',
    'pascalprecht.translate',
  ])
  .component('ovhManagerBetaPreference', component)
  .service('betaPreferenceService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
