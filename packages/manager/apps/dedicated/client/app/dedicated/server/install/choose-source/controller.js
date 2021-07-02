export default class DedicatedServerInstallChooseSourceCtrl {
  /* @ngInject */
  constructor() {}

  onChooseSource(source) {
    switch(source) {
      case 'ovh':
        this.goToOsInstallOvh(source);
        break;
      case 'personal':
        this.goToOsInstallGabarit(source);
        break;
      case 'image':
        this.goToOsInstallImage(source);
        break;
    }
  }
}
