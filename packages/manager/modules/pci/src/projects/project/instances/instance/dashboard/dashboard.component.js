import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    instanceId: '<',
    onClickEdit: '&',
    onClickBackupCreate: '&',
    onClickRescue: '&',
    onClickSoftReboot: '&',
    onClickHardReboot: '&',
    onClickReinstall: '&',
    onClickDelete: '&',
    onClickManageVolumes: '&',
    onClickVolumeAttach: '&',
    onClickNetworkManage: '&',
    onClickNetworkAttach: '&',
  },
};
