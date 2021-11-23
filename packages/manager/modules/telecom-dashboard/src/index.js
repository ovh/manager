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

import IdentityCheckForm from './identity-check/form';

import dashboardCtrl from './telecom-dashboard.controller';
import billsCtrl from './bills/telecom-dashboard-bills.controller';
import guidesCtrl from './guides/telecom-dashboard-guides.controller';
import IdentityCheckMessageCtrl from './identity-check/message/telecom-dashboard-identity-check-message.controller';

import template from './telecom-dashboard.html';
import billsTemplate from './bills/telecom-dashboard-bills.html';
import guidesTemplate from './guides/telecom-dashboard-guides.html';
import identityCheckMessageTemplate from './identity-check/message/telecom-dashboard-identity-check-message.html';

import billsService from './bills/telecom-dashboard-bills.service';
import identityCheckService from './identity-check/telecom-dashboard-identity-check.service';

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
              level2: 'Telecom',
              chapter1: 'telecom',
            });
          },
          hideBreadcrumb: () => true,
        },
      });
    },
  )
  .service('BillsService', billsService)
  .service('IdentityCheckService', identityCheckService);

export default moduleName;
