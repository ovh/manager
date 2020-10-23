import controller from './add.controller';
import template from './add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.emailPro-add', {
    url: '/xdsl-email/add',
    template,
    controller,
    controllerAs: '$ctrl',
  });
};
