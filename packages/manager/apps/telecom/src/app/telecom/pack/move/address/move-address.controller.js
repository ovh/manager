import { UNBUNDLING } from '../pack-move.constant';

export default class MoveAddressCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.portLineNumber = false;
    this.keepLineNumber = false;
  }

  /**
   * Check if can keep line number
   * @returns {boolean}
   */
  canKeepNumber() {
    const canKeep =
      this.offer.portability &&
      this.offer.portability.eligibility.eligible &&
      this.offer.unbundling !== UNBUNDLING.partial;
    return canKeep;
  }

  next() {
    if (!this.canKeepNumber()) {
      this.keepLineNumber = false;
    }
    const form = {
      currentLandline: {
        lineNumber: this.lineNumber,
        portLineNumber: this.portLineNumber,
      },
      futureLandline: {
        lineNumber: this.futureLineNumber,
        keepLineNumber: this.keepLineNumber,
        rio: this.rio,
      },
    };
    this.$scope.$emit('savedNumber', form);
  }
}
