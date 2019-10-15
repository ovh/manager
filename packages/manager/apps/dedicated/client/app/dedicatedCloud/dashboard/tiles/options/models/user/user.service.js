export const name = 'ovhManagerPccDashboardOptionsUserService';

export const OptionsUserService = class {
  /* @ngInject */
  constructor(
    OvhApiDedicatedCloud,
  ) {
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
  }

  async isThereAtLeastOneTokenValidator(serviceName) {
    const users = await this
      .OvhApiDedicatedCloud
      .User()
      .Iceberg()
      .query()
      .expand('CachedObjectList-Pages')
      .execute({ serviceName }).$promise;

    return !_.isEmpty(
      _.find(
        users,
        { isTokenValidator: true },
      ),
    );
  }
};

export default {
  name,
  OptionsUserService,
};
