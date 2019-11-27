import template from './black-friday-notice.html';

export default {
  controller: /* @ngInject */ function ctrl(pciProjectBlackFridayService) {
    this.$onInit = function $onInit() {
      this.isAvailable = false;
      pciProjectBlackFridayService.isAvailable().then((available) => {
        this.isAvailable = available;
        this.legalNotice = null;
        return pciProjectBlackFridayService.getLegalNotice().then((notice) => {
          this.legalNotice = notice;
        });
      });
    };
  },
  template,
};
