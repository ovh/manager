angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing.history', {
    url: '/history/:year/:month',
    redirectTo: 'iaas.pci-project.billing.history.details',
    views: {
      cloudProjectBilling: {
        templateUrl:
          'app/cloud/project/billing/history/cloud-project-billing-history.html',
        controller: 'CloudProjectBillingHistoryCtrl',
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
    translations: {
      value: ['.', '../../../components/project/billing'],
      format: 'json',
    },
  });
});
