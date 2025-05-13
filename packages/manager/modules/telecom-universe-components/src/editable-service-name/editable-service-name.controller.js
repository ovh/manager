import angular from 'angular';
import forEach from 'lodash/forEach';

export default /* @ngInject */ function($translate) {
  const self = this;

  self.inEdition = false;
  self.model = {
    serviceName: null,
  };
  self.loading = {
    save: false,
  };

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.startEdition = function startEdition() {
    self.inEdition = true;
    self.model.serviceName = self.title;
    if (self.onEditStart) {
      self.onEditStart()();
    }
  };

  self.cancelEdition = function cancelEdition() {
    self.inEdition = false;
    self.model.serviceName = null;
    if (self.onEditCancel) {
      self.onEditCancel()();
    }
  };

  self.saveServiceName = function saveServiceName() {
    self.loading.save = true;
    self.title = self.model.serviceName;
    self.inEdition = false;
    return self
      .onSave()(self.model.serviceName)
      .finally(() => {
        self.cancelEdition();
        self.loading.save = false;
      });
  };

  self.getTitle = function getTitle() {
    return $translate.instant(
      'common_service_name_edit_title',
      { title: this.title },
      null,
      null,
      (value, mode) => {
        if (mode === 'params') {
          const sanitized = {};

          // allow attribute values as per W3C (https://www.w3.org/TR/xml/#NT-AttValue)
          forEach(Object.keys(value), (key) => {
            if (angular.isString(value[key])) {
              sanitized[key] = value[key].replace(/[<&"]/g, '');
            } else {
              sanitized[key] = value[key];
            }
          });
          return sanitized;
        }
        return value;
      },
    );
  };

  /* -----  End of ACTIONS  ------*/
}
