import get from 'lodash/get';
import set from 'lodash/set';
import some from 'lodash/some';

export default /* @ngInject */ function telephonyNumberOvhPabxDialplanCtrl(
  $q,
  $timeout,
  $translate,
  TucToast,
  TUC_UI_SORTABLE_HELPERS,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.popoverStatus = {
    isOpen: false,
    move: false,
    rightPage: null,
  };

  self.displayHelpers = {
    collapsed: false,
    expanded: true,
  };

  self.sortableOptions = null;
  self.ovhPabx = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.isLoading = function isLoading() {
    return (
      self.loading.init ||
      (self.dialplan &&
        ['OK', 'DRAFT', 'DELETE_PENDING'].indexOf(self.dialplan.status) === -1)
    );
  };

  self.hasInCreationExtension = function hasInCreationExtension() {
    return some(self.dialplan.extensions, {
      status: 'IN_CREATION',
    });
  };

  function createDialplan() {
    // add a dialplan to ovh pabx instance
    const dialplanToCreate = self.ovhPabx.addDialplan({
      name: $translate.instant(
        'telephony_number_feature_ovh_pabx_dialplan_new_name',
      ),
      status: 'DRAFT',
    });

    // create it from API
    return dialplanToCreate
      .create()
      .catch((error) => {
        // remove extension from dialplan list
        self.ovhPabx.removeDialplan(dialplanToCreate);
        return $q.reject(error);
      })
      .finally(() => {
        // refresh current dialplan
        self.ovhPabxCtrl.refreshDisplayedDialplan();
      });
  }

  function setConnectionVisibility(visibility) {
    $timeout(() => {
      self.numberCtrl.jsplumbInstance
        .getAllConnections()
        .forEach((connection) => {
          connection.setVisible(visibility);
        });
    }, 99);
  }

  /**
   *  Used to determine if extensions must be displayed or not.
   *  Used by telephonyNumberOvhPabxDialplanExtensionCtrl when an extension is deleted.
   */
  self.checkForDisplayHelpers = function checkForDisplayHelpers() {
    if (!self.dialplan.extensions.length) {
      self.displayHelpers.collapsed = true;
      self.displayHelpers.expanded = false;
    }
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onDialplanOutsideClick = function onDialplanOutsideClick() {
    if (self.dialplan.status !== 'DELETE_PENDING') {
      return;
    }

    // cancel delete confirm
    self.dialplan.status = 'OK';
  };

  self.onEditDialplanBtnClick = function onEditDialplanBtnClick() {
    self.popoverStatus.isOpen = true;
  };

  self.onDialplanCollapsed = function onDialplanCollapsed() {
    self.numberCtrl.jsplumbInstance.customRepaint().then(() => {
      setConnectionVisibility(true);
      self.displayHelpers.expanded = false;
    });
  };

  self.onDialplanExpanded = function onDialplanExpanded() {
    self.numberCtrl.jsplumbInstance.customRepaint().then(() => {
      setConnectionVisibility(true);
    });
  };

  self.onDialplanCollapsing = function onDialplanCollapsing() {
    setConnectionVisibility(false);
  };

  self.onDialplanExpanding = function onDialplanExpanding() {
    self.displayHelpers.expanded = true;
  };

  self.onExtensionAddBtnClick = function onExtensionAddBtnClick() {
    self.displayHelpers.collapsed = false;
    self.displayHelpers.expanded = true;

    const addedExtension = self.dialplan.addExtension({
      position: self.dialplan.extensions.length + 1,
      status: 'DRAFT',
    });

    return addedExtension.create();
  };

  /**
   *  Manage dialplan delete confirm button click.
   *  Deleting a dialplan means deleting its configuration (extension, rules, ...).
   *  Once dialplan is deleted, create a new one with default title.
   */
  self.onDialplanDeleteConfirmBtnClick = function onDialplanDeleteConfirmBtnClick() {
    return self.dialplan
      .remove()
      .then(() => {
        self.ovhPabx.removeDialplan(self.dialplan);
        return createDialplan();
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_number_feature_ovh_pabx_dialplan_delete_error',
            ),
            error.data && error.data.message,
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.ovhPabxDialplanCtrl.loading.remove = false;
      });
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    let sortInterval = null;
    let initPromise = $q.when(true);
    self.loading.init = true;

    // set ovhPabx instance
    self.ovhPabx = self.numberCtrl.number.feature;

    // set sortable options
    self.sortableOptions = {
      axis: 'y',
      handle: '.extension-grip',
      cancel: '.voip-plan__step-icon--grip-disabled',
      containment: 'parent',
      sort: TUC_UI_SORTABLE_HELPERS.variableHeightTolerance,
      start() {
        sortInterval = setInterval(() => {
          self.numberCtrl.jsplumbInstance.repaintEverything();
        }, 33);
      },
      stop() {
        if (sortInterval) {
          clearInterval(sortInterval);

          // redraw links for the last time
          self.numberCtrl.jsplumbInstance.customRepaint();
        }
      },
      update() {
        $timeout(() => {
          // update extensions positions
          angular.forEach(self.dialplan.extensions, (extension, index) => {
            set(extension, 'position', index + 1);
          });

          // call api to update all positions
          self.dialplan.updateExtensionsPositions();
        });
      },
    };

    if (self.dialplan) {
      // load extension if dialplan exists
      initPromise = self.dialplan.getExtensions();
    } else if (self.numberCtrl.number.feature.dialplans.length === 0) {
      initPromise = createDialplan();
    }

    return initPromise
      .then(() => {
        self.checkForDisplayHelpers();
      })
      .finally(() => {
        self.loading.init = false;
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_number_feature_ovh_pabx_load_error'),
            get(error, 'data.message') || '',
          ].join(' '),
        );
        return $q.reject(error);
      });
  };

  /* -----  End of INITIALIZATION  ------*/
}
