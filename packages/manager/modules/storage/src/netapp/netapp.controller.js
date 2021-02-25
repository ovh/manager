import { Environment } from '@ovh-ux/manager-config';

export default class NetappCtrl {
  /* @ngInject */
  constructor(CORE_URLS) {
    this.CORE_URLS = CORE_URLS;
  }

  isStatusIn(sublist) {
    return sublist.includes(this.service.status);
  }

  isRunning() {
    return this.isStatusIn(['running']);
  }

  isWarning() {
    return this.isStatusIn([
      'creating',
      'reopenning',
      'suspending',
      'deleting',
    ]);
  }

  isError() {
    return this.isStatusIn(['suspended', 'deleted']);
  }

  initGuides() {
    const user = Environment.getUser();
    this.guideUrl =
      this.CORE_URLS.guides.home[user.ovhSubsidiary] +
      this.CORE_URLS.guides.cda;
  }

  $onInit() {
    this.initGuides();
  }
}
