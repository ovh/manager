import {
  DEFAULT_FILTER_COLUMN,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
} from './vsphere-user-import.constant';

export default class VSphereUserImportController {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.boundOnCloseClick = this.onCloseClick.bind(this);
    this.boundOnCancelClick = this.onCancelClick.bind(this);
  }

  $onInit() {
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;

    this.task = null;

    this.loaders = {
      init: true,
      action: false,
      poll: false,
      cancelModal: false,
    };

    this.userNamePattern = null;

    this.model = {
      type: null,
      userExample: null,
      groupName: null,
      userName: null,
      domainName: null,
      activeDirectoryId: null,
    };

    const params = {
      offset: null,
      pageSize: null,
      sort: DEFAULT_FILTER_COLUMN,
      sortOrder: 'ASC',
      filters: [],
      defaultFilterColumn: DEFAULT_FILTER_COLUMN,
    };

    return this.DedicatedCloud.getActiveDirectories(this.productId, params)
      .then(({ data: federation }) => {
        this.federationList = federation;
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }

  formIsValid() {
    return (
      this.model.type &&
      (this.model.userName || this.model.groupName) &&
      this.model.activeDirectoryId
    );
  }

  onFederationChange(modelValue) {
    this.userNamePattern = /^\w+(@modelValue.domainName)*$/.source.replace(
      'modelValue.domainName',
      modelValue.domainName,
    );
    this.model.userExample = `${this.$translate.instant(
      'dedicatedCloud_USER_import_user_example',
    )}@${modelValue.domainName}`;
    this.model.activeDirectoryId = modelValue.activeDirectoryId;
  }

  onImportTypeChange(modelValue) {
    this.model.type = modelValue;
  }

  importUser() {
    this.trackClick(`${TRACKING_PREFIX}::confirm`);
    this.loaders.action = true;

    const params =
      this.model.type === 'User'
        ? { username: this.model.userName }
        : { groupName: this.model.groupName };

    return this.DedicatedCloud.grantActiveDirectory(
      this.productId,
      this.model.activeDirectoryId,
      params,
      this.model.type,
    )
      .then((data) => {
        this.task = data;
      })
      .catch(({ data: err }) => {
        this.loaders.action = false;
        return this.goBackWithTrackingPage({
          message: `${this.$translate.instant(
            'dedicatedCloud_USER_import_error',
          )} ${err.message || err}`,
          type: 'danger',
          trackingTag: `${TRACKING_PREFIX}-error`,
        });
      });
  }

  onCloseClick() {
    this.trackClick(`${TRACKING_PREFIX}::done`);
    if (this.task.state === 'done') {
      this.loaders.cancelModal = true;
      return this.goBack(false, null, true);
    }
    return this.goBack();
  }

  onCancelClick() {
    this.trackClick(`${TRACKING_PREFIX}::cancel`);
    return this.goBack();
  }
}
