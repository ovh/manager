import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';
import '@ovh-ux/ng-ui-router-title';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';
import 'angular-translate';
import '@ovh-ux/manager-banner';
import 'ovh-api-services';
import '@ovh-ux/ng-ui-router-breadcrumb';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

import './telecom-dashboard.scss';
import './telecom-dashboard.less';

import billsCtrl from './bills/telecom-dashboard-bills.controller';
import billsTemplate from './bills/telecom-dashboard-bills.html';
import billsService from './bills/telecom-dashboard-bills.service';

import dashboardCtrl from './telecom-dashboard.controller';
import template from './telecom-dashboard.html';

import guidesCtrl from './guides/telecom-dashboard-guides.controller';
import guidesTemplate from './guides/telecom-dashboard-guides.html';

import IdentityCheckMessageCtrl from './identity-check/message/telecom-dashboard-identity-check-message.controller';
import identityCheckMessageTemplate from './identity-check/message/telecom-dashboard-identity-check-message.html';

import IdentityCheckForm from './identity-check/form';

import identityCheckService from './identity-check/telecom-dashboard-identity-check.service';

import ftthEligibilityCtrl from './ftth-eligibility/telecom-dashboard-ftth-eligibility.controller';
import ftthEligibilityTemplate from './ftth-eligibility/telecom-dashboard-ftth-eligibility.html';
import ftthEligibilityService from './ftth-eligibility/telecom-dashboard-ftth-eligibility.service';

const moduleName = 'ovhManagerTelecomDashboard';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    'ngUiRouterBreadcrumb',
    'ngUiRouterTitle',
    'ovh-api-services',
    'ovhManagerBanner',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ngOvhTelecomUniverseComponents',
    'ui.router',
    IdentityCheckForm,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('telecom-dashboard', {
        url: '/',
        views: {
          '': {
            template,
            controller: dashboardCtrl,
            controllerAs: 'TelecomDashboardCtrl',
          },
          'billsView@telecom-dashboard': {
            template: billsTemplate,
            controller: billsCtrl,
            controllerAs: 'BillsCtrl',
          },
          'guidesView@telecom-dashboard': {
            template: guidesTemplate,
            controller: guidesCtrl,
            controllerAs: 'GuidesCtrl',
          },
          'identityCheckView@telecom-dashboard': {
            template: identityCheckMessageTemplate,
            controller: IdentityCheckMessageCtrl,
            controllerAs: 'IdentityCheckMessageCtrl',
          },
          'ftthEligibilityView@telecom-dashboard': {
            template: ftthEligibilityTemplate,
            controller: ftthEligibilityCtrl,
            controllerAs: 'FtthEligibilityCtrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
        resolve: {
          $title(translations, $translate) {
            return $translate('telecom_dashboard_page_title');
          },
          tracking(atInternet) {
            atInternet.trackPage({
              name: 'dashboard',
              type: 'navigation',
              level2: '87',
              chapter1: 'telecom',
            });
          },
          hideBreadcrumb: () => true,
        },
      });
    },
  )
  .service('BillsService', billsService)
  .service('IdentityCheckService', identityCheckService)
  .service('FtthEligibilityService', ftthEligibilityService);

export default moduleName;
