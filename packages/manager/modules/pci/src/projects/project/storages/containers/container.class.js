
export default class Container {
  constructor(resource) {
    this.publicUrl = null;
    Object.assign(this, resource);
  }
}
