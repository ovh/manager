import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import nodes from '../nodes';
import node from '../nodes/node';
import routing from './cluster.routing';

const moduleName = 'ovhManagerDedicatedServerClusterDetail';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    nodes,
    node,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
