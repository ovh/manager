import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './description.component';

const moduleName = 'ovhManagerPciProjectsNewDescription';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectNewDescription', component);

export default moduleName;
