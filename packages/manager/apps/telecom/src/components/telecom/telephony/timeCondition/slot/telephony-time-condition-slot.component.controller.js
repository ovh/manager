import get from 'lodash/get';

angular.module('managerApp').controller(
  'voipTimeConditionSlotCtrl',
  class voipTimeConditionSlotCtrl {
    constructor($state) {
      this.$state = $state;
    }

    getSlotDetail(property) {
      if (this.slot.inEdition && this.slot.saveForEdition) {
        return get(this.slot.saveForEdition, property, '');
      }

      return get(this.slot, property, '');
    }
  },
);
