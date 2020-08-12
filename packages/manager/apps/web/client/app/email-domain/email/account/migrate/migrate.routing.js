import template from './email-domain-email-account-migrate.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.migrate', {
    url: '/migrate',
    template,
    controller: 'EmailsMigrateAccountCtrl',
    controllerAs: 'ctrl',
    params: {
      email: {},
    },
  });
};
