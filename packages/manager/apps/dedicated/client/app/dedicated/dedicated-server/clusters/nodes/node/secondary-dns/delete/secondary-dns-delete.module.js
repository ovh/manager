import angular from 'angular';
import '@uirouter/angularjs';

import routing from './secondary-dns-delete.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeSecondaryDnsDelete';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
