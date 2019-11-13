export default class {
  terminate() {
    this.isTerminating = true;
    return this.confirm();
  }
}
