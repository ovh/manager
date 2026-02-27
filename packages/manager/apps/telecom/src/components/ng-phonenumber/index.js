import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ui-select';

import component from './ng-phonenumber.component';

import './ng-phonenumber.less';

const moduleName = 'ovhManagerTelecomComponentsPhonenumber';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.select',
  ])
  .component('phonenumber', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
