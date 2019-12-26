import find from 'lodash/find';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';

class CloudProjectComputeInfrastructureListCtrl {
  constructor(
    $scope,
    $q,
    $stateParams,
    $translate,
    $timeout,
    atInternet,
    CloudFlavorService,
    CucCloudMessage,
    CucCloudNavigation,
    CloudProjectOrchestrator,
    CloudProjectComputeInfrastructureService,
    OvhApiCloudProjectVolume,
    CucRegionService,
    OvhApiCloudProjectFlavor,
    coreConfig,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CloudFlavorService = CloudFlavorService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.CloudProjectOrchestrator = CloudProjectOrchestrator;
    this.InfrastructureService = CloudProjectComputeInfrastructureService;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.region = coreConfig.getRegion();
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

    this.$scope.$watchCollection(
      () => get(this.infra, 'vrack.publicCloud.sortedKeys'),
      (newValues, oldValues) => {
        this.addOrRemoveInstance(newValues, oldValues);
      },
    );

    this.$scope.$on(
      'compute.infrastructure.vm.status-update',
      (evt, newStatus, oldStatus, vm) => {
        this.updateInstance(vm, vm.flavor);
      },
    );

    this.$scope.$on(
      'compute.infrastructure.vm.monthlyBilling.status-update',
      (evt, newStatus, oldStatus, vm) => {
        this.updateInstance(vm, vm.flavor);
      },
    );

    this.InfrastructureService.setPreferredView('list');

    return this.initInfra();
  }

  initInfra() {
    this.loaders.infra = true;
    return this.$q
      .all({
        infra: this.CloudProjectOrchestrator.initInfrastructure({
          serviceName: this.serviceName,
        }),
        volumes: this.CloudProjectOrchestrator.initVolumes({
          serviceName: this.serviceName,
        }).then((volumes) => {
          this.volumes = get(volumes, 'volumes');
        }),
      })
      .then(({ infra }) => {
        this.infra = infra;
        return this.$q
          .all(
            map(this.infra.vrack.publicCloud.items, (instance) =>
              this.OvhApiCloudProjectFlavor.v6()
                .get({
                  serviceName: this.serviceName,
                  flavorId: instance.flavorId,
                })
                .$promise.then((flavor) =>
                  this.updateInstance(instance, flavor),
                ),
            ),
          )
          .then((instances) => {
            this.table.items = instances;
          });
      })
      .catch((err) => {
        this.table.items = [];
        this.CucCloudMessage.error(
          `${this.$translate.instant('cpci_errors_init_title')} : ${get(
            err,
            'data.message',
            '',
          )}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.infra = false;
      });
  }

  updateInstance(instance, flavor) {
    set(instance, 'volumes', get(this.volumes, instance.id, []));
    set(instance, 'ipv4', instance.getPublicIpv4());
    set(instance, 'ipv6', instance.getPublicIpv6());
    set(
      instance,
      'statusToTranslate',
      this.constructor.getStatusToTranslate(instance),
    );
    set(
      instance,
      'macroRegion',
      this.CucRegionService.constructor.getMacroRegion(instance.region),
    );
    set(
      instance,
      'flavorTranslated',
      this.CloudFlavorService.formatFlavorName(flavor.name),
    );
    return instance;
  }

  static getStatusToTranslate(instance) {
    if (
      instance.status === 'ACTIVE' &&
      instance.monthlyBilling &&
      instance.monthlyBilling.status === 'activationPending'
    ) {
      return 'UPDATING';
    }
    if (instance.status === 'ACTIVE') {
      return 'OK';
    }
    if (
      instance.status === 'REBOOT' ||
      instance.status === 'HARD_REBOOT' ||
      instance.status === 'RESCUING' ||
      instance.status === 'UNRESCUING'
    ) {
      return 'REBOOT';
    }
    return instance.status;
  }

  addOrRemoveInstance(newIds, oldIds) {
    if (oldIds != null) {
      if (newIds.length > oldIds.length) {
        const foundId = find(newIds, (key) => indexOf(oldIds, key) === -1);
        const foundItem = this.infra.vrack.publicCloud.items[foundId];
        if (foundItem) {
          set(foundItem, 'volumes', get(this.volumes, foundItem.id, []));
          this.table.items.push(foundItem);
        }
      } else if (newIds.length < oldIds.length) {
        const foundId = find(oldIds, (key) => indexOf(newIds, key) === -1);
        remove(this.table.items, (item) => item.id === foundId);
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
    this.trackOnClick(
      'cloud-project::cloud-project-compute::cloud-project-compute-infrastructure-add-volume',
    );
    return this.InfrastructureService.addVolume();
  }

  buyIpFailOver() {
    this.trackOnClick(
      'cloud-project::cloud-project-compute::cloud-project-compute-infrastructure-buy-ip',
    );
    return this.InfrastructureService.buyIpFailOver();
  }

  openDeleteProjectModal() {
    this.trackOnClick(
      'cloud-project::cloud-project-compute::cloud-project-compute-infrastructure-delete-project',
    );
    return this.InfrastructureService.openDeleteProjectModal();
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureListCtrl',
    CloudProjectComputeInfrastructureListCtrl,
  );
