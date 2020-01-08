import controller from './history.controller';
import template from './history.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.history', {
    url: '/history/:year/:month',
    template,
    controller,
    controllerAs: '$ctrl',
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cpbc_tab_history'),
    },
  });
};
