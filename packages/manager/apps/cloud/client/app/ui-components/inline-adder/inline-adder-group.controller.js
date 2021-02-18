class InlineAdderGroupCtrl {
  $onInit() {
    this.item = this.item || null;
    this.isNewItem = this.isNewItem !== 'undefined' ? this.isNewItem : true;
  }

  add() {
    return this.parent.add(this.item);
  }

  remove() {
    return this.parent.remove(this.item);
  }

  isLoading() {
    return this.parent.isLoading(this.item);
  }
}

angular
  .module('managerApp')
  .controller('InlineAdderGroupCtrl', InlineAdderGroupCtrl);
