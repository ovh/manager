import template from './add.html';
import controller from './add.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.hostedEmail-add', {
    url: '/hostedEmail/add',
    template,
    controller,
    controllerAs: 'ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosted_email_add_an_account'),
    },
  });
};
