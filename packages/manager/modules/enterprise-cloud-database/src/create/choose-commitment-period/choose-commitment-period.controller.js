export default class {
  constructor($timeout) {
    'ngInject';

    this.$timeout = $timeout;
  }

  $onInit() {
    this.selectedCommitmentPeriod = this.enterpriseDb.commitmentPeriod;
  }

  onCommitmentPeriodSelect(commitmentPeriod) {
    this.selectedCommitmentPeriod = commitmentPeriod;
    this.enterpriseDb.commitmentPeriod = commitmentPeriod;
    if (this.onChange) {
      this.$timeout(() => this.onChange({
        commitmentPeriod,
      }));
    }
  }
}
