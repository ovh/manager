import angular from 'angular';
import '@ovh-ux/ng-ovh-form-flat';

import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import directive from './contracts.directive';

import './contracts.less';

const moduleName = 'cucContracts';

angular
  .module(moduleName, [
    'ngOvhFormFlat',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .directive('cucContracts', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
