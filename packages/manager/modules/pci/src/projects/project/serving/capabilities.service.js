export default class OvhManagerPciServingNamespaceModelsAddServiceCapabilities {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectAiServing) {
    this.$q = $q;
    this.OvhApiCloudProjectAiServing = OvhApiCloudProjectAiServing;
  }

  getFlavors(serviceName) {
    return this.OvhApiCloudProjectAiServing
      .Capabilities().Flavor().v6()
      .query({
        serviceName,
      }).$promise;
  }

  getPresetImages(serviceName) {
    return this.OvhApiCloudProjectAiServing
      .Capabilities().PresetImage().v6()
      .query({
        serviceName,
      }).$promise;
  }
}
