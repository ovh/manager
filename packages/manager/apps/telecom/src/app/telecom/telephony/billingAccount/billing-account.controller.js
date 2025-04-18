import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';

export default /* @ngInject */ function TelecomTelephonyBillingAccountCtrl(
  $q,
  $translate,
  $stateParams,
  abbreviatedNumbersLink,
  administrationLink,
  billingLink,
  billingAccountLink,
  currentActiveLink,
  guidesLink,
  manageContactsLink,
  orderAliasLink,
  phonebookLink,
  servicesLink,
  shellClient,
  TelephonyMediator,
  TucToast,
  OvhApiOrder,
  OvhApiTelephony,
  CHANGELOG,
) {
  const self = this;

  self.loading = {
    init: false,
    save: false,
  };

  self.abbreviatedNumbersLink = abbreviatedNumbersLink;
  self.administrationLink = administrationLink;
  self.billingLink = billingLink;
  self.billingAccountLink = billingAccountLink;
  self.currentActiveLink = currentActiveLink;
  self.guidesLink = guidesLink;
  self.manageContactsLink = manageContactsLink;
  self.orderAliasLink = orderAliasLink;
  self.phonebookLink = phonebookLink;
  self.servicesLink = servicesLink;

  self.group = null;
  self.terminationTask = null;

  self.CHANGELOG = CHANGELOG;

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.groupNameSave = function groupNameSave(newServiceName) {
    self.group.startEdition();
    self.group.description = newServiceName;
    return self.group.save().then(
      () => {
        self.group.stopEdition();
        shellClient.ux.updateMenuSidebarItemLabel(
          self.group.billingAccount,
          newServiceName,
        );
      },
      (error) => {
        self.group.stopEdition(true);
        TucToast.error(
          [
            $translate.instant('telephony_group_rename_error', $stateParams),
            error.data.message,
          ].join(' '),
        );
        return $q.reject(error);
      },
    );
  };

  /* -----  End of ACTIONS  ------*/

  function fetchGroupTerminationTask(group) {
    return OvhApiTelephony.OfferTask()
      .v6()
      .query({
        billingAccount: group.billingAccount,
      })
      .$promise.then((offerTaskIds) =>
        $q
          .all(
            map(
              offerTaskIds,
              (id) =>
                OvhApiTelephony.OfferTask()
                  .v6()
                  .get({
                    billingAccount: group.billingAccount,
                    taskId: id,
                  }).$promise,
            ),
          )
          .then((tasks) => {
            self.terminationTask = head(
              filter(tasks, {
                action: 'termination',
                status: 'todo',
                type: 'offer',
              }),
            );
          }),
      );
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.loading.init = true;

    $q.all([
      TelephonyMediator.getGroup($stateParams.billingAccount).then(
        (group) => {
          self.group = group;
          return fetchGroupTerminationTask(group);
        },
        (error) => {
          TucToast.error(
            [
              $translate.instant('telephony_group_loading_error', $stateParams),
              error.data.message,
            ].join(' '),
          );
          return $q.reject(error);
        },
      ),
      OvhApiOrder.Telephony()
        .v6()
        .billingAccounts()
        .$promise.then((allowedBillingAccounts) => {
          self.canOrderAlias =
            allowedBillingAccounts.indexOf($stateParams.billingAccount) > -1;
          return self.canOrderAlias;
        }),
    ]).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
