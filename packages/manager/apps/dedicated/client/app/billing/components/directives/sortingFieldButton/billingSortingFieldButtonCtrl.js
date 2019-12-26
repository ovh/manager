angular.module('Billing.directives').controller(
  'Billing.directives.billingSortingFieldButtonCtrl',
  class billingSortingFieldButtonCtrl {
    isActive() {
      return this.associatedField === this.activeField;
    }

    isAscending() {
      return !this.reverseOrder;
    }

    isDescending() {
      return this.reverseOrder;
    }

    onClick() {
      const newOrder = this.isActive() ? !this.reverseOrder : this.reverseOrder;
      if (angular.isFunction(this.onChange)) {
        this.onChange(this.associatedField, newOrder);
      }
    }
  },
);
