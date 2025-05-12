import * as constants from '../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities', {
    url: '/identities',
    component: 'iamIdentities',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_identities'),
      identitiesGuides: /* @ngInject */ (IAMService) => {
        return IAMService.formatGuides(
          constants.GUIDE.USERS,
          constants.GUIDE.SAMLSSO,
        );
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('features')
        .then((featureAvailabilityResult) =>
          featureAvailabilityResult.isFeatureAvailable(
            constants.FEATURE.IDENTITIES,
          )
            ? 'iam.identities.users'
            : { state: constants.UNAVAILABLE_STATE_NAME },
        ),
  });
};
