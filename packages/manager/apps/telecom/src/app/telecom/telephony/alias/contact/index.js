import angular from 'angular';
import '@uirouter/angularjs';

import serviceContact from '../../service/contact';

import routing from './contact.routing';

const moduleName = 'ovhManagerTelecomTelephonyAliasContact';

angular.module(moduleName, ['ui.router', serviceContact]).config(routing);

export default moduleName;
