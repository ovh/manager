export default /* @ngInject */ function($transitions, SidebarMenu) {
  const self = this;

  self.loading = {
    translations: false,
    init: false,
  };

  self.items = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  STATE CHANGE  ----------*/

  function initStateChangeSuccess() {
    $transitions.onSuccess({}, () => {
      SidebarMenu.manageStateChange();
    });
  }

  /* ----------  DIRECTIVE INITIALIZATION  ----------*/

  function init() {
    self.loading.init = true;

    return SidebarMenu.loadInit()
      .then(() => {
        initStateChangeSuccess();
        self.items = SidebarMenu.items;
        self.actionsOptions = SidebarMenu.actionsMenuOptions;
        self.popoverSettings = {
          placement: 'bottom-left',
          class: 'order-actions-menu-popover',
          trigger: 'outsideClick',
        };
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
