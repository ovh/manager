import angular from 'angular';
import deleteNsxComponent from '../../../../components/dedicated-cloud/datacenter/network/delete-nsx';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './delete-nsx.routing';

const moduleName =
  'ovhManagerDedicatedCloudDatacenterNetworkDeleteNsxModalModule';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    deleteNsxComponent,
  ])
  .config(routing);

export default moduleName;
