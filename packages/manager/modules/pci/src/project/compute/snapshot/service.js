import round from 'lodash/round';

import angular from 'angular';
import moment from 'moment';

export default class CloudProjectComputeSnapshotPriceService {
  /* @ngInject */
  constructor(
    CucPriceHelper,
  ) {
    this.CucPriceHelper = CucPriceHelper;
  }

  getSnapshotPrice({ size, serviceName, region }) {
    return this.CucPriceHelper.getPrices(serviceName).then((prices) => {
      let snapshotPrice = prices[`snapshot.consumption.${region}`] || prices['snapshot.consumption'];
      if (!snapshotPrice) {
        // eslint-disable-next-line no-console
        console.warn('price not found for this snapshot');
      }
      snapshotPrice = {
        price: angular.copy(snapshotPrice.price),
        priceInUcents: snapshotPrice.priceInUcents,
      };
      snapshotPrice.totalPrice = angular.copy(snapshotPrice.price);
      snapshotPrice.monthlyPrice = angular.copy(snapshotPrice.price);

      snapshotPrice.monthlyPrice.value = snapshotPrice.priceInUcents * moment.duration(1, 'months').asHours() / 100000000;
      snapshotPrice.monthlyPrice.text = snapshotPrice.monthlyPrice.text.replace(/\d+(?:[.,]\d+)?/, round(snapshotPrice.monthlyPrice.value.toString(), 2));

      snapshotPrice.totalPrice.value = snapshotPrice.monthlyPrice.value * size;
      snapshotPrice.totalPrice.text = snapshotPrice.totalPrice.text.replace(/\d+(?:[.,]\d+)?/, round(snapshotPrice.totalPrice.value.toString(), 2));

      return snapshotPrice;
    });
  }
}
