export default class StoragesService {
  /* @ngInject */
  constructor($q, OvhHttp) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
  }

  getStorageNasha() {
    return this.OvhHttp.get(`/dedicated/nasha/`, {
      rootPath: 'apiv6',
    }).then((pool) => {
      return this.$q.all(
        pool.map((item) =>
          this.OvhHttp.get(`/dedicated/nasha/${item}`, {
            rootPath: 'apiv6',
          }).then((res) => {
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
    return this.OvhHttp.get(`/dedicated/nas/`, {
      rootPath: 'apiv6',
    }).then((pool) => {
      return this.$q.all(
        pool.map((item) =>
          this.OvhHttp.get(`/dedicated/nas/${item}`, {
            rootPath: 'apiv6',
          }).then((res) => {
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
    return this.OvhHttp.get(`/storage/netapp/`, {
      rootPath: 'apiv6',
    }).then((pool) => {
      return this.$q.all(
        pool.map((item) =>
          this.OvhHttp.get(`/storage/netapp/${item}`, {
            rootPath: 'apiv6',
          }).then((res) => {
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
