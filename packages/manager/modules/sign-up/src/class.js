import debounce from 'lodash/debounce';

export class WatchableModel {
  constructor(value, callback, debounceDelay = 0) {
    Object.defineProperties(this, {
      $value: {
        enumerable: false,
        writable: true,
        value,
      },
      $callback: {
        enumerable: false,
        writable: true,
        value: callback,
      },
      $debounceDelay: {
        enumerable: false,
        value: debounceDelay,
      },
    });
  }

  get value() {
    return this.$value;
  }

  set value(newValue) {
    const hasChanged = this.$value !== newValue;
    this.$value = newValue;
    if (hasChanged && this.$value && this.$callback) {
      debounce(this.$callback, this.$debounceDelay)();
    }
  }

  setCallback(callback) {
    this.$callback = callback;
  }
}

export default {
  WatchableModel,
};
