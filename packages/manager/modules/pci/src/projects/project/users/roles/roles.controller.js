import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import some from 'lodash/some';

export default class CloudProjectUsersCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectUserRole) {
    this.$translate = $translate;
    this.OvhApiCloudProjectUserRole = OvhApiCloudProjectUserRole;
  }

  $onInit() {
    this.model = reduce(
      this.rolesList,
      (model, { id }) => ({
        ...model,
        [id]: some(this.userRoles, { id }),
      }),
      {},
    );
  }

  submit() {
    this.isLoading = true;
    return this.confirmRoles(keys(pickBy(this.model, (value) => value)));
  }
}
