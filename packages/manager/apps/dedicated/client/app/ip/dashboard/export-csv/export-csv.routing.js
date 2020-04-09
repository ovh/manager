import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.export-csv', {
    url: '/export-csv',
    params: {
      ipsList: {
        array: true,
        type: 'json',
        value: [],
      },
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('ipsList')
        .then((ipsList) => (isEmpty(ipsList) ? 'app.ip.dashboard' : null));
    },
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      ipsList: /* @ngInject */ ($transition$) => $transition$.params().ipsList,
    },
    views: {
      modal: {
        component: 'ipDashboardExportCsv',
      },
    },
    layout: 'modal',
  });
};
