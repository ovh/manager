import { DedicatedServerInstallationTemplatePartitionScheme } from './partition-scheme.class';

export class DedicatedServerInstallationTemplate {
  constructor(options = {}) {
    Object.assign(this, {
      ...options,
      defaultPartitionScheme: null,
    });
  }

  static getRandomTemplateName() {
    // for the random string, see https://.com/a/125stackoverflow02559
    return `tmp-mgr-${Math.random()
      .toString(36)
      .slice(2)}-${new Date().getTime()}`;
  }

  setDefaultPartitionScheme(partitionScheme) {
    let templatePartitionScheme = partitionScheme;

    if (
      !(
        templatePartitionScheme instanceof
        DedicatedServerInstallationTemplatePartitionScheme
      )
    ) {
      templatePartitionScheme = new DedicatedServerInstallationTemplatePartitionScheme(
        templatePartitionScheme,
      );
    }

    this.defaultPartitionScheme = templatePartitionScheme;
    return this.defaultPartitionScheme;
  }
}

export default {
  DedicatedServerInstallationTemplate,
};
