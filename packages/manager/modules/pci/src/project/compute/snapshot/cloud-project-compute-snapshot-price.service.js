class CloudProjectComputeSnapshotPriceService {
  constructor(OvhCloudPriceHelper) {
    this.OvhCloudPriceHelper = OvhCloudPriceHelper;
  }

  getSnapshotPrice({ size, serviceName, region }) {
    return this.OvhCloudPriceHelper.getPrices(serviceName).then((prices) => {
      let snapshotPrice = prices[`snapshot.consumption.${region}`] || prices['snapshot.consumption'];
      if (!snapshotPrice) {
        console.warn('price not found for this snapshot');
      }
      snapshotPrice = {
        price: angular.copy(snapshotPrice.price),
        priceInUcents: snapshotPrice.priceInUcents,
      };
      snapshotPrice.totalPrice = angular.copy(snapshotPrice.price);
      snapshotPrice.monthlyPrice = angular.copy(snapshotPrice.price);

      snapshotPrice.monthlyPrice.value = snapshotPrice.priceInUcents * moment.duration(1, 'months').asHours() / 100000000;
      snapshotPrice.monthlyPrice.text = snapshotPrice.monthlyPrice.text.replace(/\d+(?:[.,]\d+)?/, _.round(snapshotPrice.monthlyPrice.value.toString(), 2));

      snapshotPrice.totalPrice.value = snapshotPrice.monthlyPrice.value * size;
      snapshotPrice.totalPrice.text = snapshotPrice.totalPrice.text.replace(/\d+(?:[.,]\d+)?/, _.round(snapshotPrice.totalPrice.value.toString(), 2));

      return snapshotPrice;
    });
  }
}

angular.module('managerApp').service('CloudProjectComputeSnapshotPriceService', CloudProjectComputeSnapshotPriceService);
