import map from 'lodash/map';

export default /* @ngInject */ function PackHostedEmailCtrl(
  $q,
  $translate,
  $stateParams,
  TucToast,
  OvhApiPackXdslHostedEmail,
) {
  const self = this;

  /**
   * Get the list of all hosted emails
   * @return {Promise}
   */
  this.loadServices = function loadServices() {
    this.loaders.services = true;

    return OvhApiPackXdslHostedEmail.v6()
      .query({
        packId: $stateParams.packName,
      })
      .$promise.then((services) => {
        self.services = map(services, (service) => ({
          name: service,
          domain: service.replace(/^.+\./, '.'),
        }));
        return self.services;
      })
      .catch((err) => {
        TucToast.error($translate.instant('hosted_email_loading_error'));
        return $q.reject(err);
      })
      .finally(() => {
        self.loaders.services = false;
      });
  };

  /**
   * Initialize controller
   */
  this.$onInit = function init() {
    this.services = [];
    this.loaders = {};

    return this.loadServices();
  };
}
