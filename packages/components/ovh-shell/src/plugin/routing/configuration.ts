interface ApplicationConfiguration {
  id: string;
  path: string;
  publicURL?: string;
}

function pathEquals(a: string, b: string): boolean {
  return (a || '/').replace(/\/$/g, '') === (b || '/').replace(/\/$/g, '');
}

class RoutingConfiguration {
  config: Record<string, ApplicationConfiguration>;

  pathEquals: (a: string, b: string) => boolean;

  default: ApplicationConfiguration;

  redirections: Record<string, URL>;

  constructor() {
    this.config = {};
    this.redirections = {};
    this.pathEquals = pathEquals;
  }

  addConfiguration(config: ApplicationConfiguration): void {
    this.config[config.id] = config;
    if (!this.default) {
      this.default = config;
    }
  }

  addRedirection(id: string, href: string): void {
    this.redirections[id] = new URL(href);
  }

  findRedirection(id: string): URL {
    return this.redirections[id];
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
