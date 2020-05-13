import set from 'lodash/set';

export default class {
  $onInit() {
    this.data = {
      dataReplication: this.replicationDisabled,
      generalConditions: false,
    };
  }

  updateConditions(property, value) {
    set(this.data, property, value);
    this.model = this.data.dataReplication && this.data.generalConditions;
  }
}
