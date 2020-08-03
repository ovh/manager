import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './nasha.routing';

const moduleName = 'ovhManagerNasha';

angular
  .module(moduleName, ['oui', ListLayoutHelper.moduleName, 'ui.router'])
  .config(routing);

export default moduleName;
