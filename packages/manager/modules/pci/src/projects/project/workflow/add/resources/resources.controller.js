import Instance from '../../../../../components/project/instance/instance.class';

export default class {
  constructor(
    $q,
    CucRegionService,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectVolume,
  ) {
    this.$q = $q;
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;
  }

  $onInit() {
    if (this.selectedInstance) {
      this.resource = this.selectedInstance.id;
      this.selectResource(this.selectedInstance);
    }
  }

  loadInstanceDetail(instance) {
    return this.$q
      .all({
        flavor: this.OvhApiCloudProjectFlavor
          .v6()
          .get({
            serviceName: this.projectId,
            flavorId: instance.flavorId,
          })
          .$promise
          .catch(() => null),
      })
      .then(({ flavor }) => new Instance({
        ...instance,
        flavor,
      }));
  }

  selectResource(instance) {
    this.selectedResource = instance;
  }
}
