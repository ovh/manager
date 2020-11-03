import controller from './user-security.controller';
import template from './user-security.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.security';

  $stateProvider.state(name, {
    url: '/security',
    template,
    controller,
    controllerAs: 'doubleAuth',
    translations: ['../'],
  });
};
