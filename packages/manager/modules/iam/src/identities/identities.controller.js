import { TAG, CHANGELOG } from '../iam.constants';

export default class IdentitiesController {
  /* @ngInject */
  constructor(coreURLBuilder) {
    this.CHANGELOG = CHANGELOG;
    this.serviceAccountsHref = coreURLBuilder.buildURL(
      'identity-access-management',
      '#/service-accounts',
      {},
    );
  }

  /**
   * Called back when a guide menu item is clicked
   * @param {string} guideKey
   */
  onGuideClick(guideKey) {
    this.trackClick(TAG.GUIDE(guideKey));
  }
}
