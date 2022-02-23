interface ApplicationConfiguration {
  id: string;
  path: string;
}

function pathEquals(a: string, b: string): boolean {
  return (a || '/').replace(/\/$/g, '') === (b || '/').replace(/\/$/g, '');
}

class RoutingConfiguration {
  config: Record<string, ApplicationConfiguration>;

  pathEquals: (a: string, b: string) => boolean;

  default: ApplicationConfiguration;

  constructor() {
    this.config = {};
    this.pathEquals = pathEquals;
  }

  addConfiguration(config: ApplicationConfiguration): void {
    this.config[config.id] = config;
    if (!this.default) {
      this.default = config;
    }
  }

  findByPath(path: string): ApplicationConfiguration {
    let config;
    Object.entries(this.config).forEach(([, appConfig]) => {
      if (this.pathEquals(path, appConfig.path)) {
        config = appConfig;
      }
    });
    return config;
  }

  findById(id: string): ApplicationConfiguration {
    return this.config[id];
  }

  setDefault(config: ApplicationConfiguration): void {
    this.default = config;
  }

  getDefault(): ApplicationConfiguration {
    return this.default;
  }
}

export default RoutingConfiguration;
