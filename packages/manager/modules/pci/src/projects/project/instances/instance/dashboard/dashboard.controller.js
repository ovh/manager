import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';

export default /* @ngInject */ function CloudProjectInstanceDashboardCtrl(
  $translate,
  OvhApiCloudProjectInstance,
  OvhApiCloudProjectNetwork,
  OvhApiCloudProjectVolume,
) {
  this.instance = null;
  this.volumes = [];
  this.loading = {
    instance: false,
    volumes: false,
    privateNetworks: false,
  };

  this.$onInit = function $onInit() {
    $translate.refresh()
      .then(() => this.loadInstance())
      .then(() => this.loadAttachedVolumes())
      .then(() => this.loadPrivateNetworks());
    /*
    OvhApiCloud.v6().subsidiaryPrice({
      flavorId: 'ac74cb45-d895-47dd-b9cf-c17778033d83',
      ovhSubsidiary: 'FR',
      region: 'SBG1',
    }).$promise.then(console.log);
    */
  };

  this.loadInstance = function loadInstance() {
    this.loading.instance = true;
    return OvhApiCloudProjectInstance.v6().get({
      serviceName: this.projectId,
      instanceId: this.instanceId,
    }).$promise.then((instance) => {
      this.instance = instance;
    }).finally(() => {
      this.loading.instance = false;
    });
  };

  this.loadAttachedVolumes = function loadAttachedVolumes() {
    this.loading.volumes = true;
    return OvhApiCloudProjectVolume.v6().query({
      serviceName: this.projectId,
    }).$promise.then((volumes) => {
      this.volumes = volumes.filter(volume => volume.attachedTo.indexOf(this.instanceId) >= 0);
    }).finally(() => {
      this.loading.volumes = false;
    });
  };

  this.loadPrivateNetworks = function loadPrivateNetworks() {
    this.loading.privateNetworks = true;
    return OvhApiCloudProjectNetwork.Private().v6().query({
      serviceName: this.projectId,
    }).$promise.then((networks) => {
      this.networks = filter(networks, { type: 'private' });
    }).finally(() => {
      this.loading.privateNetworks = false;
    });
  };

  this.getIp = function getIp(ipVersion = 4) {
    return get(find(get(this.instance, 'ipAddresses'), {
      type: 'public',
      version: ipVersion,
    }), 'ip');
  };

  this.getConnectionInfos = function getConnectionInfos() {
    const user = get(this.instance, 'image.user') || 'user';
    const ip = this.getIp(4) || this.getIp(6) || 'X.X.X.X';
    return get(this.instance, 'image.type') === 'windows'
      ? `rdekstop ${ip}` : `ssh ${user}@${ip}`;
  };
}
