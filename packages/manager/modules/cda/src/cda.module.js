import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './cda.routing';
import onboarding from './onboarding';

const moduleName = 'ovhManagerCDA';

angular
  .module(moduleName, [
    'oui',
    ListLayoutHelper.moduleName,
    'ui.router',
    onboarding,
  ])
  .config(routing);

export default moduleName;
