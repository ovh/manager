export default class OctaviaLoadBalancerPoolsDetailMembersAddIpInstanceCtrl {
  /* @ngInject */

  constructor(Alerter, OctaviaLoadBalancerMembersService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerMembersService = OctaviaLoadBalancerMembersService;
    this.$translate = $translate;
  }

  $onInit() {
    this.model = {
      checked: [],
    };
    this.instances = [];
    this.displayedInstances = [];
    this.resetCurrentStep();
    this.loadIpInstances();
  }

  loadIpInstances() {
    this.isLoading = true;
    this.OctaviaLoadBalancerMembersService.getInstances(this.projectId)
      .then((instances) => {
        // For each instance, we create a new instance per ip address
        // We create a new instance only for IPV4 ip address
        angular.forEach(instances, (instance) => {
          this.computeIpV4Instance(instance);
        });
        this.displayedInstances = [...this.instances];
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.members',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  computeIpV4Instance(instance) {
    instance.ipAddresses.forEach((ipAddress) => {
      if (ipAddress.version === 4) {
        // The label displayed = name of the instance (ip address)
        this.instances.push({
          label: `${instance.name} (${ipAddress.ip}) `,
        });

        // Push false in the checked array. It will be used
        // in the next step to identify which instance have been selected
        this.model.checked.push(false);
      }
    });
  }

  resetCurrentStep() {
    this.currentStep = 0;
  }

  onSearchInstance(value) {
    this.displayedInstances = this.instances.filter((instance) =>
      instance.label.toLowerCase().includes(value.toLowerCase()),
    );
  }

  onSearchReset() {
    this.displayedInstances = [...this.instances];
  }

  isValid() {
    return this.model.checked
      ? this.model.checked.some((checked) => checked === true)
      : false;
  }
}
