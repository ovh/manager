import Instance from '../../../../../components/project/instance/instance.class';

export default class {
  /* @ngInject */
  constructor(
    CucRegionService,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectVolume,
  ) {
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;
  }

  $onInit() {
    if (this.selectedInstance) {
      this.resource = this.selectedInstance.id;
      this.selectResource(this.selectedInstance);
    }
  }

  loadInstanceDetail(instance) {
    return this.OvhApiCloudProjectFlavor
      .v6()
      .get({
        serviceName: this.projectId,
        flavorId: instance.flavorId,
      })
      .$promise
      .then(flavor => new Instance({
        ...instance,
        flavor,
      }))
      .catch(() => null);
  }

  selectResource(instance) {
    this.selectedResource = instance;
  }
}
