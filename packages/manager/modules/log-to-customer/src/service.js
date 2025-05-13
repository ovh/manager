export default class LogToCustomerService {
  /* @ngInject */
  constructor($http, $q, iceberg, Poller, Apiv2Service, API_VERSION) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
    this.Poller = Poller;
    this.Apiv2Service = Apiv2Service;
    this.API_VERSION = API_VERSION;
  }

  getHttpConfig(apiVersion) {
    return {
      serviceType: apiVersion ?? this.API_VERSION.v1,
    };
  }

  getRetention(serviceName, clusterId, retentionId) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/cluster/${clusterId}/retention/${retentionId}`,
      )
      .then(({ data }) => data);
  }

  icebergQuery(url, params = {}, apiVersion) {
    const promise =
      apiVersion === this.API_VERSION.v2
        ? this.Apiv2Service.httpApiv2List(
            {
              url,
              params,
              headers: {
                'X-Pagination-Mode': 'CachedObjectList-Cursor',
                Pragma: 'no-cache',
              },
            },
            { cursor: null },
          )
        : this.iceberg(url, params)
            .query()
            .expand('CachedObjectList-Pages')
            .execute(null, true).$promise;

    return promise.then(({ data }) => data);
  }

  get(url, apiVersion) {
    return this.$http.get(url, this.getHttpConfig(apiVersion));
  }

  post(url, payload, apiVersion) {
    return this.$http.post(url, payload, this.getHttpConfig(apiVersion));
  }

  delete(url, apiVersion) {
    return this.$http.delete(url, this.getHttpConfig(apiVersion));
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
