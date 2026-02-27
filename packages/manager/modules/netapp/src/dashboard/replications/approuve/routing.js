import approuveModal from '../../../components/replications-approuve-modal';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.replications.approuve', {
    url: '/approuve',
    views: {
      modal: {
        component: approuveModal,
      },
    },
    layout: 'modal',
    params: {
      destinationServiceID: null,
      replicationID: null,
      sourceShareID: null,
    },
    resolve: {
      params: /* @ngInject */ ($transition$) => $transition$.params(),
      // destinationServiceID: /* @ngInject */ ($transition$) =>
      //   $transition$.params().destinationServiceID,
      // replicationID: /* @ngInject */ ($transition$) =>
      //   $transition$.params().replicationID,
      // sourceShareID: /* @ngInject */ ($transition$) =>
      //   $transition$.params().sourceShareID,
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
