import { SupportLevel } from '@ovh-ux/manager-models';
import { API_MODEL_SUPPORT_LEVEL } from './support-level/support-level.constants';

import template from './user.html';
import controller from './user.controller';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user';

  $stateProvider.state(name, {
    url: '/useraccount',
    static: true,
    template,
    controller,
    controllerAs: '$ctrl',
    redirectTo: `${name}.dashboard`,
    resolve: {
      angularQr: /* @ngInject */ ($ocLazyLoad) =>
        import('angular-qr').then((module) =>
          $ocLazyLoad.inject(module.default || module),
        ),
      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,
      supportLevel: /* @ngInject */ (OvhApiMe, schema) =>
        schema.models[API_MODEL_SUPPORT_LEVEL]
          ? OvhApiMe.v6()
              .supportLevel()
              .$promise.then((supportLevel) => new SupportLevel(supportLevel))
          : Promise.resolve(null),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account'),
    },
  });
};
