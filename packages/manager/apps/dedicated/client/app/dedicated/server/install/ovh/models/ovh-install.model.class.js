import DedicatedServerInstallOvhTemplateModel from './template.model.class';
import DedicatedServerInstallOvhRaidModel from './raid.model.class';

export default class DedicatedServerInstallOvhModel {
  constructor() {
    this.template = new DedicatedServerInstallOvhTemplateModel();
    this.raid = new DedicatedServerInstallOvhRaidModel();
  }
}
