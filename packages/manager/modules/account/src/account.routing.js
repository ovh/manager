import { User } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  [
    {
      abstract: true,
      name: 'app.account',
      resolve: {
        user: /* @ngInject */ ($q, coreConfig) =>
          $q
            .all({
              me: coreConfig.getUser(),
              certificates: coreConfig.getUser().certificates,
            })
            .then(({ me, certificates }) => new User(me, certificates)),
      },
    },
    {
      abstract: true,
      name: 'app.account.service',
      template: '<ui-view/>',
    },
  ].forEach((state) => $stateProvider.state(state.name, state));
};
