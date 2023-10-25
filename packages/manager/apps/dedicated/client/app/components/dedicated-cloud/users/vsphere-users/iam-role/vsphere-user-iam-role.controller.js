import {
  TRACKING_TASK_TAG,
  DEFAULT_FILTER_USERS,
} from './vsphere-user-iam-role.constant';

export default class VSphereUserImportController {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.boundOnCloseClick = this.onCloseClick.bind(this);
  }

  $onInit() {
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;
    this.usersList = [];

    this.task = null;

    this.loaders = {
      init: true,
      action: false,
      poll: false,
    };

    this.namePrefix = 'iam-';

    this.namePattern = /^[^/[:;|=,+*?<>@.]+[^/[:;|=,+*?<>@]*$/.source;

    this.model = {
      name: '',
    };

    const params = {
      offset: null,
      pageSize: null,
      sortOrder: 'ASC',
      filters: [],
    };

    const paramsGetUsers = {
      ...params,
      sort: DEFAULT_FILTER_USERS,
      defaultFilterColumn: DEFAULT_FILTER_USERS,
    };

    return this.$q
      .all({
        users: this.DedicatedCloud.getUserDetails(
          this.productId,
          paramsGetUsers,
        ),
      })
      .then(({ users }) => {
        this.usersList = users.data;
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }

  roleAlreadyExist(input) {
    return this.usersList.find((value) => {
      return value.name === (input ? this.namePrefix + input : null);
    });
  }

  formIsValid() {
    return this.model.name ? this.namePrefix + this.model.name : null;
  }

  addRole() {
    this.loaders.action = true;

    const name = this.model.name ? this.namePrefix + this.model.name : null;

    return this.DedicatedCloud.addIamRole(this.productId, name)
      .then((data) => {
        this.task = data;
        this.loaders.action = false;
      })
      .catch(({ data: err }) => {
        this.loaders.action = false;
        return this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_iam_role_error')} ${
            err.message
          }`,
          'danger',
        );
      });
  }

  onCloseClick() {
    if (this.task) {
      return this.goBack(false, null, true);
    }
    return this.goBack();
  }
}
