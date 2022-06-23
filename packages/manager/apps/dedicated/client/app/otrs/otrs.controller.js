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
      values: TICKET_LAST_MESSAGE_FROM.map((option) =>
        this.$translate.instant(`otrs_table_ticket_lastMessageFrom_${option}`),
      ),
    };
  }

  setGridColumnStateTypeOptions() {
    this.gridColumnStateTypeOptions = {
      values: TICKET_STATE.map((option) =>
        this.$translate.instant(`otrs_table_ticket_state_${option}`),
      ),
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
