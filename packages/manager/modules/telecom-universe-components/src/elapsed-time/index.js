import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import tucElapsedTimeDirective from './elapsed-time.directive';
import TucElapsedTimePeriodicUpdater from './elapsed-time-periodic-updater.service';

const moduleName = 'tucElapsedTime';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .directive('tucElapsedTime', tucElapsedTimeDirective)
  .service('TucElapsedTimePeriodicUpdater', TucElapsedTimePeriodicUpdater)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
