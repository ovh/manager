import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerResourceTaggingDashboardTile';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerResourceTaggingDashboardTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
