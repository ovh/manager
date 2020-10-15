import get from 'lodash/get';

export default class voipTimeConditionSlotCtrl {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  getSlotDetail(property) {
    if (this.slot.inEdition && this.slot.saveForEdition) {
      return get(this.slot.saveForEdition, property, '');
    }

    return get(this.slot, property, '');
  }
}
