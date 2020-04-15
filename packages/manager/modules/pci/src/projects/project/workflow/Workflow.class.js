import map from 'lodash/map';
import 'moment';

import { WORKFLOW_TYPE_ENUM } from './workflow.constants';

export default class Workflow {
  constructor(resource) {
    Object.assign(this, resource);

    this.type = WORKFLOW_TYPE_ENUM.INSTANCE_BACKUP;
  }

  get latestExecution() {
    const executions = map(this.executions, ({ executedAt }) =>
      moment(executedAt),
    );
    return moment
      .max(executions)
      .utc()
      .format();
  }
}
