import controller from './user-security.controller';
import template from './user-security.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'account.user.security';

  $stateProvider.state(name, {
    url: '/security',
    template,
    controller,
    translations: ['../'],
    resolve: {
      angularQr: /* @ngInject */ ($ocLazyLoad) =>
        import('angular-qr').then((module) =>
          $ocLazyLoad.inject(module.default || module),
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_security'),
    },
  });
};
