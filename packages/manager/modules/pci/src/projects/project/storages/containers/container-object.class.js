import 'moment';

export default class ContainerObject {
  constructor(resource) {
    this.retrievalDate = null;
    Object.assign(this, resource);
    this.name = this.name || this.key;
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
