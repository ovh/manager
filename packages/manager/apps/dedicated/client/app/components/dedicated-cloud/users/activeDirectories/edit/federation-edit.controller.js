import { FIELD_NAME, PLACEHOLDER } from './federation-edit.constant';

export default class ActiveDirectoriesEditController {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.FIELD_NAME = FIELD_NAME;
    this.PLACEHOLDER = PLACEHOLDER;

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
    return this.model.username && this.model.password;
  }

  editFederation() {
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
    if (this.task.state === 'done') {
      this.loaders.cancelModal = true;
      this.goBack(false, null, true);
    } else {
      this.goBack();
    }
  }
}
