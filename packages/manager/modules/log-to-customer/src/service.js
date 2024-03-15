export default class LogToCustomerService {
  /* @ngInject */
  constructor($http, $q, iceberg, Poller) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
    this.Poller = Poller;
  }

  getRetention(serviceName, clusterId, retentionId) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/cluster/${clusterId}/retention/${retentionId}`,
      )
      .then(({ data }) => data);
  }

  icebergQuery(url, params = {}) {
    return this.iceberg(url, params)
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data }) => data);
  }

  get(url) {
    return this.$http.get(url);
  }

  post(url, payload) {
    return this.$http.post(url, payload);
  }

  delete(url) {
    return this.$http.delete(url);
  }

  pollOperation(serviceName, operation) {
    const url = `/dbaas/logs/${serviceName}/operation/${operation.operationId}`;
    return this.Poller.poll(url, null, {
      successRule(task) {
        return task.state === 'SUCCESS';
      },
      errorRule(task) {
        return task.state === 'FAILURE' || task.state === 'REVOKE';
      },
      namespace: 'logToCustomer',
    });
  }

  stopOperationPolling() {
    return this.Poller.kill({
      namespace: 'logToCustomer',
    });
  }

  getIcebergStreamData(id) {
    return this.icebergQuery(`/dbaas/logs/${id}/output/graylog/stream`);
  }

  getLogAccount(id) {
    return this.$http.get(`/dbaas/logs/${id}`).then(({ data }) => data);
  }

  getSream(serviceName, id) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/output/graylog/stream/${id}`)
      .then(({ data }) => data);
  }

  getStreamUrl(serviceName, id) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/output/graylog/stream/${id}/url`)
      .then(
        ({ data }) =>
          data.find(({ type }) => type === 'GRAYLOG_WEBUI')?.address,
      );
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
