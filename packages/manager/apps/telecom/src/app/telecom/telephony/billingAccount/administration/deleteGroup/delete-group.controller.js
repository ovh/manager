import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';

export default /* @ngInject */ function TelecomTelephonyBillingAccountAdministrationDeleteGroup(
  $stateParams,
  $q,
  $translate,
  OvhApiTelephony,
  TucToast,
  TucToastError,
) {
  const self = this;

  function getOfferTaskList(billingAccount) {
    return OvhApiTelephony.OfferTask()
      .v6()
      .query({
        billingAccount,
      })
      .$promise.then((offerTaskIds) =>
        $q.all(
          map(
            offerTaskIds,
            (id) =>
              OvhApiTelephony.OfferTask()
                .v6()
                .get({
                  billingAccount,
                  taskId: id,
                }).$promise,
          ),
        ),
      );
  }

  function fetchTerminationTask() {
    return getOfferTaskList($stateParams.billingAccount).then(
      (offerTaskList) => {
        self.task = head(
          filter(offerTaskList, {
            action: 'termination',
            status: 'todo',
            type: 'offer',
          }),
        );
        return self.task;
      },
    );
  }

  function fetchGroup() {
    return OvhApiTelephony.v6()
      .get({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((group) => {
        self.group = group;
      });
  }

  self.cancelTermination = function cancelTermination() {
    self.cancelling = true;
    return OvhApiTelephony.v6()
      .cancelTermination(
        {
          billingAccount: $stateParams.billingAccount,
        },
        {},
      )
      .$promise.then(() => fetchTerminationTask())
      .then(() => {
        const groupName = self.group.description || self.group.billingAccount;
        return TucToast.success(
          $translate.instant('telephony_delete_group_cancel_success', {
            group: groupName,
          }),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.cancelling = false;
      });
  };

  self.terminate = function terminate() {
    self.deleting = true;
    return OvhApiTelephony.v6()
      .delete(
        {
          billingAccount: $stateParams.billingAccount,
        },
        {},
      )
      .$promise.then(() => fetchTerminationTask())
      .then(() => {
        const groupName = self.group.description || self.group.billingAccount;
        return TucToast.success(
          $translate.instant('telephony_delete_group_delete_success', {
            group: groupName,
          }),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.deleting = false;
      });
  };

  function init() {
    self.loading = true;
    self.loaded = false;
    self.task = null;
    self.group = null;
    self.cancelling = false;
    self.deleting = false;
    return $q
      .all({
        group: fetchGroup(),
        task: fetchTerminationTask(),
      })
      .then(() => {
        self.loaded = true;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading = false;
      });
  }

  init();
}
