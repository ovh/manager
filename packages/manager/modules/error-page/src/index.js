import angular from 'angular';
import 'angular-translate';

import component from './error.component';

import './error.less';

const moduleName = 'ovhManagerErrorPage';

angular.module(moduleName, [
  'pascalprecht.translate',
])
  .component('managerErrorPage', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
