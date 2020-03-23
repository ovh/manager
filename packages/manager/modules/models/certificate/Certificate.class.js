export default class Certificate {
  constructor(name) {
    Object.assign(this, {
      name,
    });
  }

  isEnterprise() {
    return this.name === 'enterprise';
  }
}
