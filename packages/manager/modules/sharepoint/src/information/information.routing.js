import template from './INFORMATION.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sharepoint.product.information', {
    url: '',
    template,
    controller: 'SharepointInformationsCtrl',
    controllerAs: 'informationsCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
