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
      $debounceFn: {
        enumerable: false,
        writable: true,
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
      if (this.$debounceFn) {
        this.$debounceFn.cancel();
      }
      this.$debounceFn = debounce(this.$callback, this.$debounceDelay);
      this.$debounceFn();
    }
  }

  setCallback(callback) {
    this.$callback = callback;
  }
}

export default {
  WatchableModel,
};
