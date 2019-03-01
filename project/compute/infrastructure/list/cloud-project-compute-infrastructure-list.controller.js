class CloudProjectComputeInfrastructureListCtrl {
  constructor($scope, $q, $stateParams, $translate, $timeout, atInternet,
    CucCloudMessage, CucCloudNavigation, CloudProjectOrchestrator,
    CloudProjectComputeInfrastructureService,
    OvhApiCloudProjectVolume, CucRegionService, OvhApiCloudProjectFlavor, TARGET) {
    this.$scope = $scope;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.CloudProjectOrchestrator = CloudProjectOrchestrator;
    this.InfrastructureService = CloudProjectComputeInfrastructureService;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.TARGET = TARGET;
  }

  $onInit() {
    this.serviceName = this.$stateParams.projectId;

    this.CucCloudNavigation.init({
      state: 'iaas.pci-project.compute.infrastructure.list',
      stateParams: {
        serviceName: this.serviceName,
      },
    });

    this.loaders = {
      infra: false,
    };

    this.table = {
      items: undefined,
    };

    this.statusOptions = {
      values: {
        OK: this.$translate.instant('cpci_vm_status_OK'),
        UPDATING: this.$translate.instant('cpci_vm_status_UPDATING'),
        REBOOT: this.$translate.instant('cpci_vm_status_REBOOT'),
        BUILD: this.$translate.instant('cpci_vm_status_BUILD'),
        REBUILD: this.$translate.instant('cpci_vm_status_REBUILD'),
        RESCUE: this.$translate.instant('cpci_vm_status_RESCUE'),
        SNAPSHOTTING: this.$translate.instant('cpci_vm_status_SNAPSHOTTING'),
        ERROR: this.$translate.instant('cpci_vm_status_ERROR'),
        DELETING: this.$translate.instant('cpci_vm_status_DELETING'),
      },
    };

    this.regionOptions = {
      values: this.CucRegionService.getAllTranslatedMacroRegion(),
    };

    this.$scope.$watchCollection(() => _.get(this.infra, 'vrack.publicCloud.sortedKeys'), (newValues, oldValues) => {
      this.addOrRemoveInstance(newValues, oldValues);
    });

    this.$scope.$on('compute.infrastructure.vm.status-update', (evt, newStatus, oldStatus, vm) => {
      this.updateInstance(vm, vm.flavor);
    });

    this.$scope.$on('compute.infrastructure.vm.monthlyBilling.status-update', (evt, newStatus, oldStatus, vm) => {
      this.updateInstance(vm, vm.flavor);
    });

    this.InfrastructureService.setPreferredView('list');

    return this.initInfra();
  }

  initInfra() {
    this.loaders.infra = true;
    return this.$q.all({
      infra: this.CloudProjectOrchestrator.initInfrastructure({ serviceName: this.serviceName }),
      volumes: this.CloudProjectOrchestrator
        .initVolumes({ serviceName: this.serviceName })
        .then((volumes) => {
          this.volumes = _.get(volumes, 'volumes');
        }),
    }).then(({ infra }) => {
      this.infra = infra;
      return this.$q
        .all(_.map(
          this.infra.vrack.publicCloud.items,
          instance => this.OvhApiCloudProjectFlavor.v6()
            .get({ serviceName: this.serviceName, flavorId: instance.flavorId }).$promise
            .then(flavor => this.updateInstance(instance, flavor)),
        ))
        .then((instances) => { this.table.items = instances; });
    }).catch((err) => {
      this.table.items = [];
      this.CucCloudMessage.error(`${this.$translate.instant('cpci_errors_init_title')} : ${_.get(err, 'data.message', '')}`);
      return this.$q.reject(err);
    }).finally(() => {
      this.loaders.infra = false;
    });
  }

  updateInstance(instance, flavor) {
    _.set(instance, 'volumes', _.get(this.volumes, instance.id, []));
    _.set(instance, 'ipv4', instance.getPublicIpv4());
    _.set(instance, 'ipv6', instance.getPublicIpv6());
    _.set(instance, 'statusToTranslate', this.constructor.getStatusToTranslate(instance));
    _.set(instance, 'macroRegion', this.CucRegionService.constructor.getMacroRegion(instance.region));
    // patch for some translations that have &#160; html entities
    _.set(instance, 'flavorTranslated', this.$translate.instant(`cpci_vm_flavor_category_${flavor.name}`).replace('&#160;', ' '));
    return instance;
  }

  static getStatusToTranslate(instance) {
    if (instance.status === 'ACTIVE' && instance.monthlyBilling && instance.monthlyBilling.status === 'activationPending') {
      return 'UPDATING';
    } if (instance.status === 'ACTIVE') {
      return 'OK';
    } if (instance.status === 'REBOOT' || instance.status === 'HARD_REBOOT' || instance.status === 'RESCUING' || instance.status === 'UNRESCUING') {
      return 'REBOOT';
    }
    return instance.status;
  }

  addOrRemoveInstance(newIds, oldIds) {
    if (oldIds != null) {
      if (newIds.length > oldIds.length) {
        const foundId = _.find(newIds, key => _.indexOf(oldIds, key) === -1);
        const foundItem = this.infra.vrack.publicCloud.items[foundId];
        if (foundItem) {
          _.set(foundItem, 'volumes', _.get(this.volumes, foundItem.id, []));
          this.table.items.push(foundItem);
        }
      } else if (newIds.length < oldIds.length) {
        const foundId = _.find(oldIds, key => _.indexOf(newIds, key) === -1);
        _.remove(this.table.items, item => item.id === foundId);
      }
    }
  }

  trackOnClick(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }

  addVolume() {
    this.trackOnClick('cloud-project::cloud-project-compute::cloud-project-compute-infrastructure-add-volume');
    return this.InfrastructureService.addVolume();
  }

  buyIpFailOver() {
    this.trackOnClick('cloud-project::cloud-project-compute::cloud-project-compute-infrastructure-buy-ip');
    return this.InfrastructureService.buyIpFailOver();
  }

  openDeleteProjectModal() {
    this.trackOnClick('cloud-project::cloud-project-compute::cloud-project-compute-infrastructure-delete-project');
    return this.InfrastructureService.openDeleteProjectModal();
  }
}

angular.module('managerApp').controller('CloudProjectComputeInfrastructureListCtrl', CloudProjectComputeInfrastructureListCtrl);
