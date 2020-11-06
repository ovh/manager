import { DedicatedServerHardware } from './hardware/hardware.class';
import { DedicatedServerInstallationTemplate } from './installation-template/installation-template.class';

export class DedicatedServer {
  constructor(swsResponse = {}) {
    Object.assign(this, {
      ...swsResponse,
      hardware: new DedicatedServerHardware(),
      compatibleInstallationTemplates: [],
    });
  }

  setCompatibleInstallationTemplates(templates) {
    this.compatibleInstallationTemplates = templates.map((tpl) => {
      let template = tpl;

      if (!(template instanceof DedicatedServerInstallationTemplate)) {
        template = new DedicatedServerInstallationTemplate(template);
      }

      return template;
    });

    return this.compatibleInstallationTemplates;
  }
}

export default {
  DedicatedServer,
};
