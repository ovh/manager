import angular from 'angular';
import '@uirouter/angularjs';
import atInternet from '@ovh-ux/ng-at-internet';

import { deleteModal } from '@ovh-ux/manager-components';
import component from './vps-terminate.component';
import routing from './vps-terminate.routing';
import service from './vps-terminate.service';

const moduleName = 'ovhManagerVpsTerminate';

angular
  .module(moduleName, ['ui.router', atInternet, deleteModal])
  .config(routing)
  .component(component.name, component)
  .service('vpsTerminate', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
