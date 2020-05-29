import { PartnerLevel } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.support-level';

  $stateProvider.state(name, {
    url: '/support/level',
    component: 'accountUserSupportLevel',
    translations: {
      format: 'json',
      value: ['./'],
    },
    resolve: {
      partnerLevel: /* @ngInject */ ($http) =>
        $http
          .get('/me/partnerLevel')
          .then(({ data: partnerLevel }) => new PartnerLevel(partnerLevel)),
    },
  });
};
