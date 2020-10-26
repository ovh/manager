export default class NetappService {
  /* @ngInject */
  constructor($q, OvhHttp) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
  }

  getService(netappId) {
    return this.OvhHttp.get(`/storage/netapp/${netappId}`, {
      rootPath: 'apiv6',
    });
    // return {
    //   id: netappId,
    //   createdAt: '2020-10-08T08:12:31.766718Z',
    //   name: '',
    //   product: 'netapp-file-pool-premium-2tb',
    //   region: 'RBX',
    //   status: 'suspended',
    // };
  }

  getShares(netappId) {
    return this.OvhHttp.get(`/storage/netapp/${netappId}/share`, {
      rootPath: 'apiv6',
    }).then((share) => {
      return this.$q.all(
        share.map((item) =>
          this.OvhHttp.get(`/dedicated/netapp/${netappId}/share/${item.id}`, {
            rootPath: 'apiv6',
          }),
        ),
      );
    });
    // return [
    //   {
    //     id: 'c2bce020-433f-4c81-b25a-fa614c0cc44a',
    //     createdAt: '2020-10-20T08:54:02.244228Z',
    //     name: 'BGRShare100',
    //     description: 'A share of 100Go for test',
    //     protocol: 'NFS',
    //     size: 100,
    //     status: 'error',
    //   },
    // ];
  }
}
