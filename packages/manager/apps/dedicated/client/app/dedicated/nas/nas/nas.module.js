import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './nas.routing';

const moduleName = 'ovhManagerNAS';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    'ui.router',
  ])
  .config(routing);

export default moduleName;
