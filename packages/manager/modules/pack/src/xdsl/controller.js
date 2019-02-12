export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $transitions,
    $translate,
    $stateParams,
    OvhApiPackXdsl,
    OvhApiXdsl,
    OvhApiXdslModem,
    smoothScroll,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiXdsl = OvhApiXdsl;
    this.OvhApiXdslModem = OvhApiXdslModem;
    this.smoothScroll = smoothScroll;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.animTime = 1500;
    this.noModemStatus = 404;
    this.availableModemTabStatus = [
      'active',
      'migration',
      'upgradeOffer',
    ];

    this.loading = {
      init: false,
    };

    this.content = {
      back: {},
    };

    this.loading.init = true;

    this.disabledModem = true;
    this.enableModemIfHaveOne();

    this.$transitions.onSuccess({}, (transition) => {
      this.updateUIForState(transition.to());
    });
    this.updateUIForState(this.$state.current);


    return this.$q.allSettled([
      this.getPackXdsl().then((pack) => {
        this.pack = pack;
      }),
      this.getXdsl().then((access) => {
        this.access = access;
      }),
    ])
      .finally(() => {
        this.loading.init = false;
      });
  }

  getPackXdsl() {
    return this.OvhApiPackXdsl
      .Aapi()
      .get({
        packId: this.$stateParams.packName,
      })
      .$promise;
  }

  getXdsl() {
    return this.OvhApiXdsl
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise;
  }

  setAnim(className) {
    setTimeout(() => {
      this.content.back.class = className;
    }, this.animTime);
  }

  backState() {
    return this.$state.href(this.content.back.state);
  }

  enableModemIfHaveOne() {
    return this.OvhApiXdslModem
      .v6()
      .get({ xdslId: this.$stateParams.serviceName })
      .$promise
      .then(() => {
        this.disabledModem = false;
      },
      (err) => {
        if (err.status !== this.noModemStatus) {
          this.TucToastError(err);
          return this.$q.reject(err);
        }
        return err;
      });
  }

  updateUIForState(state) {
    this.currentState = state.name;
    if (this.$stateParams.packName === 'sdsl') {
      if (state.name === 'pack.xdsl' || state.name === 'pack.xdsl.modem' || state.name === 'pack.xdsl.tasks') {
        this.setAnim('anim');
        return;
      }
    }

    this.smoothScroll(document.body);

    switch (state.name) {
      case 'pack.xdsl.modem.wifi':
      case 'pack.xdsl.modem.dmz':
      case 'pack.xdsl.access-notifications':
      case 'pack.xdsl.access-diagnostic':
      case 'pack.xdsl.access-migration':
      case 'pack.xdsl.access-ip':
      case 'pack.xdsl.access-deconsolidation':
      case 'pack.xdsl.access-order':
      case 'pack.xdsl.access-resiliation':
      case 'pack.xdsl.missing-rio':
      case 'pack.xdsl.line-diagnostic':
        this.setAnim('invert-anim');
        this.content.back.state = '^';
        this.getXdsl().then((xdsl) => {
          this.content.status = xdsl.status;
        });
        break;
      case 'pack.xdsl.modem':
      case 'pack.xdsl.tasks':
      case 'pack.xdsl.access':
        this.setAnim('anim');
        this.content.back.state = 'pack';
        this.getXdsl().then((xdsl) => {
          this.content.status = xdsl.status;
        });
        break;
      default:
        this.setAnim('anim');
        this.content.back = {};
        break;
    }
  }

  isModemTabAvailable() {
    return this.availableModemTabStatus.indexOf(this.content.status) > -1;
  }

  accessDescriptionSave(newAccessDescr) {
    this.loading.save = true;

    return this.OvhApiXdsl.v6().put({
      xdslId: this.$stateParams.serviceName,
    }, {
      description: newAccessDescr,
    }).$promise.then(() => {
      this.access.description = newAccessDescr;

      // rename in sidebar menu
      this.$scope.$emit('pack_updateName', newAccessDescr || this.access.serviceName, this.$stateParams.serviceName);
    }, (error) => {
      this.TucToast.error([this.$translate.instant('xdsl_rename_error', this.$stateParams), error.data.message].join(' '));
      return this.$q.reject(error);
    }).finally(() => {
      this.loading.save = false;
    });
  }
}
