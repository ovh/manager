import includes from 'lodash/includes';

import { BETA_PREFERENCE } from './advanced.constants';

export default /* @ngInject */($stateProvider, coreConfigProvider) => {
  const name = 'app.account.user.advanced';

  if (includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
    $stateProvider.state(name, {
      url: '/advanced',
      component: 'accountUserAdvanced',
      translations: ['../'],
      resolve: {
        betaFlag: /* @ngInject */ ovhUserPref => ovhUserPref
          .getValue(BETA_PREFERENCE)
          .then(() => true)
          .catch(() => false),
        updateBeta: /* @ngInject */ ovhUserPref => beta => ovhUserPref
          .assign(BETA_PREFERENCE, beta),
      },
    });
  }
};
