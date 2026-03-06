import promoteModal from '../../../components/replications-delete-modal';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.replications.delete', {
    url: '/delete',
    views: {
      modal: {
        component: promoteModal,
      },
    },
    layout: 'modal',
    params: {
      replicationID: null,
      status: null,
      sourceShareID: null,
    },
    resolve: {
      params: /* @ngInject */ ($transition$) => $transition$.params(),
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
