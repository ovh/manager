import filter from 'lodash/filter';

class IpLoadBalancerZoneDeleteCtrl {
  constructor($q, $stateParams, CucCloudMessage, CucCloudNavigation, CucControllerHelper,
    IpLoadBalancerZoneDeleteService) {
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerZoneDeleteService = IpLoadBalancerZoneDeleteService;

    this.serviceName = $stateParams.serviceName;

    this.initLoaders();
    this.initModel();
  }

  $onInit() {
    this.previousState = this.CucCloudNavigation.getPreviousState();
    this.zones.load();
  }

  submit() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }

    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerZoneDeleteService
      .deleteZones(this.serviceName, this.model.zones.value)
      .then(() => {
        this.previousState.go();
      })
      .finally(() => {
        this.saving = false;
      });
  }

  getDeletableZoneCount() {
    return filter(this.zones.data, zone => zone.selectable.value !== false).length;
  }

  isLoading() {
    return this.saving || this.zones.loading;
  }

  initLoaders() {
    this.zones = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.IpLoadBalancerZoneDeleteService
        .getDeletableZones(this.serviceName),
    });
  }

  initModel() {
    this.model = {
      zones: {
        value: [],
      },
    };
  }
}

angular.module('managerApp').controller('IpLoadBalancerZoneDeleteCtrl', IpLoadBalancerZoneDeleteCtrl);
