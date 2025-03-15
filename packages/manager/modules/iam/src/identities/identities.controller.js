import { TAG } from '../iam.constants';

export default class IdentitiesController {
  /**
   * Called back when a guide menu item is clicked
   * @param {string} guideKey
   */
  onGuideClick(guideKey) {
    this.trackClick(TAG.GUIDE(guideKey));
  }
}
