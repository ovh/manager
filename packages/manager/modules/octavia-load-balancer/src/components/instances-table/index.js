import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './instances-table.component';

const moduleName = 'ovhManagerInstancesTable';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('instancesTable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
