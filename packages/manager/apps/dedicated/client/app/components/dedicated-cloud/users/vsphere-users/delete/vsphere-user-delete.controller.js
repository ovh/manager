import { TRACKING_TASK_TAG } from './vsphere-user-delete.constant';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.boundOnCloseClick = this.onCloseClick.bind(this);
  }

  $onInit() {
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;
    this.task = null;

    this.loaders = {
      init: false,
      action: false,
      poll: false,
    };
  }

  deleteUser() {
    this.loaders.action = true;
    return this.DedicatedCloud.deleteUser(this.productId, this.user.userId)
      .then((data) => {
        this.task = data;
      })
      .catch(({ data: err }) => {
        return this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_delete_fail', {
            t0: `<b>${this.user.name}</b>`,
          })} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loaders.action = false;
      });
  }

  onCloseClick() {
    if (this.task) {
      return this.goBack(false, null, true);
    }
    return this.goBack();
  }
}
