import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import 'ovh-ui-angular';

import VeeamEnterpriseCtrl from './controller';
import VeeamEnterpriseService from './service';
import VeeamEnterpriseDashboardCtrl from './dashboard/controller';
import VeeamEnterpriseLicenseCtrl from './dashboard/license/controller';
import VeeamEnterpriseTerminateCtrl from './dashboard/terminate/controller';

import routing from './routing';

import 'ovh-ui-kit/dist/oui.css';
import './index.less';
import './index.scss';

const moduleName = 'ovhManagerVeeamEnterprise';

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
  .controller('VeeamEnterpriseDashboardCtrl', VeeamEnterpriseDashboardCtrl)
  .controller('VeeamEnterpriseCtrl', VeeamEnterpriseCtrl)
  .controller('VeeamEnterpriseLicenseCtrl', VeeamEnterpriseLicenseCtrl)
  .controller('VeeamEnterpriseTerminateCtrl', VeeamEnterpriseTerminateCtrl)
  .service('VeeamEnterpriseService', VeeamEnterpriseService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
