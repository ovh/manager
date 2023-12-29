import angular from 'angular';
import '@uirouter/angularjs';

import routing from './secondary-dns-add.routing';

const moduleName = 'ovhManagerDedicatedServerSecondaryDnsAdd';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
