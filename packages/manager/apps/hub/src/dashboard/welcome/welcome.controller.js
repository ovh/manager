export default class WelcomeController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.name = this.coreConfig.getUser().firstname;
  }
}
