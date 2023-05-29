import { GUIDE } from '../constants';

// ---------------------------------------------------------------------------------------------------- //

/**
 * The on boarding guides
 * @returns {Object}
 */
const onboardingGuidesResolve = /* @ngInject */ (GuideService) =>
  GuideService.formatGuides(GUIDE.IAM, GUIDE.USERS, GUIDE.SAMLSSO);

onboardingGuidesResolve.key = 'onboardingGuides';

// ---------------------------------------------------------------------------------------------------- //

export { onboardingGuidesResolve }; // eslint-disable-line
