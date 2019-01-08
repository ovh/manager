import angular from 'angular';
import '@uirouter/angularjs';
import 'ng-at-internet';
import 'at-internet-ui-router-plugin';
import '@ovh-ux/ng-uirouter-title';
import core from '@ovh-ux/manager-core';
import tuc from '@ovh-ux/telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

import './telecom-dashboard.scss';
import './telecom-dashboard.less';

import dashboardCtrl from './telecom-dashboard.controller';
import billsCtrl from './bills/telecom-dashboard-bills.controller';
import guidesCtrl from './guides/telecom-dashboard-guides.controller';

import template from './telecom-dashboard.html';
import billsTemplate from './bills/telecom-dashboard-bills.html';
import guidesTemplate from './guides/telecom-dashboard-guides.html';

const moduleName = 'ovhManagerTelecomDashboard';

angular
  .module(moduleName, [
    core,
    'ng-at-internet',
    'atInternetUiRouterPlugin',
    'ngUirouterTitle',
    tuc,
    'ui.router',
  ])
  .config(/* @ngInject */ ($stateProvider) => {
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
      },
      translations: ['.'],
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
      },
    });
  });

export default moduleName;
