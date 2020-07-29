import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add';
import deleteNodePool from './delete';
import nodePoolComponent from './node-pool.component';
import nodes from './nodes';
import routing from './node-pool.routing';

const moduleName = 'ovhManagerPciProjectKubernetesNodePools';

angular
  .module(moduleName, [
    add,
    deleteNodePool,
    nodes,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ovh-api-services',
    'ui.router',
    'ngOvhCloudUniverseComponents',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectKubernetesNodePoolsComponent',
    nodePoolComponent,
  );

export default moduleName;
