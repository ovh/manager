angular.module('managerApp').service('SpareSidebar', class SpareSidebar {
  /* @ngInject */
  constructor($translate, SidebarMenu, OvhApiMeVipStatus) {
    this.$translate = $translate;
    this.SidebarMenu = SidebarMenu;
    this.OvhApiMeVipStatus = OvhApiMeVipStatus;
    this.mainSectionItem = null;
  }

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */
  init() {
    return this.OvhApiMeVipStatus.v6().get().$promise.then((vipStatus) => {
      if (vipStatus.telecom) {
        this.mainSectionItem = this.SidebarMenu.addMenuItem({
          title: this.$translate.instant('telecom_sidebar_section_spare'),
          category: 'spare',
          icon: 'ovh-font ovh-font-accessories',
          state: 'spare.modems',
          loadOnState: 'spare',
        });
      }
    });
  }
  /* -----  End of INITIALIZATION  ------*/
});
