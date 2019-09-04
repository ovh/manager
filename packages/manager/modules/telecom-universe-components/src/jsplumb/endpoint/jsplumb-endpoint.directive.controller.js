import uniqueId from 'lodash/uniqueId';

export default function () {
  const self = this;

  self.endpoint = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    if (!self.uuid) {
      self.uuid = uniqueId('endpoint_');
    }
  };

  /* -----  End of INITIALIZATION  ------*/
}
