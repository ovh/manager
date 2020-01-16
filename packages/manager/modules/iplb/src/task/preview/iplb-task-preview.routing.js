export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.task.preview', {
    url: '/preview',
    params: {
      task: null,
    },
    views: {
      modal: {
        component: 'iplbTaskPreview',
      },
    },
    layout: 'modal',
    resolve: {
      task: /* @ngInject */ ($transition$) => $transition$.params().task,
    },
  });
};
