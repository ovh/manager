export default class CloudProjectComputeInfrastructureIacViewCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    OvhApiCloudProjectStack,
    CucServiceHelper,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.OvhApiCloudProjectStack = OvhApiCloudProjectStack;
    this.CucServiceHelper = CucServiceHelper;
  }

  $onInit() {
    this.serviceName = this.$stateParams.projectId;
    return this.getStacks();
  }

  cancel() {
    this.$state.go('pci.projects.project.legacy.compute.infrastructure.list');
  }

  getStacks() {
    return this.$q
      .all({
        stacks: this.OvhApiCloudProjectStack.v6()
          .query({ serviceName: this.serviceName }).$promise,
      })
      .then(({ stacks }) => {
        this.stacks = stacks;
        return stacks;
      })
      .catch(this.CucServiceHelper.errorHandler('cpciiac_view_general_ERROR'));
  }

  viewStack(stack) {
    return this.$state.go('pci.projects.project.legacy.compute.infrastructure.iac-deploy', {
      stackId: stack.uuid,
    });
  }
}
