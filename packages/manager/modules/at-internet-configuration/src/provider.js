export default class atInternetConfigurationProvider {
  constructor() {
    this.stateRules = [];
    this.extraConfig = {};
    this.config = {};
    this.skipInit = false;
  }

  setConfig(config) {
    this.config = config;
  }

  setReplacementRules(rules) {
    this.stateRules = [...this.stateRules, ...rules];
  }

  setSkipInit(isSkipInit) {
    this.skipInit = isSkipInit;
  }

  setPrefix(prefix) {
    this.prefix = prefix;
  }

  $get() {
    return {
      config: this.config,
      skipInit: this.skipInit,
      setExtraConfig: (config) => {
        this.extraConfig = config;
      },
      getConfig: (region) => ({
        ...(this.config[region] && this.config[region].config),
        ...this.extraConfig,
      }),
    };
  }
}
