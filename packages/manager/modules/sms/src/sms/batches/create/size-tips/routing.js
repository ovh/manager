import component from '../../../components/sms-tips/size/sms-tips-size.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.create.size-tips', {
    url: '/size-tips',
    resolve: {
      close: /* @ngInject */ (goBack) => goBack,
    },
    views: {
      modal: {
        component: component.name,
      },
    },
    layout: 'modal',
  });
};
