export default class ResiliateCtrl {
  /* @ngInject */
  constructor($state, $translate) {
    this.$state = $state;
    this.$translate = $translate;
  }

  $onInit() {
    const commitmentEndDate =
      this.service.billing?.lifecycle?.current?.terminationDate ||
      this.service.billing?.engagement?.endDate;
    const { expirationDate } = this.service.billing;

    this.message = this.$translate.instant(
      `resiliation_modal_resiliate_service_${this.capabilities[0]}`,
      {
        commitmentEndDate: moment(commitmentEndDate).format('DD/MM/YYYY'),
        expirationDate: moment(expirationDate).format('DD/MM/YYYY'),
      },
    );
    this.onChange = (value) => {
      this.message = this.$translate.instant(
        `resiliation_modal_resiliate_service_${value}`,
        {
          commitmentEndDate: moment(commitmentEndDate).format('DD/MM/YYYY'),
          expirationDate: moment(expirationDate).format('DD/MM/YYYY'),
        },
      );
    };
  }
}
