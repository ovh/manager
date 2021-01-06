import head from 'lodash/head';

import { IG_MAP_URL, TRAVAUX_URL } from './informations.constants';

export default /* @ngInject */ function PackInformationCtrl(
  $scope,
  $translate,
  $q,
  $stateParams,
  TucToast,
  OvhApiPackXdsl,
  OvhApiXdsl,
  moment,
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

  function init() {
    self.isLoading = true;

    self.servicesStateLink = {
      igmap: IG_MAP_URL.FR,
      travaux: TRAVAUX_URL,
    };

    return $q
      .all({
        followUp: getResiliationFollowUp(),
        cancellable: getIsResiliationCancellable(),
        associatedLine: getAssociatedLine(),
      })
      .then((result) => {
        self.resiliationFollowUp = result.followUp;
        self.isCancellable = result.cancellable;
        self.associatedLine = result.associatedLine;
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
