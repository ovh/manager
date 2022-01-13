import angular from 'angular';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import component from './cloud-connect.component';
import details from './details';
import routing from './cloud-connect.routing';
import service from './cloud-connect.service';

import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ui-router-breadcrumb';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

const moduleName = 'ovhCloudConnect';

angular
  .module(moduleName, [
    ListLayoutHelper.moduleName,
    'ngAtInternet',
    'ngUiRouterBreadcrumb',
    'ovh-api-services',
    'oui',
    details,
  ])
  .config(routing)
  .service('cloudConnectService', service)
  .component('cloudConnect', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
