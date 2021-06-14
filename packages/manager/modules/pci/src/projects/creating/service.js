import map from 'lodash/map';

export default class ProjectCreation {
  /* @ngInject */
  constructor($http, OvhApiMeOrder) {
    this.$http = $http;
    this.OvhApiMeOrder = OvhApiMeOrder;
  }

  getOrderItemDetails(orderId, orderDetailId) {
    const url = `/me/order/${orderId}/details/${orderDetailId}/extension`;
    return this.$http.get(url).then(({ data }) => data);
  }

  getOrderDetails(orderId) {
    return this.OvhApiMeOrder.v6()
      .getDetails({
        orderId,
      })
      .$promise.then((detailIds) => {
        const detailPromises = map(
          detailIds,
          (detailId) =>
            this.OvhApiMeOrder.v6().getDetail({
              orderId,
              detailId,
            }).$promise,
        );

        return Promise.all(detailPromises);
      });
  }

  getOrderStatus(orderId) {
    return this.OvhApiMeOrder.v6().getStatus({
      orderId,
    }).$promise;
  }
}
