import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import '@ovh-ux/ng-ui-router-breadcrumb';

import onboarding from './onboarding';
import routing from './vps.routing';

const moduleName = 'ovhManagerVPS';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'oui',
    ListLayoutHelper.moduleName,
    'ui.router',
    onboarding,
  ])
  .config(routing);
export default moduleName;
