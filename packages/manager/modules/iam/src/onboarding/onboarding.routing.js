import { TAG } from '../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.onboarding', {
    url: '/onboarding',
    component: 'iamOnboarding',
    // TODO: commented for now, remove when working on policies pages MANAGER-16217
    // redirectTo: (transition) =>
    //   transition
    //     .injector()
    //     .getAsync('hasPolicies')
    //     .then((hasPolicies) =>
    //       hasPolicies ? { state: 'iam.dashboard' } : false,
    //     ),
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: TAG.ONBOARDING,
    },
  });
};
