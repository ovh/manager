import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

const moduleName = 'ovhManagerPccDashboardOptionsUserService';
export const name = 'ovhManagerPccDashboardOptionsUserService';

const OptionsUserService = class {
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

angular.module(moduleName, []).service(name, OptionsUserService);
export default moduleName;
