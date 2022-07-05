import { TICKET_STATE, TICKET_LAST_MESSAGE_FROM } from './otrs.constants';

export default class otrsCtrl {
  /* @ngInject */
  constructor($translate, OtrsPopupService) {
    this.$translate = $translate;
    this.OtrsPopupService = OtrsPopupService;
  }

  $onInit() {
    this.setGridColumnLastMessageFromTypeOptions();
    this.setGridColumnStateTypeOptions();
  }

  setGridColumnLastMessageFromTypeOptions() {
    this.gridColumnLastMessageFromTypeOptions = {
      values: TICKET_LAST_MESSAGE_FROM.reduce((accumulator, option) => {
        accumulator[option] = this.$translate.instant(
          `otrs_table_ticket_lastMessageFrom_${option}`,
        );
        return accumulator;
      }, {}),
    };
  }

  setGridColumnStateTypeOptions() {
    this.gridColumnStateTypeOptions = {
      values: TICKET_STATE.reduce((accumulator, option) => {
        accumulator[option] = this.$translate.instant(
          `otrs_table_ticket_state_${option}`,
        );
        return accumulator;
      }, {}),
    };
  }

  openDialog = () => {
    if (!this.OtrsPopupService.isLoaded()) {
      this.OtrsPopupService.init();
    } else {
      this.OtrsPopupService.toggle();
    }
  };
}
