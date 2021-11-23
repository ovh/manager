import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-title';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/ng-ui-router-breadcrumb';
import 'angular-translate';
import 'angular-ui-validate';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

import '../../telecom-dashboard.scss';
import '../../telecom-dashboard.less';

import IdentityCheckService from '../telecom-dashboard-identity-check.service';
import IdentityCheckFormCtrl from './telecom-dashboard-identity-check-form.controller';
import identityCheckFormTemplate from './telecom-dashboard-identity-check-form.html';

const moduleName = 'ovhManagerTelecomDashboardIdentityCheckForm';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ngUiRouterTitle',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ngOvhTelecomUniverseComponents',
    'ui.router',
    'ui.validate',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('identity-check', {
        url: '/identity-check',
        views: {
          '': {
            template: identityCheckFormTemplate,
            controller: IdentityCheckFormCtrl,
            controllerAs: 'IdentityCheckFormCtrl',
          },
        },
        translations: {
          value: ['../../'],
          format: 'json',
        },
        resolve: {
          $title(translations, $translate) {
            return $translate('telecom_dashboard_identityCheck_form_title');
          },
          hideBreadcrumb: () => true,
        },
      });
    },
  )
  .service('IdentityCheckService', IdentityCheckService);

export default moduleName;
