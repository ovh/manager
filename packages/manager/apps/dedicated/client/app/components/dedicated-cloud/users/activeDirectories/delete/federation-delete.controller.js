import {
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
} from './federation-delete.constant';

export default class ActiveDirectoriesDeleteController {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.dedicatedCloud = DedicatedCloud;
    this.boundClose = this.close.bind(this);
    this.boundOnGoBackClick = this.onGoBackClick.bind(this);
  }

  $onInit() {
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;

    this.task = null;

    this.loaders = {
      action: false,
      cancelModal: false,
      init: true,
    };

    return this.dedicatedCloud
      .getUsers(this.productId, {
        filters: [
          {
            comparator: 'is',
            field: 'activeDirectoryId',
            reference: [this.activeDirectory.activeDirectoryId],
          },
        ],
      })
      .then(({ meta }) => {
        this.userCount = meta.totalCount;
        this.loaders.init = false;
        return this.userCount;
      });
  }

  deleteFederation() {
    this.trackClick(`${TRACKING_PREFIX}::confirm`);
    this.loaders.action = true;

    return this.dedicatedCloud
      .deleteActiveDirectory(
        this.productId,
        this.activeDirectory.activeDirectoryId,
      )
      .then((data) => {
        this.task = data;
      })
      .catch(({ data: err }) => {
        this.loaders.action = false;
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_AD_delete_error')} ${
            err.message
          }`,
          'danger',
        );
      });
  }

  close() {
    this.trackClick(`${TRACKING_PREFIX}::done`);
    if (this.task.state === 'done') {
      this.loaders.cancelModal = true;
      return this.goBack(false, null, true);
    }
    return this.goBack();
  }

  onGoBackClick() {
    this.trackClick(`${TRACKING_PREFIX}::cancel`);
    return this.goBack();
  }
}
