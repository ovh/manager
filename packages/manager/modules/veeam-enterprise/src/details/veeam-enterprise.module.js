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
import VeeamEnterpriseDashboardCtrl from '../dashboard/controller';
import VeeamEnterpriseLicenseComponent from '../dashboard/license/license.component';
import VeeamEnterpriseLicenseTerminateComponent from '../dashboard/terminate/terminate.component';

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
  .controller('VeeamEnterpriseDashboardCtrl', VeeamEnterpriseDashboardCtrl)
  .controller('VeeamEnterpriseCtrl', VeeamEnterpriseCtrl)
  .component('veeamEnterpriseLicense', VeeamEnterpriseLicenseComponent)
  .component(
    'veeamEnterpriseLicenseTerminate',
    VeeamEnterpriseLicenseTerminateComponent,
  )
  .service('VeeamEnterpriseService', VeeamEnterpriseService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
