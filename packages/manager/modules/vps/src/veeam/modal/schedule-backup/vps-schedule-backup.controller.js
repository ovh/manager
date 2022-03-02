const RESCHEDULE_AUTOMATED_BACKUP_NAMESPACE =
  'dedicated.vps.veeam.reschedule-automated-backup';

export default class VpsScheduleBackupCtrl {
  /* @ngInject */
  constructor($translate, atInternet, CucCloudMessage, Poller, VpsService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.Poller = Poller;
    this.VpsService = VpsService;
    this.model = {
      rescheduleTimepicker: null,
    };
  }

  $onInit() {
    this.model.rescheduleTimepicker = this.automatedBackupOption.schedule;
    this.isLoading = false;
  }

  $onDestroy() {
    this.Poller.kill({
      namespace: RESCHEDULE_AUTOMATED_BACKUP_NAMESPACE,
    });
  }

  /**
   * Wait the triggered task
   * @param taskId {Number}: id of running task
   * @returns {Promise}: task promise
   */
  waitRescheduleAutomatedBackupTask(taskId) {
    const endPointUrl = `/vps/${this.serviceName}/tasks/${taskId}`;
    return this.Poller.poll(endPointUrl, null, {
      interval: 1000,
      successRule(task) {
        return task.state === 'done';
      },
      namespace: RESCHEDULE_AUTOMATED_BACKUP_NAMESPACE,
      notifyOnError: false,
    });
  }

  /**
   * Triggered on customer click on confirm modal button
   */
  onRescheduledAutomatedBackupConfirmed() {
    this.trackClick('confirm');
    this.isLoading = true;
    this.VpsService.scheduleBackup(
      this.serviceName,
      this.model.rescheduleTimepicker,
    )
      .then((task) => this.waitRescheduleAutomatedBackupTask(task.id))
      .then(() => {
        this.automatedBackupOption.schedule = this.model.rescheduleTimepicker;
        return this.goBack().then(() =>
          this.CucCloudMessage.success(
            this.$translate.instant(
              'vps_configuration_veeam_schedule_backup_action_success_message',
            ),
          ),
        );
      })
      .catch(({ data: error }) => {
        return this.goBack().then(() =>
          this.CucCloudMessage.error(
            this.$translate.instant(
              'vps_configuration_veeam_schedule_backup_action_error_message',
              { message: error.message },
            ),
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onRescheduleAutomatedBackupCancel() {
    this.trackClick('cancel');
    this.goBack();
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `vps::detail::veeam::schedule-backup::${hit}`,
      type: 'action',
    });
  }
}
