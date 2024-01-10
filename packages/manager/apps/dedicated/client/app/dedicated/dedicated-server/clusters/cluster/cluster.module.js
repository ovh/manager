import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import nodes from '../nodes';
import node from '../nodes/node';
import routing from './cluster.routing';
import component from './cluster.component';
import service from './cluster.service';
import dashboard from './dashboard';
import editDisplayName from './edit-display-name';

const moduleName = 'ovhManagerDedicatedServerClusterDetail';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    nodes,
    node,
    dashboard,
    editDisplayName,
  ])
  .component('clusterMainPage', component)
  .service('Cluster', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
