import { TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.api-keys.onboarding', {
    url: '/onboarding',
    component: 'iamApiKeysOnboarding',
    // TODO : uncomment after testing
    // redirectTo: (transition) =>
    //   transition
    //     .injector()
    //     .getAsync('apiKeys')
    //     .then((apiKeys) =>
    //       apiKeys ? { state: 'iam.api-keys' } : false,
    //     ),
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: TAG.ONBOARDING,
    },
  });
};
