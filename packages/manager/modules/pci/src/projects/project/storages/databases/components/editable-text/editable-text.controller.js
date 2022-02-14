import uniqueId from 'lodash/uniqueId';

export default class PciEditableInputController {
  /* @ngInject */
  constructor($window) {
    this.$window = $window;
  }

  $onInit() {
    this.showInput = false;
    this.inputValue = this.value;
    this.id = uniqueId();
  }

  isInputValid() {
    const isMin = this.min ? this.inputValue.length >= this.min : true;
    const isMax = this.max ? this.inputValue.length <= this.max : true;
    const isPattern = this.pattern ? this.pattern.test(this.inputValue) : true;
    return isMin && isMax && isPattern;
  }

  setShowInput() {
    this.inputValue = this.value;
    this.showInput = true;
    setTimeout(
      () => this.$window.document.getElementById(this.id).focus(),
      100,
    );
  }

  reset() {
    this.inputValue = this.value;
    this.showInput = false;
  }

  emitChange() {
    if (this.isInputValid() && this.inputValue !== this.value) {
      this.onChange({ newValue: this.inputValue });
      this.showInput = false;
    }
  }

  blur() {
    this.emitChange();
    this.showInput = false;
  }

  handleKey($event) {
    if ($event.keyCode === 13) {
      this.emitChange();
    }
    if ($event.keyCode === 27) {
      this.reset();
    }
  }
}
