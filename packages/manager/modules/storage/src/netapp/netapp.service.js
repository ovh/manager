export default class NetappService {
  /* @ngInject */
  constructor($q, iceberg) {
    this.$q = $q;
    this.iceberg = iceberg;
  }

  getService(netappId) {
    return this.iceberg(`/storage/netapp/${netappId}`)
      .query()
      .execute()
      .$promise.then(({ data: service }) => service);
  }

  getShares(netappId) {
    return this.iceberg(`/storage/netapp/${netappId}/share`)
      .query()
      .execute()
      .$promise.then(({ data: share }) => {
        return this.$q.all(
          share.map((item) =>
            this.iceberg(`/storage/netapp/${netappId}/share/${item.id}`)
              .query()
              .execute()
              .$promise.then(({ data: shareItem }) => shareItem),
          ),
        );
      });
  }
}
