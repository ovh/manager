import find from 'lodash/find';

class CloudProjectComputeInfrastructureIacDeployCtrl {
  constructor(
    $q,
    $state,
    $stateParams,
    CloudProjectComputeInfrastructureOpenstackClientService,
    OvhApiCloudProjectStack,
    OvhApiMe,
    CucServiceHelper,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Service = CloudProjectComputeInfrastructureOpenstackClientService;
    this.OvhApiCloudProjectStack = OvhApiCloudProjectStack;
    this.OvhApiMe = OvhApiMe;
    this.CucServiceHelper = CucServiceHelper;
  }

  $onInit() {
    this.StackID = this.$stateParams.stackId;
    this.serviceName = this.$stateParams.projectId;

    return this.$q
      .all({
        user: this.getUser(),
        stack: this.OvhApiCloudProjectStack.v6().get({
          serviceName: this.serviceName,
          stackId: this.StackID,
        }).$promise,
      })
      .then((results) => {
        this.stack = results.stack;
        this.guides = results.stack.instructions;
        this.guide = find(
          this.guides,
          (guide) => guide.language === this.user.language,
        );

        // Default is en_US
        if (!this.guide) {
          this.guide = find(this.guides, (guide) => guide.language === 'en_US');
        }

        if (!this.guide) {
          this.guide = this.defaultGuide;
        }

        if (this.$stateParams.hTerm.session) {
          return this.$q.when();
        }

        return this.OvhApiCloudProjectStack.v6()
          .client({
            serviceName: this.serviceName,
            stackId: this.stack.uuid,
          })
          .$promise.then((session) =>
            this.$state.go('.', {
              hTerm: {
                session,
              },
            }),
          );
      })
      .catch(
        this.CucServiceHelper.errorHandler('cpciiac_view_deployment_ERROR'),
      );
  }

  getUser() {
    return this.OvhApiMe.v6()
      .get()
      .$promise.then((user) => {
        this.user = user;
        return user;
      })
      .catch(
        this.CucServiceHelper.errorHandler('cpciiac_view_deployment_ERROR'),
      );
  }

  cancel() {
    this.$state.go('iaas.pci-project.compute.infrastructure.list');
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureIacDeployCtrl',
    CloudProjectComputeInfrastructureIacDeployCtrl,
  );
