import map from 'lodash/map';

export default class ProjectCreation {
  /* @ngInject */
  constructor(OvhApiMeOrder) {
    this.OvhApiMeOrder = OvhApiMeOrder;
  }

  getOrderFollowUp(orderId) {
    return this.OvhApiMeOrder.v6().followUp({
      orderId,
    }).$promise;
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
