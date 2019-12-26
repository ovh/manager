import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import tucTelecomRetractation from './telecom-retractation.component';

const moduleName = 'tucTelecomRetractation';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .component('tucTelecomRetractation', tucTelecomRetractation)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
