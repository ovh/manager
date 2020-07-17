export default class CardController {
  /* @ngInject */
  constructor($attrs, $element, $timeout, $transclude) {
    this.$attrs = $attrs;
    this.$element = $element;
    this.$timeout = $timeout;
    this.$transclude = $transclude;
  }

  $onInit() {
    this.addBooleanParameter(this, 'disabled');
    this.addBooleanParameter(this, 'selected');
    if (this.image) {
      this.isImgPath =
        /^data:/.test(this.image) || /\.(gif|png|jpg|svg)$/.test(this.image);
    }
    this.footerTranscluded = this.$transclude.isSlotFilled('footerSlot');
    this.bodyTranscluded = this.$transclude.isSlotFilled('bodySlot');
  }

  $postLink() {
    // Sometimes the digest cycle is done before dom manipulation,
    // So we use $timeout to force the $apply
    this.$timeout(() => {
      this.$element.removeAttr('id').removeAttr('name');
    });
  }

  addBooleanParameter(parameterName) {
    if (
      angular.isDefined(this.$attrs[parameterName]) &&
      this.$attrs[parameterName] === ''
    ) {
      this[parameterName] = true;
    }
  }

  onClick(model) {
    if (this.disabled || this.selected) {
      return;
    }
    this.selected = true;
    if (this.onChange) {
      this.$timeout(() => this.onChange(model));
    }
  }
}
