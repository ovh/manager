import angular from 'angular';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import details from './details';
import routing from './cloud-connect.routing';
import service from './cloud-connect.service';

import '@ovh-ux/ng-ui-router-breadcrumb';

const moduleName = 'ovhCloudConnect';

angular
  .module(moduleName, [
    ListLayoutHelper.moduleName,
    'ngUiRouterBreadcrumb',
    details,
  ])
  .config(routing)
  .service('cloudConnectService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
