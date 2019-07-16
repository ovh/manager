angular.module('App').controller(
  'EmailProMXPlanMailingListsDeleteModeratorCtrl',
  class EmailProMXPlanMailingListsDeleteModeratorCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $translate
     * @param Alerter
     * @param EmailProMXPlanMailingLists
     */
    constructor($scope, $translate, Alerter, EmailProMXPlanMailingLists) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
    }

    $onInit() {
      this.mailingList = this.$scope.currentActionData.mailingList;
      this.moderators = this.$scope.currentActionData.moderators;
      this.loading = false;

      this.$scope.deleteModerators = () => this.deleteModerators();
    }

    deleteModerators() {
      this.loading = true;

      return this.EmailProMXPlanMailingLists.deleteModerators(_.get(this.$scope, 'exchange.associatedDomainName'), {
        mailingList: this.mailingList.name,
        users: this.moderators,
        type: 'moderator',
      })
        .then((tasks) => {
          this.Alerter.alertFromSWSBatchResult(
            {
              OK: this.$translate.instant(this.moderators.length === 1
                ? 'mailing_list_tab_modal_moderator_delete_success'
                : 'mailing_list_tab_modal_moderators_delete_success'),
              PARTIAL: this.$translate.instant('mailing_list_tab_modal_moderators_delete_error'),
              ERROR: this.$translate.instant('mailing_list_tab_modal_moderators_delete_error'),
            },
            tasks,
            this.$scope.alerts.main,
          );

          this.EmailProMXPlanMailingLists.pollState(this.$scope.exchange.associatedDomainName, {
            id: tasks.task,
            mailingList: this.mailingList,
            successStates: ['noState'],
            namespace: 'EmailProMXPlanMailingLists.moderators.poll',
          });
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(this.moderators.length === 1
              ? 'mailing_list_tab_modal_moderator_delete_error'
              : 'mailing_list_tab_modal_moderators_delete_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
