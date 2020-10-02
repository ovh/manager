import { AVAILABLE_INSTALL_TYPES } from './constants';

export default class DedicatedServerInstallCtrl {
  constructor() {
    this.installationTypes = AVAILABLE_INSTALL_TYPES;

    this.model = {
      installationType: null,
    };
  }
}
