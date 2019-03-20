import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import filter from './filter';

const moduleName = 'cucBytes';

angular
  .module(moduleName, [])
  .filter('cucBytes', filter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
