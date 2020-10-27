import assign from 'lodash/assign';
import clone from 'lodash/clone';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import last from 'lodash/last';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';

export default class PackCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    DASHBOARD,
    OvhApiPackXdsl,
    PACK,
    resiliationNotification,
    SidebarMenu,
    TucToast,
    tucValidator,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.DASHBOARD = DASHBOARD;
    this.PACK = PACK;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.resiliationNotification = resiliationNotification;
    this.SidebarMenu = SidebarMenu;
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

    return this.$q
      .all({
        packInformation: this.getPackInformation(),
        frames: this.initFrames(),
      })
      .then(() => {
        if (isArray(this.frames)) {
          this.services = reduce(
            orderBy(this.frames, ['index']),
            (all, elt, index) => {
              // transform a  [1 x l] matrix to a [2 x l/2] matrix
              let line = [];
              if (index % 2) {
                line = last(all);
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

    promises.push(
      this.OvhApiPackXdsl.v6()
        .getServices({ packId })
        .$promise.then((services) => {
          const filteredServices = map(
            filter(
              services,
              (service) => this.DASHBOARD.services.indexOf(service.name) > -1,
            ),
            (service) => {
              const newService = service;
              let index = this.DASHBOARD.services.indexOf(service.name);
              if (index === -1) {
                index = this.DASHBOARD.services.length;
              }
              newService.index = index + 1;
              return newService;
            },
          );

          this.frames = [...this.frames, ...filteredServices];
        }),
    );

    // Append task frame if tasks are pending
    promises.push(
      this.OvhApiPackXdsl.Tasks()
        .v6()
        .query({ packName: packId })
        .$promise.then((data) => {
          if (data.length) {
            this.frames.push(this.PACK.frames.task);
          }
          return data;
        }),
    );

    // Check for a promotion code
    promises.push(
      this.OvhApiPackXdsl.PromotionCode()
        .v6()
        .capabilities({ packId })
        .$promise.then((capabilities) => {
          if (capabilities.canGenerate) {
            const promotionCodeFrame = clone(this.PACK.frames.promotionCode);
            promotionCodeFrame.data = capabilities;
            this.frames.push(promotionCodeFrame);
          }
          return capabilities;
        }),
    );

    return this.$q.all(promises);
  }

  getPackInformation() {
    this.loader.page = true;
    return this.OvhApiPackXdsl.Aapi()
      .get({ packId: this.$stateParams.packName })
      .$promise.then((packInfo) => {
        const mainAccess = find(
          packInfo.services,
          (service) => service.role === 'main',
        );
        this.pack = assign(packInfo.general, {
          informations: packInfo.detail,
          mainAccess: assign(mainAccess, {
            isFiberPack: includes(this.PACK.fiberAccess, mainAccess.accessType),
          }),
        });
        this.resiliationSuccess = this.resiliationNotification.success;
        this.resiliationNotification.success = false; // display only once
        this.cancelResiliationSuccess = this.resiliationNotification.cancelSuccess;
        this.resiliationNotification.cancelSuccess = false; // display only once
        return packInfo;
      })
      .catch(() => {
        this.inError = true;
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

    return this.getAllFrames(this.$stateParams.packName)
      .catch((err) => {
        if (err.status !== 460 && err.status !== 403) {
          this.TucToast.error(
            [
              this.$translate.instant('pack_xdsl_oops_an_error_is_occured'),
              get(err, 'data.message', ''),
            ].join(' '),
          );
        }
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loader.service = false;
      });
  }

  updatePackDescriptionSave(newPackDescription) {
    this.loader.save = true;

    return this.OvhApiPackXdsl.v6()
      .put(
        {
          packId: this.$stateParams.packName,
        },
        {
          description: newPackDescription,
        },
      )
      .$promise.then(
        () => {
          this.pack.description = newPackDescription;

          // rename in sidebar menu
          this.SidebarMenu.updateItemDisplay(
            {
              title: newPackDescription || this.pack.offerDescription,
            },
            this.$stateParams.packName,
            'telecom-pack-section',
          );
        },
        (error) => {
          this.TucToast.error(
            [
              this.$translate.instant('pack_rename_error', this.$stateParams),
              error.data.message,
            ].join(' '),
          );
          return this.$q.reject(error);
        },
      )
      .finally(() => {
        this.loader.save = false;
      });
  }
}
