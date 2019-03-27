import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import moment from 'moment';

import details from './details';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectBillingHistory';
angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    details,
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.billing.history', {
      url: '/history/:year/:month',
      redirectTo: 'pci.projects.project.legacy.billing.history.details',
      views: {
        cloudProjectBilling: {
          template,
          controller,
          controllerAs: 'BillingHistoryCtrl',
        },
      },
      params: {
        year: {
          value: moment.utc().year(),
          type: 'int',
        },
        month: {
          value: moment.utc().month() + 1, // because moment indexes month from 0 to 11
          type: 'int',
        },
      },
      resolve: {
        validParams: ($stateParams) => {
          let { year, month } = $stateParams;

          const period = moment({
            year,
            month: month - 1, // because moment indexes month from 0 to 11
          });
          if (!period.isValid() || period.isAfter(moment.utc())) {
            year = moment.utc().year();
            month = moment.utc().month() + 1; // because moment indexes month from 0 to 11
          }

          if ($stateParams.year < 1990) {
            year = moment.utc().year();
          }
          if ($stateParams.month < 1 || $stateParams.month > 12) {
            month = moment.utc().month() + 1; // because moment indexes month from 0 to 11
          }

          return {
            year,
            month,
          };
        },
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
