import { TRACKING_NAME } from './carbon-footprint/constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/dashboard/',
    component: 'carbonCalculatorDashboard',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state) => $state.href('app.dashboard'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('carbon_calculator_my_carbon_footprint'),
    },
    atInternet: {
      rename: TRACKING_NAME,
    },
  });
};
