export default class {
  /* @ngInject */

  constructor($scope) {
    this.$scope = $scope;

    this.disabled = true;
    this.currentContract = undefined;
    this.fullText = '';
    this.currentIndex = 0;
  }

  enable() {
    this.disabled = true;
  }

  disable() {
    this.disabled = false;
  }

  setFullText(fullText) {
    this.fullText = fullText;
  }

  getContractAtIndex(index) {
    return this.ovhContracts[index];
  }

  setCurrentIndex(index) {
    this.currentIndex = index;
  }

  hasNextElement() {
    return this.currentIndex + 1 < this.ovhContracts.length;
  }

  hasPreviousElement() {
    return this.currentIndex - 1 >= 0;
  }

  next() {
    if (this.hasNextElement()) {
      this.scroll(this.currentIndex + 1);
    }
  }

  previous() {
    if (this.hasPreviousElement()) {
      this.scroll(this.currentIndex - 1);
    }
  }

  scroll(index) {
    this.$scope.scrollToContract(index);
  }
}
