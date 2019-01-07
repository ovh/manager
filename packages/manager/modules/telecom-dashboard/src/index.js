import angular from 'angular';

import '@uirouter/angularjs';
import core from '@ovh-ux/manager-core';
import tuc from '@ovh-ux/telecom-universe-components';

import dashboardCtrl from './telecom-dashboard.controller';
import template from './telecom-dashboard.html';

const moduleName = 'ovhManagerTelecomDashboard';

console.log(tuc, core);

angular
  .module(moduleName, [
    core,
    tuc,
    'ui.router',
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    console.log('config');
    $stateProvider.state('telecom.dashboard', {
      url: '/foo',
      views: {
        '': {
          template,
          controller: dashboardCtrl,
          controllerAs: 'TelecomDashboardCtrl',
        },
        'billsView@telecom.dashboard': {
          templateUrl: 'app/telecom/dashboard/bills/telecom-dashboard-bills.html',
          controller: 'TelecomDashboardBillsCtrl',
          controllerAs: 'BillsCtrl',
          noTranslations: true,
        },
        'guidesView@telecom.dashboard': {
          templateUrl: 'app/telecom/dashboard/guides/telecom-dashboard-guides.html',
          controller: 'TelecomDashboardGuidesCtrl',
          controllerAs: 'GuidesCtrl',
          noTranslations: true,
        },
      },
      translations: ['.'],
      /*
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
      */
    });
  });

export default moduleName;
