import { SupportLevel } from '@ovh-ux/manager-models';
import { API_MODEL_SUPPORT_LEVEL } from './support-level/support-level.constants';

import template from './user.html';
import controller from './user.controller';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user';

  $stateProvider.state(name, {
    url: '/useraccount',
    template,
    controller,
    controllerAs: '$ctrl',
    translations: {
      value: ['.'],
      format: 'json',
    },
    redirectTo: `${name}.dashboard`,
    resolve: {
      currentUser: /* @ngInject */ (UserAccountService) =>
        UserAccountService.getUser(),
      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,
      angularQr: /* @ngInject */ ($ocLazyLoad) =>
        import('angular-qr').then((module) =>
          $ocLazyLoad.inject(module.default || module),
        ),
      supportLevel: /* @ngInject */ (OvhApiMe, schema) =>
        schema.models[API_MODEL_SUPPORT_LEVEL]
          ? OvhApiMe.v6()
              .supportLevel()
              .$promise.then((supportLevel) => new SupportLevel(supportLevel))
          : Promise.resolve(null),
    },
  });
};
