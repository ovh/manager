import { TAG } from '../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.onboarding', {
    url: '/onboarding',
    component: 'iamOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('hasPolicies')
        .then((hasPolicies) =>
          hasPolicies ? { state: 'iam.dashboard' } : false,
        ),
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: TAG.ONBOARDING,
    },
  });
};
