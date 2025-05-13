export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.history.delete', {
    url: '/delete?batchId&batchName',
    views: {
      modal: {
        component: 'telecomSmsBatchesHistoryDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      batchId: /* @ngInject */ ($transition$) => $transition$.params().batchId,
      batchName: /* @ngInject */ ($transition$) =>
        $transition$.params().batchName,
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go('^', {}, { reload }),
      onSuccess: /* @ngInject */ ($translate, goBack, TucToast) => () =>
        goBack(true).then(() => {
          TucToast.success(
            $translate.instant(
              'sms_batches_history_delete_confirmation_message',
            ),
          );
        }),
      onFailure: /* @ngInject */ ($translate, goBack, TucToast) => () =>
        goBack(true).then(() => {
          TucToast.error(
            $translate.instant('sms_batches_history_delete_error_message'),
          );
        }),
    },
  });
};
