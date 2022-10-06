import {
  FIELD_NAME,
  PLACEHOLDER,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
} from './federation-edit.constant';

export default class ActiveDirectoriesEditController {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.FIELD_NAME = FIELD_NAME;
    this.PLACEHOLDER = PLACEHOLDER;
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;

    this.task = null;

    this.loaders = {
      action: false,
      poll: false,
      cancelModal: false,
    };

    this.model = {
      username: null,
      description: null,
      sslThumbprint: null,
      password: null,
    };
  }

  formIsValid() {
    return (
      this.model.username && this.model.password && this.model.sslThumbprint
    );
  }

  editFederation() {
    this.trackClick(`${TRACKING_PREFIX}::confirm`);
    this.loaders.action = true;

    return this.DedicatedCloud.changePropertiesActiveDirectory(
      this.productId,
      this.activeDirectory.activeDirectoryId,
      this.model,
    )
      .then((data) => {
        this.task = data;
      })
      .catch(({ data: err }) => {
        this.loaders.action = false;
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_AD_edit_error')} ${
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
}
