import { TAG, CHANGELOG } from '../iam.constants';

export default class DashboardController {
  constructor() {
    this.CHANGELOG = CHANGELOG;
  }

  /**
   * Called back when a guide menu item is clicked
   * @param {string} guideKey
   */
  onGuideClick(guideKey) {
    this.trackClick(TAG.GUIDE(guideKey));
  }
}
