import Ola from './ola.class';

export default class OlaService {
  /* @ngInject */
  constructor(olaConstants) {
    this.olaConstants = olaConstants;
  }

  computeOlaData(resources) {
    const ola = new Ola(resources);
    ola.constants = this.olaConstants;
    return ola;
  }
}
