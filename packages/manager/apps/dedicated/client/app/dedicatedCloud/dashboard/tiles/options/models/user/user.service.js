import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export const name = 'ovhManagerPccDashboardOptionsUserService';

export const OptionsUserService = class {
  /* @ngInject */
  constructor(OvhApiDedicatedCloud) {
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
  }

  async isThereAtLeastOneTokenValidator(serviceName) {
    const users = await this.OvhApiDedicatedCloud.User()
      .Iceberg()
      .query()
      .expand('CachedObjectList-Pages')
      .execute({ serviceName }).$promise;

    return !isEmpty(find(users, { isTokenValidator: true }));
  }
};

export default {
  name,
  OptionsUserService,
};
