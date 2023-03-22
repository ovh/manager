const ENDPOINT = {
  resourceGroup: 'resourceGroup',
};

export default class ResourceGroupService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  /**
   * Get the list of resourceGroups
   * @param {string} cursor The base64 encoded cursor to pass
   * @see Apiv2Service#getList
   * @returns {Promise}
   */
  getResourceGroups({ cursor }) {
    return this.Apiv2Service.getList(ENDPOINT.resourceGroup, { cursor });
  }

  /**
   * Get the resourceGroup given the id
   * @param {string} id The resourceGroup's id
   * @see Apiv2Service#get
   * @returns {Promise}
   */
  getResourceGroup(id) {
    return this.Apiv2Service.get(`${ENDPOINT.resourceGroup}/${id}`).then(
      ({ data }) => data,
    );
  }

  /**
   * Delete the resourceGroup given the id
   * @param {string} id The resourceGroup's id
   * @see Apiv2Service#delete
   * @returns {Promise}
   */
  deleteResourceGroup(id) {
    return this.Apiv2Service.delete(`${ENDPOINT.resourceGroup}/${id}`).then(
      ({ data }) => data,
    );
  }
}
