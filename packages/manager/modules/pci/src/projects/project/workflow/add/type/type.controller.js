import { WORKFLOW_TYPE_ENUM } from '../../workflow.constants';

export default class {
  $onInit() {
    this.WORKFLOW_TYPE_ENUM = WORKFLOW_TYPE_ENUM;
    this.selectedType = this.WORKFLOW_TYPE_ENUM.INSTANCE_BACKUP;
  }
}
