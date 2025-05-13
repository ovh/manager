import template from './uploader.html';
import controller from './uploader.controller';

export default /* @ngInject */ () => ({
  restrict: 'A',
  transclude: true,
  require: [
    '^^?telephonyNumber',
    '^^?telephonyNumberOvhPabx',
    'telephonyNumberOvhPabxSoundUploader',
  ],
  template,
  controllerAs: '$ctrl',
  scope: {
    ovhPabx: '=?',
    file: '=ngModel',
    $errors: '=uploadErrors',
  },
  bindToController: true,
  controller,
  link(tScope, tElement, tAttributes, controllers) {
    /*= =====================================
            =            INITIALZIATION            =
            ====================================== */

    function init() {
      // check for tag name
      if (tElement.get(0).tagName !== 'LABEL') {
        throw new Error(
          'Please set telephonyNumberOvhPabxSoundUploader on a label tag',
        );
      }

      // set controllers
      const soundUploaderCtrl = controllers[2];
      // eslint-disable-next-line prefer-destructuring
      soundUploaderCtrl.numberCtrl = controllers[0];
      // eslint-disable-next-line prefer-destructuring
      soundUploaderCtrl.ovhPabxCtrl = controllers[1];

      // check for required parents or attributes
      if (!soundUploaderCtrl.numberCtrl && !soundUploaderCtrl.ovhPabx) {
        throw new Error(
          'telephonyNumberOvhPabxSoundUploader must have telephonyNumber component as parent or must have ovhPabx attribute specified',
        );
      }

      if (!soundUploaderCtrl.ovhPabx) {
        soundUploaderCtrl.ovhPabx = soundUploaderCtrl.numberCtrl.number.feature;
      }
    }

    /* -----  End of INITIALZIATION  ------*/

    init();
  },
});
