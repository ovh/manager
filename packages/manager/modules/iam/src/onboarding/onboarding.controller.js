import { TAG } from '../iam.constants';

export default class OnboardingController {
  /**
   * Called back when a guide menu item is clicked
   * @param {string} guideKey
   */
  onGuideClick(guideKey) {
    this.trackClick(TAG.ONBOARDING__DOCUMENTATION(guideKey));
  }
}
