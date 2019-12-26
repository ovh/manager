{
  function WebSiteSuccessController(
    $stateParams,
    $translate,
    User,
    Hosting,
    Alerter,
  ) {
    const self = this;

    self.type = $stateParams.type;
    self.domain = $stateParams.domain;
    self.hostingName = $stateParams.hosting;
    self.loading = self.type === 'classic';

    function init() {
      User.getUrlOf('guides').then((guides) => {
        self.guides = guides;
      });

      if (self.type === 'classic') {
        Hosting.getHosting(self.hostingName)
          .then((hosting) => {
            self.hosting = hosting;
          })
          .catch((err) =>
            Alerter.alertFromSWS(
              $translate.instant('website_success_text_classic_error'),
              err,
              'website.success.alert',
            ),
          )
          .finally(() => {
            self.loading = false;
          });
      }
    }

    init();
  }

  angular
    .module('App')
    .controller('WebSiteSuccessCtrl', WebSiteSuccessController);
}
