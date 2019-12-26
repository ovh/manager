import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './empty.component';

import './index.less';

const moduleName = 'ovhManagerPciComponentsProjectEmpty';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('pciProjectEmpty', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
