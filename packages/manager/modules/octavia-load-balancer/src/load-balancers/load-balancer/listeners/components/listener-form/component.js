import controller from './controller';
import template from './template.html';

export default {
  bindings: {
<<<<<<< HEAD:packages/manager/modules/octavia-load-balancer/src/load-balancers/load-balancer/listeners/components/listener-form/component.js
    model: '=',
    pools: '<',
    isEditing: '<?',
    onSubmit: '&',
    onCancel: '&',
=======
    loaders: '<',
    model: '<',
    trackingPrefix: '<',
    server: '<',
    serverType: '<',
>>>>>>> f24b076544 (fix(dedicated): fix tracking on 3az node (#10794)):packages/manager/modules/bm-server-components/src/general-information/install/image/components/config-drive/component.js
  },
  controller,
  template,
};
