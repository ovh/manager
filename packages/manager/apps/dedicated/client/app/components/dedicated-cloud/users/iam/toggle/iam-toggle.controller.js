import { TRACKING_TASK_TAG } from './iam-toggle.constant';

export default class IamEnableCtrl {
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
      action: false,
      init: true,
    };

    return this.DedicatedCloud.isIamTogglable(
      this.productId,
      this.iamToggleState === 'enable' ? 'disabled' : 'enabled',
    )
      .then((isIamTogglable) => {
        this.iamTogglable = isIamTogglable;
      })
      .catch((error) => {
        this.iamTogglable = false;
        this.iamTogglableError = error.data?.message;
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }

  toggleIam() {
    this.loaders.action = true;

    return this.DedicatedCloud[`${this.iamToggleState}Iam`](this.productId)
      .then((data) => {
        this.task = data;
        this.loaders.action = false;
      })
      .catch(({ data: err }) => {
        this.loaders.action = false;
        const translationMessage = this.$translate.instant(
          `dedicatedCloud_USER_iam_${this.iamToggleState}_error`,
        );
        this.goBack(`${translationMessage} ${err.message}`, 'danger');
      });
  }

  onCloseClick() {
    if (this.task) {
      return this.goBack(false, null, true);
    }
    return this.goBack();
  }
}
