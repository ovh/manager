import promoteModal from '../../../components/replications-promote-modal';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.replications.promote', {
    url: '/promote',
    views: {
      modal: {
        component: promoteModal,
      },
    },
    layout: 'modal',
    params: {
      replicationID: null,
      sourceShareID: null,
    },
    resolve: {
      params: /* @ngInject */ ($transition$) => $transition$.params(),
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
