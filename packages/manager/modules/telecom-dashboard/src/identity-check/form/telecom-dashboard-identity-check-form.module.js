import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-title';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';
import 'angular-translate';
import 'angular-ui-validate';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

import '../../telecom-dashboard.scss';
import '../../telecom-dashboard.less';

import component from './telecom-dashboard-identity-check-form.component';
import routing from './telecom-dashboard-identity-check-form.routing';
import service from '../telecom-dashboard-identity-check.service';

const moduleName = 'ovhManagerTelecomDashboardIdentityCheckForm';

angular
  .module(moduleName, [
    'ngUiRouterTitle',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ngOvhTelecomUniverseComponents',
    'ui.router',
    'ui.validate',
  ])
  .config(routing)
  .component('identityCheckForm', component)
  .service('IdentityCheckService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
