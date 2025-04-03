export default class {
  /* @ngInject */
  constructor(OvhHttp, $http, $q, iceberg) {
    this.OvhHttp = OvhHttp;
    this.$http = $http;
    this.iceberg = iceberg;
    this.$q = $q;
  }

  fetchLegacyHourlyConsumption(serviceName, datacenterId, filerId) {
    return this.OvhHttp.get(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/hourlyConsumption`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  convertToGlobal(serviceName, datacenterId, filerId) {
    return this.OvhHttp.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/convertToGlobal`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  getDatastoreLocation(serviceName, datacenterId, filerId) {
    if (!datacenterId) {
      return this.$http
        .get(`/dedicatedCloud/${serviceName}/filer/${filerId}/location`)
        .then(({ data }) => data);
    }
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/location`,
      )
      .then(({ data }) => data);
  }

  getDatastores(serviceName, datacenterId, pageSize, offset) {
    return this.$q
      .all({
        globalFilers: this.icebergQuery(
          `/dedicatedCloud/${serviceName}/filer`,
          {},
        ),
        filers: this.icebergQuery(
          `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer`,
          {},
        ),
      })
      .then(({ globalFilers, filers }) => {
        const datastores = [
          ...globalFilers.data,
          ...filers.data.map((filer) => ({ ...filer, dc: datacenterId })),
        ].sort((a, b) => a.filerId - b.filerId);

        const count = datastores.length;
        const data =
          pageSize < count
            ? datastores.slice(offset, offset + pageSize)
            : datastores;
        return { count, data };
      });
  }

  icebergQuery(url, paginationParams, urlParams) {
    const { sort, sortOrder, defaultFilterColumn } = paginationParams;

    const request = this.iceberg(url)
      .query()
      .expand('CachedObjectList-Pages')
      .sort(sort || defaultFilterColumn, sortOrder);

    return request
      .execute(urlParams, true)
      .$promise.then(({ data, headers }) => ({
        data,
        meta: {
          totalCount: headers['x-pagination-elements'],
        },
      }));
  }

  getDatastoreGlobalCompatibility(serviceName, datastore) {
    const url = datastore.dc
      ? `/dedicatedCloud/${serviceName}/datacenter/${datastore.dc}/filer/${datastore.filerId}/checkGlobalCompatible`
      : `/dedicatedCloud/${serviceName}/filer/${datastore.filerId}/checkGlobalCompatible`;
    return this.$http.get(url);
  }
}
