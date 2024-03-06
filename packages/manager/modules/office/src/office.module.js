import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import routing from './office.routing';
import component from './office.component';

const moduleName = 'ovhManagerOfficeLicenses';

angular
  .module(moduleName, [
    ngOvhChart,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
  ])
  .component('microsoftOfficeLicense', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
