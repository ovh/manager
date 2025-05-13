import get from 'lodash/get';

import { PartnerLevel } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.support-level';

  $stateProvider.state(name, {
    url: '/support/level',
    component: 'accountUserSupportLevel',
    resolve: {
      partnerLevel: /* @ngInject */ ($http) =>
        $http
          .get('/me/partnerLevel')
          .then(({ data: partnerLevel }) => new PartnerLevel(partnerLevel)),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_support_level_section_title'),
      supportAvailability: /* @ngInject */ (ovhFeatureFlipping, schema) => {
        const supportLevelsEnum = get(
          schema.models,
          'me.SupportLevel.LevelTypeEnum',
        ).enum;
        return ovhFeatureFlipping.checkFeatureAvailability(
          supportLevelsEnum
            .map((supportLevel) => `support:${supportLevel}`)
            .join(','),
        );
      },
    },
  });
};
