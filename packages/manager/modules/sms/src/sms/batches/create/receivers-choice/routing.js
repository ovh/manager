import component from '../../../components/receivers-choice/receivers-choice.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.create.receivers-choice', {
    url: '/receivers-choice',
    params: {
      model: {},
    },
    resolve: {
      model: /* @ngInject */ ($transition$) => $transition$.params().model,
    },
    views: {
      modal: {
        component: component.name,
      },
    },
    layout: 'modal',
  });
};
