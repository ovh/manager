export default class ProjectCreation {
  /* @ngInject */
  constructor(OvhApiCloudProject, OvhApiMeOrder) {
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiMeOrder = OvhApiMeOrder;
  }

  getOrderDetails(orderId) {
    return this.OvhApiMeOrder.v6().get({
      orderId,
    }).$promise;
  }

  getOrderStatus(orderId) {
    return this.OvhApiMeOrder.v6().getStatus({
      orderId,
    }).$promise;
  }

  cancelProjectCreation(projectId) {
    return this.OvhApiCloudProject.v6().cancelCreation(
      {
        serviceName: projectId,
      },
      {},
    ).$promise;
  }
}
