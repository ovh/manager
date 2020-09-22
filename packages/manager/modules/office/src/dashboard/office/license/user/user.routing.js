import template from './USER.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.product.user', {
    url: '',
    template,
    controller: 'MicrosoftOfficeLicenseUsersCtrl',
    controllerAs: 'usersCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
