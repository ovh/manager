import angular from 'angular';
import '@uirouter/angularjs';
import { serverDisplayName } from '@ovh-ux/manager-bm-server-components';

import routing from './display-name.routing';

const moduleName = 'ovhManagerDedicatedServerDisplayName';

angular
  .module(moduleName, ['ui.router', serverDisplayName])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
