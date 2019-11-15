import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './component';
import routing from './routing';
import service from './service';

import './index.less';

import 'ovh-ui-kit/dist/oui.css';

const moduleName = 'ovhManagerVeeamCloudConnect';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhCloudUniverseComponents',
    'ui.bootstrap',
    'ovh-api-services',
    'oui',
  ])
  .config(routing)
  .component('ovhManagerVeeamCloudConnectComponent', component)
  .service('VeeamCloudConnectService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
