import { DEFAULT_FILTER_COLUMN } from './vsphere-user-import.constant';

export default class VSphereUserImportController {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.task = null;

    this.loaders = {
      init: true,
      action: false,
      poll: false,
      cancelModal: false,
    };

    this.model = {
      type: null,
      userExample: { user: null, group: null },
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
    this.model.userExample.user = `${this.$translate.instant(
      'dedicatedCloud_USER_import_user_example',
    )}@${modelValue.domainName}`;
    this.model.userExample.group = `${this.$translate.instant(
      'dedicatedCloud_USER_import_group_example',
    )}@${modelValue.domainName}`;
    this.model.activeDirectoryId = modelValue.activeDirectoryId;
  }

  onImportTypeChange(modelValue) {
    this.model.type = modelValue;
  }

  importUser() {
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
    ).then(
      (data) => {
        this.task = data;
      },
      ({ data: err }) => {
        this.loaders.action = false;
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_import_error')} ${
            err.message
          }`,
          'danger',
        );
      },
    );
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
