const ENDPOINT = {
  action: 'reference/action',
  resourceType: 'reference/resource/type',
};

export default class ReferenceService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;

    /**
     * The resource types api url
     * @type {string}
     */
    this.resourceTypesUrl = Apiv2Service.getUrl(ENDPOINT.resourceType);
  }

  /**
   * Get the list of actions given the types
   * @param {string[]?} types
   * @returns {Promise}
   */
  getActions(types) {
    const params = {
      ...(types && { resourceType: types }),
    };
    return this.Apiv2Service.get(ENDPOINT.action, { params }).then(
      ({ data: actions }) => actions,
    );
  }

  /**
   * Get the list of resource types
   * @returns {Promise}
   */
  getResourceTypes() {
    return this.Apiv2Service.get(
      ENDPOINT.resourceType,
    ).then(({ data: resourceTypes }) => resourceTypes.sort());
  }
}
