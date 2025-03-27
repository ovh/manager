import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import moveNsxEdgeComponent from '../../../../components/dedicated-cloud/datacenter/move-nsxt-edge';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './move-nsxt-edge.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterMoveNsxtEdgeModalModule';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    moveNsxEdgeComponent,
  ])
  .config(routing);

export default moduleName;
