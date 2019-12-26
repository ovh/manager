export default class ContainerObject {
  constructor(resource) {
    this.retrievalDate = null;
    Object.assign(this, resource);

    this.updateRetrievalDate();
  }

  updateRetrievalDate() {
    if (this.retrievalDelay) {
      this.retrievalDate = moment()
        .add(this.retrievalDelay, 'seconds')
        .toISOString();
    }
  }
}
