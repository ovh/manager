export default class {
  /* @ngInject */
  terminate() {
    this.isTerminating = true;
    return this.confirm();
  }
}
