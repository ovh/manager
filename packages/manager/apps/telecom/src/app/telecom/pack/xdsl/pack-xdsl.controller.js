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
        if (state.name === 'telecom.pack.xdsl' || state.name === 'telecom.pack.xdsl.modem' || state.name === 'telecom.pack.xdsl.tasks') {
          setAnim('anim');
          return;
        }
      }

      smoothScroll(document.body);

      switch (state.name) {
        case 'telecom.pack.xdsl.modem.wifi':
        case 'telecom.pack.xdsl.modem.dmz':
        case 'telecom.pack.xdsl.access-notifications':
        case 'telecom.pack.xdsl.access-diagnostic':
        case 'telecom.pack.xdsl.access-migration':
        case 'telecom.pack.xdsl.access-ip':
        case 'telecom.pack.xdsl.access-deconsolidation':
        case 'telecom.pack.xdsl.access-order':
        case 'telecom.pack.xdsl.access-resiliation':
        case 'telecom.pack.xdsl.missing-rio':
        case 'telecom.pack.xdsl.line-diagnostic':
        case 'telecom.pack.xdsl.modem.templates':
        case 'telecom.pack.xdsl.access-modem-exchange':
          setAnim('invert-anim');
          self.content.back.state = '^';
          getXdsl().then((xdsl) => {
            self.content.status = xdsl.status;
            self.content.accessType = xdsl.accessType;
          });
          break;
        case 'telecom.pack.xdsl.modem':
        case 'telecom.pack.xdsl.tasks':
        case 'telecom.pack.xdsl':
          setAnim('anim');
          self.content.back.state = 'telecom.pack';
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
