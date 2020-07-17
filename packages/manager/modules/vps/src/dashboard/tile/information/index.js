import angular from 'angular';
import 'angular-translate';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './information.component';

const moduleName = 'ovhManagerVpsDashboardTileInformation';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
  ])
  .component('vpsDashboardTileInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
