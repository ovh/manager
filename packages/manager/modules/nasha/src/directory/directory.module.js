import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './directory.routing';

const moduleName = 'ovhManagerNashaDirectory';

angular
  .module(moduleName, ['oui', 'ui.router', ListLayoutHelper.moduleName])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
