export default class StoragesService {
  /* @ngInject */
  constructor($q, iceberg) {
    this.$q = $q;
    this.iceberg = iceberg;
  }

  getStorageNasha() {
    return this.iceberg(`/dedicated/nasha/`)
      .query()
      .execute()
      .$promise.then(({ data: pool }) => {
        return this.$q.all(
          pool.map((item) =>
            this.iceberg(`/dedicated/nasha/${item}`)
              .query()
              .execute()
              .$promise.then(({ data: res }) => {
                return {
                  id: res.serviceName,
                  region: res.datacenter,
                  product: 'NasHA',
                };
              }),
          ),
        );
      });
  }

  getStorageNas() {
    return this.iceberg(`/dedicated/nas/`)
      .query()
      .execute()
      .$promise.then(({ data: pool }) => {
        return this.$q.all(
          pool.map((item) =>
            this.iceberg(`/dedicated/nas/${item}`)
              .query()
              .execute()
              .$promise.then(({ data: res }) => {
                return {
                  id: res.serviceName,
                  region: res.datacenter,
                  product: 'NasHA',
                };
              }),
          ),
        );
      });
  }

  getStorageNetapp() {
    return this.iceberg(`/storage/netapp/`)
      .query()
      .execute()
      .$promise.then(({ data: pool }) => {
        return this.$q.all(
          pool.map((item) =>
            this.iceberg(`/storage/netapp/${item}`)
              .query()
              .execute()
              .$promise.then(({ data: res }) => {
                return {
                  id: res.id,
                  region: res.region,
                  product: 'Enterprise File Volume',
                  status: res.status,
                };
              }),
          ),
        );
      });
  }
}
