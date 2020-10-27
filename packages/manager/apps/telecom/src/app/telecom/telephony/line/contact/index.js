import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceContact from '../../service/contact';

import routing from './contact.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineContact';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceContact,
  ])
  .config(routing);

export default moduleName;
