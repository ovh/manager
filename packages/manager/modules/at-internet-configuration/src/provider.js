export default class atInternetConfigurationProvider {
  constructor() {
    this.stateRules = [];
    this.extraConfig = {};
    this.config = {};
    this.trackingPlugin = null;
  }

  setConfig(config) {
    this.config = config;
  }

  setTrackingPlugin(trackingPlugin) {
    this.trackingPlugin = trackingPlugin;
  }

  getTrackingPlugin() {
    return this.trackingPlugin;
  }

  setReplacementRules(rules) {
    this.stateRules = [...this.stateRules, ...rules];
  }

  setPrefix(prefix) {
    this.prefix = prefix;
  }

  $get() {
    return {
      config: this.config,
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
