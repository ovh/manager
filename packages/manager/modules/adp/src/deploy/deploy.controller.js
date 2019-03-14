
export default class {
  /* @ngInject */
  constructor() {
    this.name = 'deploy';
  }

  $onInit() {
    console.log('init', this.name);
  }
}
