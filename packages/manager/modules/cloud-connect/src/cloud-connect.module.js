import angular from 'angular';

import '@ovh-ux/manager-core';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-cloud-universe-components';

import '@ovh-ux/ui-kit';

import '@ovh-ux/ui-kit/dist/css/oui.css';

import './style.scss';

import component from './cloud-connect.component';
import details from './details';
import routing from './cloud-connect.routing';
import service from './cloud-connect.service';

const moduleName = 'ovhCloudConnect';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    details,
  ])
  .config(routing)
  .component('cloudConnect', component)
  .service('cloudConnectService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
