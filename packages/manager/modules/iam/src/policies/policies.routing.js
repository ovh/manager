import * as constants from '../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies', {
    url: '/policies',
    component: 'iamPolicies',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policies'),
      policiesGuides: /* @ngInject */ (IAMService) => {
        return IAMService.formatGuides(constants.GUIDE.IAM);
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('features')
        .then((featureAvailabilityResult) =>
          featureAvailabilityResult.isFeatureAvailable(
            constants.FEATURE.POLICIES,
          )
            ? 'iam.policies.myPolicies'
            : { state: constants.UNAVAILABLE_STATE_NAME },
        ),
  });
};
