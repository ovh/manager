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
      const storages = [];
      pool.forEach((item) => {
        this.OvhHttp.get(`/dedicated/nasha/${item}`, {
          rootPath: 'apiv6',
        }).then((res) => {
          storages.push({
            id: res.serviceName,
            region: res.datacenter,
            product: 'NasHA',
          });
        });
      });
      return storages;
    });
  }

  getStorageNas() {
    return this.OvhHttp.get(`/dedicated/nas/`, {
      rootPath: 'apiv6',
    }).then((pool) => {
      const storages = [];
      pool.forEach((item) => {
        this.OvhHttp.get(`/dedicated/nas/${item}`, {
          rootPath: 'apiv6',
        }).then((res) => {
          storages.push({
            id: res.serviceName,
            region: res.datacenter,
            product: 'Nas',
          });
        });
      });
      return storages;
    });
  }

  getStorageNetapp() {
    return this.OvhHttp.get(`/storage/netapp/`, {
      rootPath: 'apiv6',
    }).then((pool) => {
      const storages = [];
      pool.forEach((item) => {
        this.OvhHttp.get(`/storage/netapp/${item}`, {
          rootPath: 'apiv6',
        }).then((res) => {
          storages.push({
            id: res.id,
            region: res.region,
            product: 'NetApp',
            status: res.status,
          });
        });
      });
      return storages;
    });
  }
}
