import controller from './user-security-2fa.controller';
import template from './user-security-2fa.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.user.security.mfa', {
    url: '/mfa',
    template,
    controller,
    translations: { value: ['../..'], format: 'json' },
    layout: {
      name: 'modal',
      backdrop: 'static',
      keyboard: false,
    },
    toChilds: true,
    resolve: {
      breadcrumb: () => null,
    },
  });
};
