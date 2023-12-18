export default class OctaviaLoadBalancerPoolsDetailMembersAddIpInstanceCtrl {
  /* @ngInject */

  constructor(Alerter, OctaviaLoadBalancerMembersService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerMembersService = OctaviaLoadBalancerMembersService;
    this.$translate = $translate;
  }

  $onInit() {
    this.model = {
      members: [],
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
        instances.forEach((instance) => {
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
          name: instance.name,
          address: ipAddress.ip,
          checked: false,
        });
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
    return this.displayedInstances.some((instance) => instance.checked);
  }

  onStep2Focus() {
    this.duplicatePort = false;
    this.model.members = this.displayedInstances.reduce(
      (instances, instance) => {
        if (instance.checked) {
          instances.push({
            name: instance.name,
            address: instance.address,
          });
        }
        return instances;
      },
      [],
    );
  }

  duplicatePortToMembers() {
    for (let index = 0; index < this.model.members.length; index += 1) {
      this.model.members[
        index
      ].protocolPort = this.model.members[0].protocolPort;
    }
  }

  addIpInstances() {
    this.trackAddInstancesAction('confirm');
    this.OctaviaLoadBalancerMembersService.createMembers(
      this.projectId,
      this.region,
      this.poolId,
      this.model.members,
    )
      .then(async () => {
        this.trackAddInstancesPage('success');
        this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_pools_detail_members_add_ip_instance_create_success',
            ),
            null,
            'octavia.alerts.members',
          ),
        );
      })
      .catch((error) => {
        this.trackAddInstancesPage('error');
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

  cancel() {
    this.trackAddInstancesAction('cancel');
    this.goBack();
  }

  onPortChange(memberIndex) {
    if (this.duplicatePort && memberIndex === 0) {
      this.duplicatePortToMembers();
    }
  }

  onDuplicatePortChange(duplicatePort) {
    if (duplicatePort) {
      this.duplicatePortToMembers();
    }
  }

  isIpAlreadyAssociatedWithPort(address, value) {
    return (
      this.members.find(
        (existingMember) =>
          existingMember.address === address &&
          existingMember.protocolPort === value,
      ) !== undefined
    );
  }
}
