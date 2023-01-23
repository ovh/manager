export default class SiretService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getSiret(params) {
    return this.$http
      .get('/me/suggest/company', { params })
      .then(({ data }) => data)
      .catch((err) => {
        if (err?.status === 404) {
          return {
            error: false,
            searched: params.identifier,
            entryList: [],
          };
        }
        return {
          error: true,
          message: err?.data?.message,
        };
      });
  }
}
