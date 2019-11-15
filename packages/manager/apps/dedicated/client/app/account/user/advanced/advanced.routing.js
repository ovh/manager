import includes from 'lodash/includes';

import { BETA_PREFERENCE } from './advanced.constants';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state( 'app.account.user.advanced', {
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
};
