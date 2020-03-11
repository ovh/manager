import angular from 'angular';
import 'angular-translate';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerVpsDashboardTileConfigurationUpgrade';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ngOvhTranslateAsyncLoader,
    ngUiRouterLayout,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('vpsUpgrade', service)
  .component(component.name, component);

export default moduleName;
