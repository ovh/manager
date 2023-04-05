const ENDPOINT = {
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
   * Get the list of resource types
   * @see Apiv2Service#get
   * @returns {Promise}
   */
  getResourceTypes() {
    return this.Apiv2Service.get(
      ENDPOINT.resourceType,
    ).then(({ data: resourceTypes }) => resourceTypes.sort());
  }
}
