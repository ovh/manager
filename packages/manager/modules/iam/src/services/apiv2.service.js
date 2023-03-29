export default class Apiv2Service {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  /**
   * Call the given endpoint on the API v2
   * @param {'get' | 'post' | 'put' | 'delete'} method
   * @param {string} endpoint
   * @param {object=} options the $http options
   * @returns {Promise}
   */
  http(method, endpoint, options) {
    return this.$http({
      ...options,
      method,
      url: `/engine/api/v2/iam/${endpoint}`,
      serviceType: 'apiv2',
    });
  }

  /**
   * Call the given endpoint on the API v2 using the 'get' method
   * @param {string} endpoint
   * @param {object=} options the $http.get options
   * @returns {Promise}
   */
  get(endpoint, options) {
    return this.http('get', endpoint, options);
  }

  /**
   * Call the given endpoint on the API v2 using the 'delete' method
   * @param {string} endpoint
   * @param {object=} options the $http.delete options
   * @returns {Promise}
   */
  delete(endpoint, options) {
    return this.http('delete', endpoint, options);
  }

  /**
   * Call the given endpoint on the API v2 using the 'put' method
   * @param {string} endpoint
   * @param {object=} options the $http.put options
   * @returns {Promise}
   */
  put(endpoint, options) {
    return this.http('put', endpoint, options);
  }

  /**
   * Call the given list endpoint on the API v2 that implements the cursor api
   * @param {string} endpoint
   * @param {Object=} options The $http.get options
   * @param {string=} cursor The cursor id
   * @param {number=} size The page size. Default is 25
   * @returns {Promise}
   */
  getList(endpoint, { cursor, options, size = 25 }) {
    return this.get(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        ...(cursor && { 'X-Pagination-Cursor': cursor }),
        'X-Pagination-size': size,
      },
    })
      .then(({ data, headers }) => ({
        data,
        cursor: {
          next: headers('X-Pagination-Cursor-Next'),
          prev: headers('X-Pagination-Cursor-Prev'), // not available ATM
        },
      }))
      .catch((error) => {
        if (error.status === 400 && error.data?.message === 'invalid cursor') {
          return { cursor: { error: true } };
        }
        throw error;
      });
  }
}
