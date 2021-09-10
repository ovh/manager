import uniq from 'lodash/uniq';

export default class MailingListsCreateModeratorsCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, MailingLists) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.MailingLists = MailingLists;
  }

  $onInit() {
    this.errors = [];
    this.mailingList = angular.copy(this.$scope.currentActionData.mailingList);
    this.moderators = angular.copy(this.$scope.currentActionData.moderators);
    this.loading = false;
    this.selection = [];

    this.$scope.deleteModerators = () => this.deleteModerators();
  }

  static addressValidator(addr) {
    return validator.isEmail(addr) && /^[\w@.-]+$/.test(addr);
  }

  deleteModerators() {
    this.loading = true;
    const moderatorsToDelete = uniq(this.selection);

    return this.MailingLists.deleteModerators(this.$stateParams.productId, {
      mailingList: this.mailingList.name,
      users: moderatorsToDelete,
      type: 'moderator',
    })
      .then((tasks) => {
        this.Alerter.alertFromSWSBatchResult(
          {
            OK: this.$translate.instant(
              moderatorsToDelete.length === 1
                ? 'mailing_list_tab_modal_moderator_delete_success'
                : 'mailing_list_tab_modal_moderators_delete_success',
            ),
            PARTIAL: this.$translate.instant(
              'mailing_list_tab_modal_moderators_delete_error',
            ),
            ERROR: this.$translate.instant(
              'mailing_list_tab_modal_moderators_delete_error',
            ),
          },
          tasks,
          this.$scope.alerts.main,
        );

        this.MailingLists.pollState(this.$stateParams.productId, {
          id: tasks.task,
          mailingList: this.mailingList,
          successStates: ['noState'],
          namespace: 'mailingLists.moderators.poll',
        });
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            moderatorsToDelete.length === 1
              ? 'mailing_list_tab_modal_moderator_delete_error'
              : 'mailing_list_tab_modal_moderators_delete_error',
          ),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
