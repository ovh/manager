import angular from 'angular';
import '@uirouter/angularjs';

import serviceContact from '../../service/contact';

import routing from './contact.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxContact';

angular
  .module(moduleName, ['ovh-api-services', 'ui.router', serviceContact])
  .config(routing);

export default moduleName;
