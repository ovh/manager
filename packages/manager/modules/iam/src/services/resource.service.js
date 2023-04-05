const ENDPOINT = {
  resource: 'resource',
  resourceGroup: 'resourceGroup',
};

export default class ResourceService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;

    /**
     * The resources api url
     * @type {string}
     */
    this.resourcesUrl = Apiv2Service.getUrl(ENDPOINT.resource);

    /**
     * The resource groups api url
     * @type {string}
     */
    this.resourceGroupsUrl = Apiv2Service.getUrl(ENDPOINT.resourceGroup);
  }

  /**
   * Get the list of resource groups
   * @returns {Promise}
   */
  getResourceGroups() {
    return this.Apiv2Service.get(ENDPOINT.resourceGroup).then(
      ({ data: resourceGroups }) => resourceGroups,
    );
  }

  /**
   * Get the list of resource given the types
   * @param {string?} cursor
   * @param {string[]?} types
   * @see {Apiv2Service#getList}
   * @returns {Promise}
   */
  getResources({ cursor, types } = {}) {
    const options = {
      cursor,
      params: {
        ...(types && { resourceType: types }),
      },
    };
    return this.Apiv2Service.getList(ENDPOINT.resource, options);
  }
}
