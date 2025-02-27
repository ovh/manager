import head from 'lodash/head';
import find from 'lodash/find';
import findLast from 'lodash/findLast';

import { IG_MAP_URL, TRAVAUX_URL, GUIDES_URL } from './informations.constants';

export default /* @ngInject */ function PackInformationCtrl(
  $scope,
  $translate,
  $q,
  $state,
  $stateParams,
  TucToast,
  OvhApiPackXdsl,
  OvhApiXdsl,
  moment,
  $http,
) {
  const self = this;

  function getResiliationFollowUp() {
    return OvhApiPackXdsl.v6()
      .resiliationFollowUp({
        packName: $stateParams.packName,
      })
      .$promise.catch((err) =>
        err.status === 404 ? $q.when(null) : $q.reject(err),
      );
  }

  function getIsResiliationCancellable() {
    return OvhApiPackXdsl.Resiliation()
      .v6()
      .canCancelResiliation(
        {
          packName: $stateParams.packName,
        },
        null,
      )
      .$promise.then((result) => result.value);
  }

  function getAssociatedLine() {
    return OvhApiPackXdsl.Access()
      .v6()
      .getServices({
        packId: $stateParams.packName,
      })
      .$promise.then((access) =>
        OvhApiXdsl.Lines()
          .v6()
          .query({
            xdslId: head(access),
          })
          .$promise.then((lines) => head(lines)),
      );
  }

  function getOrderFollowUp(packName) {
    const url = `/pack/xdsl/${packName}/orderFollowUp`;

    return $http.get(url).then(({ data: orders }) => {
      let actualOrder = find(orders, (order) => order.status === 'doing');

      if (!actualOrder) {
        actualOrder = findLast(orders, (order) => order.status === 'done');
      }

      if (actualOrder?.doneDate) {
        actualOrder.doneDateLocale = new Date(
          actualOrder.doneDate,
        ).toLocaleString();
      }
      return actualOrder;
    });
  }

  function init() {
    self.isLoading = true;

    self.servicesStateLink = {
      igmap: IG_MAP_URL.FR,
      travaux: TRAVAUX_URL,
      guides: GUIDES_URL.FR,
    };

    return $q
      .all({
        followUp: getResiliationFollowUp(),
        cancellable: getIsResiliationCancellable(),
        associatedLine: getAssociatedLine(),
        orderFollowUp: getOrderFollowUp($stateParams.packName),
      })
      .then((result) => {
        self.resiliationFollowUp = result.followUp;
        self.isCancellable = result.cancellable;
        self.associatedLine = result.associatedLine;
        self.actualOrder = result.orderFollowUp;
        console.log(self.actualOrder, 'actualOrder');
        self.isEngaged = moment(
          $scope.Pack.pack.informations.engagedUpTo,
        ).isAfter(moment());
      })
      .catch((err) => {
        if (err.status !== 460 && err.status !== 403) {
          TucToast.error(
            [
              $translate.instant('pack_xdsl_oops_an_error_is_occured'),
              err.data ? err.data.message : '',
            ].join(' '),
          );
        }
        return $q.reject(err);
      })
      .finally(() => {
        self.isLoading = false;
      });
  }

  init();
}
