class InlineAdderCtrl {
  constructor($q) {
    this.$q = $q;
  }

  $onInit() {
    this.onAdd = this.onAdd || null;
    this.onRemove = this.onRemove || null;
    this.uniqueProperty = this.uniqueProperty || null;

    this.loadingMap = {};
  }

  add(item) {
    let p = this.$q.resolve();
    if (this.isLoading(item)) {
      return p;
    }
    if (this.onAdd) {
      this.setLoading(item, true);
      p = this.onAdd({ item }).finally(() => this.setLoading(item, false));
    }
    return p;
  }

  remove(item) {
    let p = this.$q.resolve();
    if (this.isLoading(item)) {
      return p;
    }
    if (this.onRemove) {
      this.setLoading(item, true);
      p = this.onRemove({ item }).finally(() => this.setLoading(item, false));
    }
    return p;
  }

  getProperty(item) {
    if (!this.uniqueProperty) {
      return item;
    }
    const up = this.uniqueProperty
      .split('.')
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), item);
    return up;
  }

  isLoading(item) {
    const uniqueProperty = this.getProperty(item);
    if (this.loadingMap[uniqueProperty]) {
      return true;
    }
    return false;
  }

  setLoading(item, state) {
    const uniqueProperty = this.getProperty(item);
    this.loadingMap[uniqueProperty] = state;
  }
}

angular.module('managerApp').controller('InlineAdderCtrl', InlineAdderCtrl);
