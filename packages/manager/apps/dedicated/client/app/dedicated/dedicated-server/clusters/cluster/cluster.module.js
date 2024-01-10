import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import { clusterMainPage } from '@ovh-ux/manager-bm-cluster-components';
import nodes from '../nodes';
import node from '../nodes/node';
import routing from './cluster.routing';
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
    clusterMainPage,
    dashboard,
    editDisplayName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
