import _ from 'lodash';

export default class PackCtrl {
  /* @ngInject; */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    PACK_DASHBOARD_SERVICES,
    OvhApiPackXdsl,
    PACK_PACK,
    resiliationNotification,
    TucToast,
    tucValidator,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.DASHBOARD = PACK_DASHBOARD_SERVICES;
    this.PACK = PACK_PACK;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.resiliationNotification = resiliationNotification;
    this.TucToast = TucToast;
    this.validator = tucValidator;
  }

  $onInit() {
    this.inError = false;
    this.loader = {
      page: true,
      service: true,
    };

    this.$scope.$on('reload-frames', () => this.$onInit());
    this.packDescriptionSave = this.updatePackDescriptionSave.bind(this);

    return this.$q.all({
      packInformation: this.getPackInformation(),
      frames: this.initFrames(),
    }).then(() => {
      if (_.isArray(this.frames)) {
        this.services = _.reduce(
          _.orderBy(this.frames, frame => frame.index),
          (all, elt, index) => {
            let line = [];
            if (index % 2) {
              line = _.last(all);
            } else {
              all.push(line);
            }
            line.push(elt);
            return all;
          },
          [],
        );
      }
      return this.services;
    });
  }

  getAllFrames(packId) {
    const promises = [];

    promises.push(this.OvhApiPackXdsl.v6().getServices({ packId })
      .$promise
      .then((services) => {
        const filteredServices = _.map(
          _.filter(services, service => this.DASHBOARD.indexOf(service.name) > -1),
          (service) => {
            const newService = service;
            let index = this.DASHBOARD.indexOf(service.name);
            if (index === -1) {
              index = this.DASHBOARD.length;
            }
            newService.index = index + 1;
            return newService;
          },
        );

        this.frames = [...this.frames, ...filteredServices];
      }));

    // Append task frame if tasks are pending
    promises.push(this.OvhApiPackXdsl.Tasks().v6().query({ packName: packId })
      .$promise
      .then((data) => {
        if (data.length) {
          this.frames.push(this.PACK.frames.task);
        }
        return data;
      }));

    // Check for a promotion code
    promises.push(this.OvhApiPackXdsl.PromotionCode().v6().capabilities({ packId })
      .$promise
      .then((capabilities) => {
        if (capabilities.canGenerate) {
          const promotionCodeFrame = _.clone(this.PACK.frames.promotionCode);
          promotionCodeFrame.data = capabilities;
          this.frames.push(promotionCodeFrame);
        }
        return capabilities;
      }));

    return this.$q.all(promises);
  }

  getPackInformation() {
    this.loader.page = true;
    return this.OvhApiPackXdsl.Aapi().get({ packId: this.$stateParams.packName })
      .$promise
      .then((packInfo) => {
        const mainAccess = _.find(packInfo.services, service => service.role === 'main');
        this.pack = _.assign(
          packInfo.general,
          {
            informations: packInfo.detail,
            mainAccess: _.assign(mainAccess, {
              isFiberPack: _.includes(this.PACK.fiberAccess, mainAccess.accessType),
            }),
          },
        );
        this.resiliationSuccess = this.resiliationNotification.success;
        this.resiliationNotification.success = false; // display only once
        this.cancelResiliationSuccess = this.resiliationNotification.cancelSuccess;
        this.resiliationNotification.cancelSuccess = false; // display only once
        return packInfo;
      })
      .catch((err) => {
        this.inError = true;
        this.TucToast.error(this.$translate.instant('pack_xdsl_oops_an_error_is_occured'));
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loader.page = false;
      });
  }

  /**
   * Validate email
   * @param {string} email Email address
   * @return {boolean}
   */
  checkEmailAddress(email) {
    return this.validator.isEmail(email);
  }

  /**
   * Initialize the frame list
   * @return {Promise}
   */
  initFrames() {
    this.loader.service = true;
    this.frames = [this.PACK.frames.informations];

    return this.getAllFrames(this.$stateParams.packName).catch((err) => {
      if (err.status !== 460 && err.status !== 403) {
        this.TucToast.error([this.$translate.instant('pack_xdsl_oops_an_error_is_occured'), _.get(err, 'data.message', '')].join(' '));
      }
      return this.$q.reject(err);
    }).finally(() => {
      this.loader.service = false;
    });
  }

  updatePackDescriptionSave(newPackDescription) {
    this.loader.save = true;

    return this.OvhApiPackXdsl.v6().put({
      packId: this.$stateParams.packName,
    }, {
      description: newPackDescription,
    })
      .$promise
      .then(() => {
        this.pack.description = newPackDescription;
        this.$scope.$emit('pack_updateName', this.$stateParams.packName, newPackDescription || this.pack.offerDescription);
      }, (error) => {
        this.TucToast.error([this.$translate.instant('pack_rename_error', this.$stateParams), error.data.message].join(' '));
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loader.save = false;
      });
  }
}
