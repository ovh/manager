angular.module('managerApp').service('FaxSidebar', function ($translate, SidebarMenu, OvhApiFreeFax) {
  const self = this;

  self.mainSectionItem = null;

  /*= =======================================
    =            SUBITEMS LOADING            =
    ======================================== */

  self.loadFaxMainSection = function () {
    return OvhApiFreeFax.v6().query().$promise.then((faxList) => {
      _.sortBy(faxList, 'number').forEach((fax) => {
        SidebarMenu.addMenuItem({
          title: fax,
          prefix: $translate.instant('telecom_sidebar_fax_prefix_freefax'),
          state: 'freefax',
          stateParams: {
            serviceName: fax,
          },
        }, self.mainSectionItem);
      });
    });
  };

  /* -----  End of SUBITEMS LOADING  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.init = function () {
    self.mainSectionItem = SidebarMenu.addMenuItem({
      title: $translate.instant('telecom_sidebar_section_fax'),
      error: $translate.instant('telecom_sidebar_load_error'),
      category: 'freefax',
      icon: 'ovh-font ovh-font-print',
      allowSubItems: true,
      onLoad: self.loadFaxMainSection,
      loadOnState: 'freefax',
    });

    return self.mainSectionItem;
  };

  /* -----  End of INITIALIZATION  ------*/
});
