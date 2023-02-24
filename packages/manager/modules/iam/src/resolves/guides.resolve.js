import { GUIDE } from '@iam/constants';

// ---------------------------------------------------------------------------------------------------- //

/**
 * The on boarding guides
 * @returns {Object}
 */
export const onboardingGuidesResolve = /* @ngInject */ (GuideService) =>
  GuideService.formatGuides(GUIDE.IAM, GUIDE.USERS, GUIDE.SAMLSSO);

onboardingGuidesResolve.key = 'onboardingGuides';

// ---------------------------------------------------------------------------------------------------- //

export default {
  onboardingGuidesResolve,
};
