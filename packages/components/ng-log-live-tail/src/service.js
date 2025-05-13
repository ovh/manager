import { API_VERSION } from './constants';

export default class LogLiveTailService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogSourceUrl(source, kind, apiVersion = API_VERSION.v1) {
    return this.$http
      .post(
        source,
        { kind },
        {
          serviceType: apiVersion,
        },
      )
      .then(({ data }) => data);
  }

  getLogs(url) {
    return this.$http.get(`${url}&sort=asc&limit=20`).then(({ data }) => data);
  }
}
