import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function PackFaxActivationCtrl(
  $stateParams,
  OvhApiPackXdsl,
  OvhApiPackXdslVoipEcofax,
  URLS,
) {
  const self = this;

  const packId = $stateParams.packName;

  self.ecoFaxUrl = URLS.ecoFax;

  function init() {
    if (isEmpty(packId)) {
      self.error = {
        key: 'fax_activation_total_error',
      };
    } else {
      return OvhApiPackXdsl.v6().getServices(
        { packId },
        (data) => {
          self.loading = false;
          self.serviceData = find(data, { name: 'voipEcoFax' });
          self.error = null;
        },
        (err) => {
          self.loading = false;
          self.message = null;
          self.error = {
            key: `error_${err.status}`,
            data: err.data,
          };
        },
      );
    }
    return self;
  }

  self.activateFax = function activateFax() {
    self.loading = true;
    self.error = null;

    return OvhApiPackXdslVoipEcofax.v6().save(
      { packId },
      null,
      () => {
        self.loading = false;
        self.serviceData.available -= 1;
        self.serviceData.inCreation += 1;
        self.message = 'fax_activation_widget_success';
      },
      (err) => {
        self.loading = false;
        self.message = null;
        self.error = {
          key: `error_${err.status}`,
          data: err.data,
        };
      },
    );
  };

  init();
}
