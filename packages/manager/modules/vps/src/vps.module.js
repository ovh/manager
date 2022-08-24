import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import '@ovh-ux/ng-ui-router-breadcrumb';

import routing from './vps.routing';

const moduleName = 'ovhManagerVPS';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'oui',
    ListLayoutHelper.moduleName,
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./vps/translations */);
export default moduleName;
