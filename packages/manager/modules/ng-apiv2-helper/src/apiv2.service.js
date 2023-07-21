export default class Apiv2Service {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  /**
   * Call the given endpoint on the API v2
   * @param {object} options the $http options
   * @returns {Promise}
   */
  httpApiv2(options) {
    return this.$http({
      ...options,
      serviceType: 'apiv2',
    }).catch((error) => error);
  }

  /**
   * Call the given list endpoint on the API v2 that implements the cursor api
   * @param {Object} options The $http options
   * @param {string=} cursor The cursor id
   * @param {number=} size The page size. Default is 25
   * @returns {Promise}
   */
  httpApiv2List(options, { cursor, size = 25 }) {
    return this.httpApiv2({
      ...options,
      method: 'get',
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
