import controller from './delete.controller';
import template from './delete.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.history.delete', {
    url: '/delete?batchId&batchName&serviceName',
    views: {
      modal: {
        // controller,
        // template,
        component: 'telecomSMSBatchesHistoryDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      batchId: /* @ngInject */ ($transition$) =>
        $transition$.params().batchId,
      batchName: /* @ngInject */ ($transition$) =>
        $transition$.params().batchName,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goBack: /* @ngInject */ ($state) => () => {
            console.log('tytyt');
          $state.go(
            '^',
            {},
            { reload: true }
          );
      }
    }
  });
};