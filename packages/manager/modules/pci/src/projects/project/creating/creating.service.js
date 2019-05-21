export default class ProjectCreation {
  /* @ngInject */
  constructor(OvhApiMeOrder) {
    this.OvhApiMeOrder = OvhApiMeOrder;
  }

  getOrderDetails(orderId) {
    return this.OvhApiMeOrder
      .v6()
      .get({
        orderId,
      })
      .$promise;
  }
}
