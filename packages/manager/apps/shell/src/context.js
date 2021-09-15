class ApplicationContext {
  constructor() {
    this.environment = null;
  }

  setEnvironment(env) {
    this.environment = env;
  }

  getEnvironment() {
    return this.environment;
  }
}

export default new ApplicationContext();
