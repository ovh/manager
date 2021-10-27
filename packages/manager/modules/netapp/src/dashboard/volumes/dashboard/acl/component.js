import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    acls: '<',
    createAcl: '<',
    deleteAcl: '<',
    serviceName: '<',
    shareACLPermissionEnum: '<',
    shareACLTypeEnum: '<',
    volumeId: '<',
  },
  controller,
  template,
};
