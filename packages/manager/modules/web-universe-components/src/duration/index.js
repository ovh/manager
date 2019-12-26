import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import wucDurationFilter from './durationFilter';

const moduleName = 'wucDuration';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .filter('wucDuration', wucDurationFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
