/* global setTimeout */
angular.module('managerApp').controller('PackXdslCtrl',
  function PackXdslCtrl(
    $q,
    $state,
    $transitions,
    $translate,
    $stateParams,
    OvhApiPackXdsl,
    OvhApiXdsl,
    OvhApiXdslModem,
    SidebarMenu,
    smoothScroll,
    TucToast,
    TucToastError,
    PACK_XDSL,
  ) {
    const animTime = 1500;
    const noModemStatus = 404;
    const self = this;

    self.loading = {
      init: false,
    };

    this.content = {
      back: {},
    };

    function getPackXdsl() {
      return OvhApiPackXdsl.Aapi().get({
        packId: $stateParams.packName,
      }).$promise;
    }

    function getXdsl() {
      return OvhApiXdsl.v6().get({
        xdslId: $stateParams.serviceName,
      }).$promise;
    }

    function setAnim(className) {
      setTimeout(() => {
        self.content.back.class = className;
      }, animTime);
    }

    this.backState = function backState() {
      return $state.href(this.content.back.state);
    };

    function enableModemIfHaveOne() {
      return OvhApiXdslModem.v6().get({ xdslId: $stateParams.serviceName }).$promise.then(
        () => {
          self.disabledModem = false;
        },
        (err) => {
          if (err.status !== noModemStatus) {
            TucToastError(err);
            return $q.reject(err);
          }
          return err;
        },
      );
    }

    this.updateUIForState = function updateUIForState(state) {
      self.currentState = state.name;
      if ($stateParams.packName === PACK_XDSL.sdsl) {
        if (state.name === 'telecom.packs.pack.xdsl' || state.name === 'telecom.packs.pack.xdsl.modem' || state.name === 'telecom.packs.pack.xdsl.tasks') {
          setAnim('anim');
          return;
        }
      }

      smoothScroll(document.body);

      switch (state.name) {
        case 'telecom.packs.pack.xdsl.modem.wifi':
        case 'telecom.packs.pack.xdsl.modem.dmz':
        case 'telecom.packs.pack.xdsl.access-notifications':
        case 'telecom.packs.pack.xdsl.access-diagnostic':
        case 'telecom.packs.pack.xdsl.access-migration':
        case 'telecom.packs.pack.xdsl.access-ip':
        case 'telecom.packs.pack.xdsl.access-deconsolidation':
        case 'telecom.packs.pack.xdsl.access-order':
        case 'telecom.packs.pack.xdsl.access-resiliation':
        case 'telecom.packs.pack.xdsl.missing-rio':
        case 'telecom.packs.pack.xdsl.line-diagnostic':
        case 'telecom.packs.pack.xdsl.modem.templates':
        case 'telecom.packs.pack.xdsl.access-modem-exchange':
          setAnim('invert-anim');
          self.content.back.state = '^';
          getXdsl().then((xdsl) => {
            self.content.status = xdsl.status;
            self.content.accessType = xdsl.accessType;
          });
          break;
        case 'telecom.packs.pack.xdsl.modem':
        case 'telecom.packs.pack.xdsl.tasks':
        case 'telecom.packs.pack.xdsl':
          setAnim('anim');
          self.content.back.state = 'telecom.packs.pack';
          getXdsl().then((xdsl) => {
            self.content.status = xdsl.status;
            self.content.accessType = xdsl.accessType;
          });
          break;
        default:
          setAnim('anim');
          self.content.back = {};
          break;
      }
    };

    $transitions.onSuccess({}, (transition) => {
      self.updateUIForState(transition.to());
    });
    self.updateUIForState($state.current);

    self.isModemTabAvailable = function isModemTabAvailable() {
      // Modem tab not available for SDSL access
      if (self.content.accessType !== PACK_XDSL.sdsl) {
        return PACK_XDSL.availableModemTabStatus.includes(self.content.status);
      }
      return false;
    };

    /*= =============================
    =            ACTION            =
    ============================== */

    self.accessDescriptionSave = function accessDescriptionSave(newAccessDescr) {
      self.loading.save = true;

      return OvhApiXdsl.v6().put({
        xdslId: $stateParams.serviceName,
      }, {
        description: newAccessDescr,
      }).$promise.then(() => {
        self.access.description = newAccessDescr;

        // rename in sidebar menu
        SidebarMenu.updateItemDisplay({
          title: newAccessDescr || self.access.serviceName,
        }, $stateParams.serviceName, 'telecom-pack-section', $stateParams.packName);
      }, (error) => {
        TucToast.error([$translate.instant('xdsl_rename_error', $stateParams), error.data.message].join(' '));
        return $q.reject(error);
      }).finally(() => {
        self.loading.save = false;
      });
    };

    /* -----  End of ACTION  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

    function init() {
      self.loading.init = true;

      self.disabledModem = true;
      enableModemIfHaveOne();

      return $q.allSettled([
        getPackXdsl().then((pack) => {
          self.pack = pack;
        }),
        getXdsl().then((access) => {
          self.access = access;
        }),
      ]).finally(() => {
        self.loading.init = false;
      });
    }

    /* -----  End of INITIALIZATION  ------*/

    init();
  });
