export default class HostingTerminateEmailCtrl {
  /* @ngInject */
  constructor($translate, Hosting) {
    this.$translate = $translate;
    this.Hosting = Hosting;
  }

  $onInit() {
    this.fetchEmailOptions();
  }

  fetchEmailOptions() {
    this.isLoading = true;
    return this.Hosting.getEmailOptions(this.serviceName)
      .then((options) => {
        this.emailOptions = options;
        [this.emailOption] = options;
      })
      .catch(() => {
        this.goBack(
          this.$translate.instant(
            'hosting_dashboard_service_terminate_email_options_error',
          ),
          'danger',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  terminateEmail() {
    this.isTerminating = true;
    return this.Hosting.terminateEmailOption(
      this.serviceName,
      this.emailOption.id,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'hosting_dashboard_service_terminate_email_success',
          ),
          'success',
        );
      })
      .catch(() => {
        this.goBack(
          this.$translate.instant(
            'hosting_dashboard_service_terminate_email_error',
          ),
          'danger',
        );
      });
  }
}
