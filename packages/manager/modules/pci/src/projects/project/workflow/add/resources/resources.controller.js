import get from 'lodash/get';

import Instance from '../../../../../components/project/instance/instance.class';

export default class {
  /* @ngInject */
  constructor(
    ovhManagerRegionService,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectVolume,
    PciProjectsProjectInstanceService,
  ) {
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    if (this.selectedInstance) {
      this.resource = this.selectedInstance.id;
      this.selectResource(this.selectedInstance);
    }
  }

  loadInstanceDetail(instance) {
    return this.OvhApiCloudProjectFlavor.v6()
      .get({
        serviceName: this.projectId,
        flavorId: instance.flavorId,
      })
      .$promise.then(
        (flavor) =>
          new Instance({
            ...instance,
            flavor: {
              ...flavor,
              capabilities: this.PciProjectsProjectInstanceService.constructor.transformCapabilities(
                get(flavor, 'capabilities', []),
              ),
            },
          }),
      )
      .catch(() => null);
  }

  selectResource(instance) {
    this.selectedResource = instance;
  }
}
