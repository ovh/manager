import { DedicatedServerHardwareRaidProfileController } from './raid-profile-controller.class';

export class DedicatedServerHardwareRaidProfile {
  constructor({ controllers } = {}) {
    this.controllers = [];

    if (controllers) {
      this.addControllers(controllers);
    }
  }

  addController(controller) {
    let addedController = controller;

    if (
      !(addedController instanceof DedicatedServerHardwareRaidProfileController)
    ) {
      addedController = new DedicatedServerHardwareRaidProfileController(
        addedController,
      );
    }
    this.controllers.push(addedController);
    return addedController;
  }

  addControllers(controllers = []) {
    controllers.forEach((controller) => {
      this.addController(controller);
    });

    return this.controllers;
  }
}

export default {
  DedicatedServerHardwareRaidProfile,
};
