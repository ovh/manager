import template from './vrack-add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.add', {
    url: '/new',
    template,
    controller: 'VrackAddCtrl',
    controllerAs: 'VrackAddCtrl',
    translations: {
      value: ['..', '.'],
      format: 'json',
    },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
