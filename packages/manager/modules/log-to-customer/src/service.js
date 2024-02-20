export default class LogToCustomerService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getDataStreams() {
    return this.$http.get('/dbaas/logs').then(({ data }) => {
      const streamPromises = data.map((id) => {
        return this.$http
          .get(`/dbaas/logs/${id}/output/graylog/stream`)
          .then((response) => {
            return {
              service: id,
              streams: response.data,
            };
          })
          .catch(() => {
            return {
              service: id,
              streams: [],
            };
          });
      });

      return this.$q.all(streamPromises).then((results) => {
        return results.reduce(
          (acc, current) => {
            return {
              ...acc,
              streams: acc.streams.concat(current),
              streamCount: acc.streamCount + current.streams.length,
            };
          },
          { streams: [], streamCount: 0 },
        );
      });
    });
  }
}
