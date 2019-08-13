angular.module('managerApp').controller('telephonyNumberOvhPabxMenuListCtrl', function ($q, $timeout, $filter, $translate, $translatePartialLoader, TucToast) {
  const self = this;

  self.loading = {
    init: false,
    translations: false,
  };

  self.askedMenuDelete = null;
  self.idPrefix = null;

  self.menus = {
    raw: null,
    paginated: null,
    sorted: null,
    orderBy: 'name',
    orderDesc: false,
  };

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.orderByName = function () {
    self.menus.orderDesc = !self.menus.orderDesc;
  };

  function isDisabledMenuUsedInEntry(menu) {
    return _.some(menu.entries, entry => entry.action === 'menuSub' && (entry.actionParam === self.disableMenuId || isDisabledMenuUsedInEntry(self.ovhPabx.getMenu(entry.actionParam))));
  }

  self.isMenuChoiceDisabled = function (menu) {
    return self.disableMenuId
      && (self.disableMenuId === menu.menuId || isDisabledMenuUsedInEntry(menu));
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onMenuDeleteConfirm = function (menu) {
    return menu.remove().then(() => {
      self.ovhPabx.removeMenu(menu);
      self.onSelectedMenuChanged(null);
    }).catch((error) => {
      let errorTranslationKey = 'telephony_number_feature_ovh_pabx_menu_list_delete_error';
      if (error.status === 403) {
        errorTranslationKey = 'telephony_number_feature_ovh_pabx_menu_list_delete_error_used';
      }
      TucToast.error([$translate.instant(errorTranslationKey)].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.askedMenuDelete = null;
    });
  };

  self.onSelectedMenuChanged = function (menu) {
    if (self.onMenuSelected && _.isFunction(self.onMenuSelected())) {
      $timeout(() => {
        self.onMenuSelected()(menu);
      });
    }
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Translations load  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    $translatePartialLoader.addPart('../components/telecom/telephony/group/number/feature/ovhPabx/menu/list');
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  function getAllMenuEntries() {
    const entriesPromises = [];
    angular.forEach(self.ovhPabx.menus, (menu) => {
      entriesPromises.push(menu.getEntries());
    });

    return $q.allSettled(entriesPromises);
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function () {
    if (!self.numberCtrl && !self.ovhPabx) {
      throw new Error('telephonyNumberOvhPabxMenuList must have telephonyNumber component as parent or must have ovhPabx attribute specified');
    }

    self.loading.init = true;

    if (!self.ovhPabx) {
      self.ovhPabx = self.numberCtrl.number.feature;
    }

    if (!self.radioName) {
      self.radioName = 'menuChoice';
    }
    self.idPrefix = _.kebabCase(self.radioName);

    return $q.all({
      translations: getTranslations(),
      menusEntries: getAllMenuEntries(),
    }).then(() => {
      self.menus.raw = self.ovhPabx.menus;
    }).finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------*/
});
