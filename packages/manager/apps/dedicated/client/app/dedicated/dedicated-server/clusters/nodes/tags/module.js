import angular from 'angular';
import '@uirouter/angularjs';

import { serverTags } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';
import assignTags from './assignTags';
import unassignTags from './unassignTags';

const moduleName = 'ovhManagerDedicatedClusterNodeTags';

angular
  .module(moduleName, ['ui.router', serverTags, assignTags, unassignTags])
  .config(routing)
  .component('dedicatedClusterNodeTags', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
