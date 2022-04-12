import template from './template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard', {
    url: '/:nashaId',
    redirectTo: 'nasha.dashboard.nasha-partitions',
    template,
    controller: 'NashaCtrl',
    controllerAs: 'NashaCtrl',
    translations: {
      value: ['../common'],
      format: 'json',
    },
    resolve: {
      nashaId: /* @ngInject */ ($transition$) => $transition$.params().nashaId,
      breadcrumb: /* @ngInject */ (nashaId) => nashaId,
    },
  });
};
