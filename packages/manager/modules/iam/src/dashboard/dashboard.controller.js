import { TAG } from '../iam.constants';

export default class DashboardController {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  /**
   * Called back when a guide menu item is clicked
   * @param {string} guideKey
   */
  onGuideClick(guideKey) {
    if (this.$state.current.name.includes('policies')) {
      this.trackClick(TAG.POLICIES__GUIDE(guideKey));
    } else if (this.$state.current.name.includes('resourceGroups')) {
      this.trackClick(TAG.RESOURCE_GROUPS__GUIDE(guideKey));
    }
  }
}
