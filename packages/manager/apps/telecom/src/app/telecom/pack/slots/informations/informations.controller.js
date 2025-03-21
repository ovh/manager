import head from 'lodash/head';

import { IG_MAP_URL, TRAVAUX_URL, GUIDES_URL } from './informations.constants';

export default class PackInformationCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $q,
    $state,
    $stateParams,
    TucToast,
    OvhApiPackXdsl,
    OvhApiXdsl,
    OrderFollowUpService,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.TucToast = TucToast;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiXdsl = OvhApiXdsl;
    this.OrderFollowUpService = OrderFollowUpService;
  }

  $onInit() {
    this.isLoading = true;

    this.servicesStateLink = {
      igmap: IG_MAP_URL.FR,
      travaux: TRAVAUX_URL,
      guides: GUIDES_URL.FR,
    };

    return this.$q
      .all({
        followUp: this.getResiliationFollowUp(),
        cancellable: this.getIsResiliationCancellable(),
        associatedLine: this.getAssociatedLine(),
        orderFollowUp: this.getOrderFollowUp(this.$stateParams.packName),
      })
      .then((result) => {
        this.resiliationFollowUp = result.followUp;
        this.isCancellable = result.cancellable;
        this.associatedLine = result.associatedLine;
        this.actualOrder = result.orderFollowUp;
        this.isEngaged = moment(
          this.$scope.Pack.pack.informations.engagedUpTo,
        ).isAfter(moment());
      })
      .catch((err) => {
        if (err.status !== 460 && err.status !== 403) {
          this.TucToast.error(
            [
              this.$translate.instant('pack_xdsl_oops_an_error_is_occured'),
              err.data ? err.data.message : '',
            ].join(' '),
          );
        }
        return this.$q.reject(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getResiliationFollowUp() {
    return this.OvhApiPackXdsl.v6()
      .resiliationFollowUp({
        packName: this.$stateParams.packName,
      })
      .$promise.catch((err) =>
        err.status === 404 ? this.$q.when(null) : this.$q.reject(err),
      );
  }

  getIsResiliationCancellable() {
    return this.OvhApiPackXdsl.Resiliation()
      .v6()
      .canCancelResiliation(
        {
          packName: this.$stateParams.packName,
        },
        null,
      )
      .$promise.then((result) => result.value);
  }

  getAssociatedLine() {
    return this.OvhApiPackXdsl.Access()
      .v6()
      .getServices({
        packId: this.$stateParams.packName,
      })
      .$promise.then((access) =>
        this.OvhApiXdsl.Lines()
          .v6()
          .query({
            xdslId: head(access),
          })
          .$promise.then((lines) => head(lines)),
      );
  }

  getOrderFollowUp(packName) {
    return this.OrderFollowUpService.getOrderFollowUp(packName).then((data) => {
      const actualOrder =
        data.find(({ status }) => status === 'doing') ||
        data.findLast(({ status }) => status === 'done');
      if (actualOrder?.doneDate) {
        actualOrder.doneDateLocale = new Date(
          actualOrder.doneDate,
        ).toLocaleString();
      }
      return actualOrder;
    });
  }
}
