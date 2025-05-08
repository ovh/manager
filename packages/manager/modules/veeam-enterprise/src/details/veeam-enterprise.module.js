import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-layout';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import VeeamEnterpriseCtrl from './controller';
import VeeamEnterpriseService from './service';
import VeeamEnterpriseDashboardComponent from '../dashboard/component';
import VeeamEnterpriseLicenseComponent from '../dashboard/license/license.component';

import routing from './routing';

import './index.less';
import './index.scss';

const moduleName = 'ovhManagerVeeamEnterpriseDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhCloudUniverseComponents',
    'ngUiRouterLayout',
    'ui.bootstrap',
    'ovh-api-services',
    'oui',
  ])
  .config(routing)
  .controller('VeeamEnterpriseCtrl', VeeamEnterpriseCtrl)
  .component('veeamEnterpriseDashboard', VeeamEnterpriseDashboardComponent)
  .component('veeamEnterpriseLicense', VeeamEnterpriseLicenseComponent)
  .service('VeeamEnterpriseService', VeeamEnterpriseService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
